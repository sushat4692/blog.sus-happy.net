---
title: "Astro 7とsatori 0.33でOGP画像生成をメンテし直した"
date: 2026-09-28T00:00:00.000Z
tags:
  - Astro
  - Vercel
  - JavaScript
---

ずいぶん放置してしまいました、約3年半ぶりの記事です。

以前[Astroのエンドポイントを使ってVercel上でOGP画像を自動生成してみた](/astrojs-ssr/)という記事を書いていました。今回Astroやsatoriのバージョンを上げたところ、OGP画像の生成が動かなくなってしまいました。

今回はその時に修正した内容のまとめです。

## アップデート内容

大分放置していたので、下記のようにアップデートすることになりました。

| ライブラリ | 変更前 | 変更後 |
| --- | --- | --- |
| Astro | 5系 | 7系 |
| @astrojs/vercel | 8系（`@astrojs/vercel/serverless`） | 11系（`@astrojs/vercel`） |
| satori | 0.26系 | 0.33系 |

それぞれで地味に破壊的な変更があり、特にOGP生成が500エラーを返すようになっていました。

### 1. `get`ではなく`GET`でエクスポートする

今のAstroではHTTPメソッド名を大文字でエクスポートします。旧記事の`export function get()`は動かないので、`GET`に変更します。

```ts
export async function GET({ params, url }: APIContext) {
    // ...
}
```

### 2. `output: "hybrid"`は無くなった

`hybrid`はAstro 5で廃止され、`static`に統合されました。オンデマンド生成にしたいルートだけ`prerender = false`を付けます。[旧記事](/astrojs-ssr/#ssr%E3%81%8C%E5%BF%85%E8%A6%81%E3%81%AE%E7%84%A1%E3%81%84%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0)とは既定の向きが逆になっているので注意が必要です。

```ts
export const prerender = false;
```

アダプタのimportも変わりました。

```ts
import vercel from "@astrojs/vercel";
```

### 3. Content Layer API への移行

記事の取得まわりも変わっています。OGP側で使っている`getEntryBySlug`は`getEntry`に。

```ts
import { getEntry } from "astro:content";

const entry = await getEntry("blog", params.slug || "");
```

あわせて一覧・詳細ページ側では`entry.slug`が`entry.id`に、`entry.render()`が`render(entry)`になっています。地味ですが移行しないと動きません。

### 4. `runtime: "edge"`は（今は）効かない

`@astrojs/vercel` v11ではルートごとの`runtime`設定は無視され、実体はNodeのサーバーレス関数になります。以前付けていた以下の設定は削除しました。

```ts
export const config = {
    runtime: "edge",
};
```

`node:fs`が使えるので、resvg-wasmのwasmファイルを読み込む用途にはむしろ都合が良いです。

### 5. satori 0.33のSSRF保護で「自分のURL」が読めなくなった

一番ハマったのがここです。以前は背景画像を次のようにリクエスト元のURLで渡していました。

```ts
const dataUri = `${url.origin}/content/background.jpg`;
```

ところがsatori 0.33ではSSRF対策が入り、localhostやプライベートアドレスへの画像取得がブロックされます。開発環境では`url.origin`が`http://localhost:4321`になるため、そのまま500エラーになってしまいました。

対策として、背景画像はViteの`?inline`でビルド時にdata URI化して埋め込みます。URLを渡さないのでSSRFの対象になりません。

```ts
import backgroundImage from "../assets/background.jpg?inline";

// ...

const dataUri = backgroundImage;
```

記事ごとのサムネイルがある場合は、いったん`fetch`で取得してbase64のdata URIへ変換してからsatoriに渡します。

```ts
const toDataUri = async (source: string) => {
    const res = await fetch(source);
    if (!res.ok) {
        throw new Error(`Failed to fetch image: ${source}`);
    }
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
};

const { thumbnail } = entry.data;
const image = thumbnail
    ? {
          src: await toDataUri(`${url.origin}${thumbnail.src}`),
          width: thumbnail.width,
          height: thumbnail.height,
      }
    : { src: backgroundImage, width: 1800, height: 1200 };
```

### 6. Responseに渡す前に`Uint8Array`にする

`asPng()`が返すBufferをそのまま`new Response()`に渡すと環境によって問題になることがあるため、`Uint8Array`に包み直します。

```ts
const pngBuffer = pngData.asPng();

return new Response(new Uint8Array(pngBuffer), {
    headers: {
        "content-type": "image/png",
        "cache-control": "public, immutable, no-transform, max-age=31536000",
    },
});
```

### 7. satoriが使うharfbuzzjsのwasmが本番で見つからない

satori 0.33では文字のシェーピングに**harfbuzzjs**を使うようになり、実行時に`node_modules/harfbuzzjs/hb.wasm`を`fs`で読み込みます。

ローカルでは`node_modules`があるので問題ありませんが、Vercelの関数には自動で同梱されないため、本番で次のエラーが出て500になりました。

```text
ENOENT: no such file or directory, open '/var/task/node_modules/harfbuzzjs/hb.wasm'
```

resvg-wasmのときと同じで、アダプタの`includeFiles`に追加すれば解決します。

```ts
adapter: vercel({
    includeFiles: [
        "./node_modules/@resvg/resvg-wasm/index_bg.wasm",
        "./node_modules/harfbuzzjs/hb.wasm",
    ],
}),
```

## まとめ

アップデートでOGP生成が壊れる要因は、大きく分けると次の3つでした。

- Astro側のAPI・設定の変更（メソッド名、`output`、Content Layer API）
- satoriのSSRF保護で画像のURL取得が使えなくなった
- satoriが使うwasm（harfbuzzjs）がVercelの関数に同梱されず本番で失敗した

特に後ろ2つは、ビルドは通るのに開発や本番で500になるタイプで気付きにくいので、同じ構成でOGP画像を生成している方の参考になれば幸いです。
