---
title: Herokuで日本語を含むページのスクリーンショットを撮ってみた（その2）
date: 2018-07-16 15:41:09
tags:
  - Heroku
  - Node.js
thumbnail: "/content/images/2018/07/heroku.png"
---

[前回](/heroku-webshot/)、node-webshotを利用してスクリーンショットを撮っていましたが、PhantomJSが開発終了していることに気づいたため、node-webshotから[Puppeteer](https://pptr.dev/)に変更してみました。（よくよく見ると、node-webshotも2016年から更新されていないんですね…）

## Puppeteerを使ってみる

いつものごとくnpm、またはyarnでPuppeteerをインストールすると利用できます。

```bash
npm i puppeteer
# または
yarn add puppeteer
```

それぞれの関数はPromiseで返ってくることが多いため、サンプルを見てもawaitを多用しているのが印象的でした。
取り敢えずスクリーンショットを取るには、こんな感じでOKです。

```typescript
import * as puppeteer from 'puppeteer'

const url = 'http://example.com'

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  // スクリーンショットを保存
  await page.screenshot({path: 'example.png'})

  await browser.close()
})()
```

### ウィンドウサイズを設定する

キャプチャするウィンドウサイズを指定する際は、[`setViewport`](https://pptr.dev/#?product=Puppeteer&version=master&show=api-pagesetviewportviewport)関数が用意されています。

```TypeScript
// 省略
const width = 1024
const height = 768

(async () => {
  // 省略
  const page = await browser.newPage()
  await page.setViewport({
    width,
    height
  })
  // 省略
})()
```

`deviceScaleFactor`で、高解像度端末をシミュレーションすることも出来るみたいですね。


### Basic認証下のページにアクセスする

Puppeteerには、[`authenticate`](https://pptr.dev/#?product=Puppeteer&version=v1.6.0&show=api-pageauthenticatecredentials)メソッドがありました。

```TypeScript
// 省略
const userId = 'user_id'
const passWord = 'password'

(async () => {
  // 省略
  await page.authenticate(userId, passWord)
  // 省略
})()
```

~~node-webshotと同様に、[`setExtraHTTPHeaders`](https://pptr.dev/#?product=Puppeteer&version=master&show=api-pagesetextrahttpheadersheaders)によってheaderを追加することで対応が可能です。
（前回に引き続きCryptoJSでBase64エンコードしてます）~~

```TypeScript
/* 下記の様な記述はしなくてもOK
import * as CryptoJS from 'crypto-js';

// 省略
const userId = 'user_id'
const passWord = 'password'

(async () => {
  // 省略
  const wordArray = CryptoJS.enc.Utf8.parse(userId + ':' + passWord)
  await page.setExtraHTTPHeaders({
    Authorization: 'Basic ' + CryptoJS.enc.Base64.stringify(wordArray)
  })
  // 省略
})()
*/
```


### ページ全体を撮影する

ページ全体なのか、ウィンドウ範囲内だけなのかも、[`screenshot`](https://pptr.dev/#?product=Puppeteer&version=master&show=api-pagescreenshotoptions)のオプションで制御が可能です。
その他ちょっとしたオプションも併せてご紹介。

```TypeScript
// 省略
(async () => {
  // 省略
  await page.screenshot({
    path: 'example.jpg', // example.jpg に保存
    type: 'jpeg',        // JPEG形式で保存
    quality: 80,         // 品質を0-100で指定
    fullPage: true       // trueにするとページ全体を保存
  })
  // 省略
})()
```

また、`clip`で切り抜きも出来るようですね。


## Herokuで動かしてみる

次に、Herokuで動かしてみようとすると、そのままでは動かないことが分かりました。
そのまま動かそうとして発生したエラーのURLに、まさに[Herokuの場合の解決方法](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku)が記載されていました。


### Buildpackを追加する

（多分）初期状態では必要なライブラリが揃っていない様子なので、有志の方が作ってくれたBuildpackを追加して、Puppeteer（Chrome）が動く環境を整える、ということだと思います。

Herokuのダッシュボードからの場合は、`Settings` -> `Buildpacks`でGitHubのURLを入力します。
入力するURLは[こちら](https://github.com/jontewks/puppeteer-heroku-buildpack)か、日本語・中国語・韓国語に対応させたい場合は[こちら](https://github.com/CoffeeAndCode/puppeteer-heroku-buildpack)です。

> ちなみに、後者のBuildpackを利用する場合は、[前回追加したフォント](/heroku-webshot/#Heroku%E3%81%A7%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)は不要なので、容量を削減する上でも削除した方が良いでしょう。
> ~~というか、無料枠の500MB超えちゃってので~~

もしくは、Heroku CLIをインストールしているのであれば下記コマンドでも大丈夫です。

```bash
heroku buildpacks:add https://github.com/CoffeeAndCode/puppeteer-heroku-buildpack
```


### Puppeteerの起動オプションを追加

Buildpackを追加しただけでは、まだエラーが出てしまうので、Puppeteerの起動オプションを追加します。

```TypeScript
import * as puppeteer from 'puppeteer'

const url = 'http://example.com'

(async () => {
  // 起動オプションを追加
  const browser = await puppeteer.launch({
    args: [
      '--enable-font-antialiasing',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(url)

  await page.screenshot({path: 'example.png'})

  await browser.close()
})()
```

（Herokuじゃない時と振り分けておいた方が良いかも？）


## 雑感

前回のnode-webshotに比べると、Heroku上での起動に少しつまづいてしまいましたが、node-webshotで気になっていた点が解消されたので、変更して良かったと思いました。

また、Puppeteerに乗り換えるちょっと前にawait、asyncを勉強していてタイムリーでした。TypeScript(JavaScript)楽しいです。
