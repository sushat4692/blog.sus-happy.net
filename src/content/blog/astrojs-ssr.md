---
title: "Astroのエンドポイントを使ってVercel上でOGP画像を自動生成してみた"
date: 2023-02-13T00:00:00.000Z
updated: 2023-02-13T00:00:00.000Z
tags: 
  - JavaScript
  - Astro
  - Vercel
---

前回このブログをAstroに移行していましたが、OGPの自動生成についてはまだ移行が出来ていませんでした。

`@astrojs/og`みたいなライブラリも開発中？っぽいのですがまだ公開すらされていないみたいなのと、[astro-og-image](https://www.npmjs.com/package/astro-og-image)というライブラリはあったのですが、puppeteerを使ってるみたいで結構重そうだったので、[@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)みたいに[satori](https://github.com/vercel/satori) + [resvg-js](https://github.com/yisibl/resvg-js) (resvg-wasm)を使って実装してみました。 ~~（車輪の再発明感）~~

## SSRに対応させる

Astroはデフォルトの設定ですとSSGが基本になっているですが、OGP画像の生成についてはSSRにしておいた方が良さそうかな、と思ったので設定をちょっと変更してみます。

Vercelを利用させていただいているので、[@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/)を利用し、基本的にはドキュメントの通り設定していきます。

まずは下記のコマンドを実行すると、必要なライブラリのインストールと、基本設定を行ってくれます。

```bash
$ npx astro add vercel
```

設定ファイルも自動的に下記の記述が追加され、SSRが有効になります。

```ts
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
    // 略
    output: "server",
    adapter: vercel(),
});
```

### SSRが必要の無いページの設定を追加

今回の場合、SSRにしたいのはOGP画像の生成のみで、一覧や詳細ページなどはSSGのままで問題ありません。

その場合、該当のastroファイルに下記の一行を追加すると、SSRではなくSSG扱いとなりbuild時にファイルを生成してくれるようになります。

```ts
export const prerender = true;
```

[こちらの機能もどうもv2から追加された機能](https://docs.astro.build/en/guides/server-side-rendering/#hybrid-rendering)みたいですね。（日本語ページの方にはまだセクションごとありませんでした）

### エンドポイントを作成する

[ドキュメントを参考](https://docs.astro.build/en/core-concepts/endpoints/)に、`api/ogp.png.ts`というファイルを生成してみます。

```ts
export async function get() {
    return new Response(/* */);
}
```

こちらで準備は完了しましたので、OGP画像の生成に取り掛かります。

## satoriを使ってsvgを生成する

[satori](https://github.com/vercel/satori)はVercelが開発をしている、HTML/CSSをsvgに変換するライブラリです。利用可能な[HTML](https://github.com/vercel/satori#html-elements)や[CSS](https://github.com/vercel/satori#css)に制限はあるものの、レイアウトを調整するCSSはおおよそ利用することが出来るので、よほど困ることは無いように思います。

まずはいつもどおりライブラリのインストールをします。

```bash
$ npm install satori
```

後は`satori()`にHTML/CSS、設定を渡すだけでsvgが生成されます。とても簡単…。ただ、フォント周りだけが若干ややこしいので、注意が必要です。

```tsx
import satori from "satori";

const svg = await satori(
    <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
    }}>
        <h1>Hello, World</h1>
    </div>,
    {
        width: 1200,
        height: 630,
    }
);
```

JSX記法だけでなく、オブジェクト形式でも問題ありません。（上と下は同じ結果になります）

```ts
import satori from "satori";

const svg = await satori(
    {
        type: "div",
        props: {
            children: [
                {
                    type: "h1",
                    props: {
                        children: "Hello, World",
                    }
                }
            ],
            style: {
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
            }
        },
    },
    {
        width: 1200,
        height: 630,
    }
);
```

### Googleフォントでサブセットしながらフォントデータを取得する

satoriにはフォントデータを直接指定する必要があるため、英文フォントはまだしも、日本語フォントだとデータ量が重くなってしまう危険性があります。

そこで、[こちらを参考にさせていただき](https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts)つつ、Googleフォントのサブセットを利用させてもらいつつ、フォントデータを取得する処理を追加しました。（Noto Sans JPのBoldフォントを読み込む場合）

```ts
export const loadGoogleFont = async (text: string) => {
    const API = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${text}`;

    const css = await (
        await fetch(API, {
            headers: {
                // Make sure it returns TTF.
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
            },
        })
    ).text();

    const resource = css.match(
        /src: url\((.+)\) format\('(opentype|truetype)'\)/
    );

    if (!resource) return;

    const res = await fetch(resource[1]);

    return res;
};
```

### Astroエンドポイントに記述する

先程用意したAstroのエンドポイント`api/ogp.png.ts`にsatoriの記述を追加してみます。

```ts
import satori, { Font } from "satori";

import { loadGoogleFont } from "./path/to/loadGoogleFont";

export async function get() {
    const fontData = await loadGoogleFont('Hello, World').then((resp) => resp?.arrayBuffer());

    const fonts: Font[] = [];
    if (fontData) {
        fonts.push({
            name: "NotoSansJapanese",
            data: fontData,
            weight: 700,
            style: "normal",
        });
    }

    const svg = await satori(
        {
            type: "div",
            props: {
                children: [
                    {
                        type: "h1",
                        props: {
                            children: "Hello, World",
                        }
                    }
                ],
                style: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                }
            },
        },
        {
            width: 1200,
            height: 630,
            fonts,
        }
    );
    
    return new Response(svg, {
        headers: {
            "content-type": "image/svg+xml",
            "cache-control":
                "public, immutable, no-transform, max-age=31536000",
        }
    });
}
```

しかし、これではsvg形式で出力されてしまうため、OGP画像として利用することはできません。

そこで、resvg-js (resvg-wasm)を利用します。

## resvg-js (resvg-wasm) を使ってsvgからpngにする

[resvg-js](https://github.com/yisibl/resvg-js)は、Rustで作られていたsvgレンダリングエンジンをWASMで提供したもので、今回はsvgをpng形式に変換するために利用します。

> vercelではresvg-jsが上手く動かなかったので、resvg-wasmを利用します。（要検証）

```bash
$ npm install @resvg/resvg-wasm
```

WASM版をNode環境下で利用する場合、`index_bg.wasm`を読み込む必要がありますが、png変換の処理はとても単純です。

```ts
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// satoriでsvgを生成
const svg = await satori(/* */);

await initWasm(
    readFile(
        join(process.cwd(), "node_modules/@resvg/resvg-wasm/index_bg.wasm")
    )
);

const resvg = new Resvg(svg, {
    fitTo: {
        mode: "width",
        value: 1200
    }
});
const result = resvg.render();
const pngBuffer = result.asPng();
```

### resvg-wasmを使う時の注意点

`initWasm`は一度だけしか呼んではならず、2度目以降はエラーが発生してしまいます。

自分の理解不足もあるのですが…VercelのFunctionで起動時に一度だけ呼ばれる処理をどこに記述すれば良いのか不明だったため、下記のような処理を作成しました。

```ts
import { initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

let initialized = false;

export const initResvg = async () => {
    if (initialized) {
        return;
    }
    initialized = true;

    await initWasm(
        readFile(
            join(process.cwd(), "node_modules/@resvg/resvg-wasm/index_bg.wasm")
        )
    );
};
```

この`initResvg`なら何度呼んでも大丈夫（のはず）です。

### Vercelでresvg-wasmを使うための設定追加

このままデプロイをすると`index_bg.wasm`見つからない、というエラーが発生してしまいますので、@astrojs/vercelのアダプタ設定に、このファイルを含めるように設定を追加します。

```ts
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
    // 略
    output: "server",
    adapter: vercel({
        includeFiles: ["./node_modules/@resvg/resvg-wasm/index_bg.wasm"],
    }),
});
```

これで、ビルド後のデータにも`index_bg.wasm`が残るので、読み込めるようになります。


## Astroエンドポイント例

それぞれの記述を併せたものがこちらの様になります。

```ts
import satori, { Font } from "satori";

import { loadGoogleFont } from "./path/to/loadGoogleFont";
import { initResvg } from "./path/to/initResvg";

export async function get() {
    // WASMファイルの読み込み
    await initResvg();

    // サブセット済みのフォントデータの読み込み
    const fontData = await loadGoogleFont('Hello, World').then((resp) => resp?.arrayBuffer());

    const fonts: Font[] = [];
    if (fontData) {
        fonts.push({
            name: "NotoSansJapanese",
            data: fontData,
            weight: 700,
            style: "normal",
        });
    }

    // svgの生成
    const svg = await satori(
        {
            type: "div",
            props: {
                children: [
                    {
                        type: "h1",
                        props: {
                            children: "Hello, World",
                        }
                    }
                ],
                style: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                }
            },
        },
        {
            width: 1200,
            height: 630,
            fonts,
        }
    );

    // pngの生成
    const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: 1200
        }
    });
    const result = resvg.render();
    const pngBuffer = result.asPng();

    // pngデータを返す
    return new Response(pngBuffer, {
        headers: {
            "content-type": "image/png",
            "cache-control":
                "public, immutable, no-transform, max-age=31536000",
        }
    });
}
```

## 雑感

AstroのHybrid Renderingを使うことでSSRの機能を持ちつつ、静的ページはビルドしておいてパフォーマンスの最適化を行う事が出来るのが、便利で他にも色々使えそうだなぁと思いました。

その他、satoriやresvgも触ってみた所、思っていたよりもサクサク動くし、大きな問題も発生しなかったので、動的生成の幅が広がりました。

正直な所、公式で@astrojs/ogみたいなライブラリが発表されたら乗り換えるかもしれませんが、それぞれのライブラリの理解ができて良かったです。