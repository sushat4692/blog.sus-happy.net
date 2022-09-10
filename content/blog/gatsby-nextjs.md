---
title: "Gatsby.jsからNext.jsに乗り換えてみた"
date: 2020-11-15T00:31:00.000Z
updated: 2020-11-15T00:31:00.000Z
tags: 
  - JavaScript
  - React
  - Gatsby.js
  - Next.js
---

このブログは自分の実験場でもあるので、WordPress -> Ghost -> Nuxt.js -> Gatsby.jsと色々変更していたのですが、今回Next.jsに変更してみました。

[Next.jsの公式ドキュメントにもGatsby.jsからのマイグレーションの方法が記載されていた](https://nextjs.org/docs/migrating/from-gatsby)ので、そちらをベースに、ちょっと問題となった所をメモ。

（全体的にTypeScriptに変えています）

## getPostBySlug内でエラーが発生

[公式ドキュメントに記載のsrc/lib/blog.js](https://nextjs.org/docs/migrating/from-gatsby#data-fetching)を参考にしていたのですが、`getPostBySlug`内の`parseISO`でエラーが発生してしまいました。

原因としては自分の記事Markdownは`2020-11-15T00:00:00.000Z`という形式で記述していたところ、gray-matterの処理中で自動的にDate型に変換されていたので、`date-fns`の処理が不要でした。

## 前後の記事を取得する

（一応）ブログの体裁をとっているので、前後の記事へのリンクを貼っておきたいので、ちょっと無理やりな方法ですがSSGなので良しとして下記の方法で取ってみました。

まず、`getAllPosts`の結果を日付順に並び替えます。

```ts
// 型推論用に
export type BlogContent = {
  slug: string
  frontmatter: {
    title: string
    date: string
    datetime: number
    // 実際にはもうちょっとあるけど省略
  }
  content: string
}

// 比較出来るようにミリ秒の変数も追加
export const getPostBySlug = (slug: string): BlogContent => {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  // 自分の環境は下の処理は不要だった
  // const date = format(parseISO(data.date), 'MMMM dd, yyyy')
  const datetime = data.date.getTime()

  return { slug: realSlug, frontmatter: { ...data, datetime }, content }
}

// 一覧を返す前にsortを実行
export const getAllPosts = () => {
  const slugs = fs.readdirSync(postsDirectory)
  return slugs
    .map(slug => getPostBySlug(slug))
    .sort((a, b) => {
      if (a.frontmatter.datetime === b.frontmatter.datetime) {
        return 0
      }
      return a.frontmatter.datetime < b.frontmatter.datetime ? 1 : -1
    })
}
```

下記関数を作成して前後の記事を取得できるようにしました。  
単純に日付順になっているので記事スラッグから配列インデックスの-1/+1を取得しているだけです。

```ts
export const getNextPrevPosts = (slug: string) => {
  const posts = getAllPosts()
  const index = posts.findIndex(post => post.slug === slug)

  const prev = (() => {
    if (index <= 0) {
      return null
    }

    return posts[index - 1]
  })()

  const next = (() => {
    if (index >= posts.length - 1) {
      return null
    }

    return posts[index + 1]
  })()

  return { prev, next }
}
```

## ページネーション

上記前後の記事を取得する際に日付順に並び替えたので、そのままページ分割も行ってみます。

Dynapic Routes様のファイルを`pages/page/[p].tsx`を作成（ファイル名に`[]`を使うの気になるなぁ）し、`getStaticProps`・`getStaticPaths`を下記のように記述しました。

```ts
import { GetStaticProps, GetStaticPaths } from "next"
import { ParsedUrlQuery } from "querystring"

// 前後記事で用意した関数を取得
import { getAllPosts, BlogContent } from "../../lib/blog"

type Props = {
  p: number
  posts: BlogContent[]
  hasNext: boolean
  hasPrev: boolean
}

const PER_PAGE = 10;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const p = params.p ? parseInt(params.p as string) : 1

  const allPosts = getAllPosts()
  const hasNext = allPosts.length > (p - 1) * PER_PAGE + PER_PAGE
  const hasPrev = p > 1
  const posts = allPosts.slice(
    (p - 1) * PER_PAGE,
    (p - 1) * PER_PAGE + PER_PAGE
  )

  return {
    props: {
      p,
      posts,
      hasNext,
      hasPrev,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  const maxPage = Math.ceil(posts.length / PER_PAGE)

  const paths: { params: ParsedUrlQuery }[] = []
  // 1ページ目はトップページにしてるので、2ページ目から
  for (let i = 2; i <= maxPage; i += 1) {
    paths.push({ params: { p: i.toString() } })
  }

  return {
    paths,
    fallback: false,
  }
}
```

## 目次を取得

こっそり目次を左上メニュークリック時に表示されるようになってまして、目次を取得する方法をメモ。

[remark-toc](https://github.com/remarkjs/remark-toc)があってこちらはHTMLに挿入される形なんですが、変数とほしかったので、実際かなり力技ですが…。

記事詳細の`pages/[slug].tsx`の`getStaticProps`内に処理を追加します。

```ts
import {
  getPostBySlug,
  getAllPosts,
  getNextPrevPosts,
  BlogContent,
} from "../lib/blog"

// Markdownのパース用
import remark from "remark"
import remarkHtml from "remark-html"
import remarkSlug from "remark-slug"

// 目次パース用
import { JSDOM } from "jsdom"

// 目次用の型宣言
export type HeaderContent = {
  level: number
  id: string
  label: string
}[]

type Props = BlogContent & {
  headers: HeaderContent
  excerpt: string
  prev: BlogContent
  next: BlogContent
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug
  // 記事の詳細情報を取得
  const post = getPostBySlug(slug)

  // MarkdownをHTMLに変換
  // remark-slugで各見出しにIDを付与しています
  const markdown = await remark()
    .use(remarkSlug)
    .use(remarkHtml)
    .process(post.content || "")
  const content = markdown.toString()

  // 記事のHTMLをパースして見出しを取得
  const dom = new JSDOM(content)
  const headerDoms = dom.window.document.querySelectorAll("h2,h3,h4,h5")
  // 見出しレベルとID, hタグ内のテキストを配列で取得
  const headers = Array.from(headerDoms).map(header => {
    return {
      level: parseInt(header.tagName.replace(/^H/i, "")),
      id: header.id,
      label: header.textContent,
    }
  })

  // 前後ページの情報を取得
  const { prev, next } = getNextPrevPosts(slug)

  return {
    props: {
      ...post,
      content,
      headers,
      prev,
      next,
    },
  }
}
```

## 現状起きてる問題

記述の問題か、ライブラリ側の不具合なのか不明ですが、下記の問題が発生しています。解決できたら追記・もしくは新しく記事を書こうかな。

* next/imageのsrcを変更した時に画像が切り替わらない
  * data-srcだけ変わっていてsrc, srcsetが変わっていない気がする
  
致命的な部分で発生してるわけじゃないので、とりあえず放置…。
