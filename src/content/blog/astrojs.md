---
title: "ブログをAstroに変更してみた"
date: 2023-02-02T00:00:00.000Z
updated: 2023-02-02T00:00:00.000Z
tags: 
  - JavaScript
  - Astro
---

去年に名前を見かけて気になっていた[Astro](https://astro.build/)について、やはり実験といえばココだろう、ということでブログをAstroを使って再度リニューアルしてみました。（ちょうどv2も公開されてたし）

また、JSを使わないAstroなのであればいっそのこと各処理のJSも削ってやろう、ということでアニメーションなどもCSSで実現してみました。


## 記事情報について

このブログは、MovableType -> WordPress -> Ghost -> Nuxt.js -> Gatsby.js -> Next.jsと変遷してきているのですが、Nuxt.jsを使う頃からMarkdownファイルとして各記事情報を保持しています。そして、AstroはMarkdownの読み込みをデフォルトで対応しています。便利。

v1の頃は`src/pages`にastroファイルと一緒に置く作りだったようですが、v2になると[Content Collections](https://docs.astro.build/en/guides/content-collections/)という機能が追加され、公式の機能としてMarkdownファイルを分けることが出来るようになりました。しかもFrontMatterの型定義・チェックまで行うことが出来ます。

このブログの場合はこんな感じの定義になっています。また、型定義については[zod](https://zod.dev/)を利用してるみたいです。

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.date(),
        updated: z.date().optional(),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().optional(),
    }),
});

export const collections = <const>{
    blog: blogCollection,
};
```

そうすると`.astro/types.d.ts`という型定義ファイルが作成され、そちらを利用することで記事を読み込む時にFrontMatterの型情報まで扱う事ができます。

```ts
// src/pages/[...page].astro

// `astro:content` で `.astro/type.d.ts`に定義されている型情報を読み込むことができます
import { CollectionEntry, getCollection } from "astro:content";
import type { GetStaticPathsOptions, Page } from "astro";

type Props = {
    page: Page<CollectionEntry<"blog">>;
};

export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
    return paginate(await getCollection("blog"), { pageSize: 20 } );
}

// この `page` には上記で指定した型定義が含まれています
const { page } = Astro.props;
```

### 参考

上記参考にさらっと記述されている関数は下記を参照ください。 ~~（まだ翻訳されてないけど、誰かが翻訳してくれるはず）~~

* [getStaticPaths](https://docs.astro.build/ja/reference/api-reference/#getstaticpaths)
* [getCollection](https://docs.astro.build/ja/reference/api-reference/#getcollection)
* [paginate](https://docs.astro.build/ja/reference/api-reference/#paginate)

また、Content Collectionsについてはこちらの記事が参考になりました。

* [Astro v2で導入された Content Collections の移行手順まとめ - hiroppy&#39;s site](https://hiroppy.me/blog/astro-content-collections)


## ちょっと工夫（無理やり作った）ところ

### 記事を投稿日降順に並べる

上記の`getCollection`を使うことで記事の一覧を読み込むことが可能ですが、Markdownのファイル名のアルファベット順でデータが取得されます。

このブログのMarkdownファイルには、`date`というDateTime形式のFrontMatterを各ファイルに指定してありますので、この値を使って降順で並び替えたかったのですが、`getCollection`には並び替え機能が無さそうでした。

`getCollection`の返り値は単純な配列だったので、その値にJavaScriptのsort関数を使って並び替えて実現しています。

```ts
export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
    return paginate(
        (await getCollection("blog")).sort(
            (a, b) => b.data.date.getTime() - a.data.date.getTime()
        ),
        { pageSize: 20 }
    );
}
```

### ページネーションのURL構造を変える

既にこれまでのサンプルで何度も出てきていますが、Astroの`paginate`関数はかなり便利に使うことができます。`[...page].astro`というファイルを作成して、`getStaticPaths`の返り値に`paginate`を渡せば、勝手にページを分割できます。

生成されるURL構造は、`src/pages/[...page].astro`というファイルで作った場合は下記のように生成されます。

```plaintext
http://example.com/
http://example.com/2/
http://example.com/3/
http://example.com/4/
```

しかし、このブログでは

```plaintext
http://example.com/
http://example.com/page/2/
http://example.com/page/3/
http://example.com/page/4/
```

のように分割したかったので、無理やり実現をしてみました。

まずは、`src/pages/index.astro`で1ページ目の一覧を手動で読み込みます。

```ts
// `PER_PAGE` というstatic変数を用意して1ページあたりの記事数を指定しています
const allPosts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
);
// `filteredPosts` が1ページ目に表示される記事一覧です
const filteredPosts = allPosts.slice(0, PER_PAGE);
const hasNext = allPosts.length > PER_PAGE;
```

そして、`src/pages/page/[...page].astro`ファイルを作成し、「1ページ目だけ」ファイルを生成しないようにしています。

```ts
// 1ページ目は `paginate` の返り値の `params.page` がundefinedになるので、filterで除外しています
export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
    return paginate(
        (await getCollection("blog")).sort(
            (a, b) => b.data.date.getTime() - a.data.date.getTime()
        ),
        { pageSize: PER_PAGE }
    ).filter((page) => page.params.page);
}
```

ちょっと怪しい作り方ですが…とりあえず動いているのでヨシとします。

## 雑感

Markdownを公式で対応しているのはかなり便利でした。Code HilightもShikiが最初から入っていたりと、ブログやドキュメントの作成を見越した作りになっていそうです。

また、Astroは独自のファイル形式（`.astro`）ですが、React（Next.js）によく似た記法で書くことができるため、Reactを利用したことがある方なら直ぐに利用できるんじゃないかと思いました。

実際には生成したページにReactやSvelteを組み込んだ形のMPA的な使い方がよりAstroの機能をフル活用した状態になるのですが、またそちらは色々調べてみようと思います。