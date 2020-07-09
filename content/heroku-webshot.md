---
title: Herokuで日本語を含むページのスクリーンショットを撮ってみた
date: 2018-07-04 15:50:10
tags:
  - Heroku
  - Node.js
thumbnail: "/content/images/2018/07/heroku.png"
---

## 追記(2018/07/16)

> PhantomJSが開発終了していたのを、記事を公開してから気づいたので、[Puppeteerに乗り換える](/heroku-puppeteer/)などを行った方が良いかと思います。

---

Node.jsはnpm scriptsでしか使ってなかったのですが、URLを入力➝スクリーンショットを撮る仕組みが欲しくなったので、Node.jsをぼちぼち触ってみました。

## 文字化けが発生する

今回は「とりあえず撮れれば良い」というレベルでしたので、込み込みで入っていそうな、[node-webshot](https://github.com/brenden/node-webshot)を利用したので、スクリーンショットを撮るまでは非常に簡単でしたが、Paas環境ににアップロードすると日本語が`□□□`みたいに表示されるようになってしまいました。

原因は明確で、**日本語フォントが入っていない**ことが原因なのですが、PaaS環境にどうやってフォントをインストールすれば良いのか調べてみた所、Herokuでは解決方法が見つかったので、Herokuで開発を行うことにしました。

### Herokuでフォントをインストール

方法は参考ページ（[Heroku環境でフォントを追加する – r7kamura – Medium](https://medium.com/@r7kamura/heroku%E7%92%B0%E5%A2%83%E3%81%A7%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B-f51381c0f870)）そのままで、`.fonts`というフォルダを用意して、そこにフォントファイルを追加してやればOKです。

つまり、こんな感じのディレクトリ構造になります。

```
- .fonts/
  - 何かフォントファイル
- node_modules/
- app.json
- package.json
- Procfile
```

## Basic認証環境下も対応したい

これも参考ページ（[node-webshotでベーシック認証サイトのキャプチャを取得する - Qiita](https://qiita.com/musclemikiya/items/3c6b8e17ef82ea0aa2a7)）そのままで、node-webshotのオプションの`customHeaders`に、`Authorization`を追加してやればOKです。

他で利用する箇所があったので、Base64化に[crypto-js](https://github.com/brix/crypto-js)を利用しています。

```typescript
import * as CryptoJS from 'crypto-js';
import * as webshot from 'node-webshot'

// ユーザ名とパスワード
const user = 'username'
const pass = 'password'

// Base64化
const wordArray = CryptoJS.enc.Utf8.parse(user + ':' + pass)
const base64Auth = 'Basic ' + CryptoJS.enc.Base64.stringify(wordArray)

// スクリーンショット
const url = 'http://example.com'
const file = 'export.ong'
webshot(url, file, {
  customHeaders: {
    Authorization: base64Auth
  }
})
```


## 雑感

スクリーンショットを撮るのなんて面倒臭そうだなぁ、と思っていたら、いつの間にか便利なライブラリがたくさん増えていて、基本的な操作は特に問題なく利用することができました。

ローディングがあるページなどは撮影までの遅延時間を設ければ良さそうなので、よっぽどのことがなければPhantomJSを直接触る必要は無さそうですね。

また、PaaS環境も慣れているPHPばかりで利用していましたが、Node.jsでも問題なく実行ができました。しかし、Heroku以外で日本語フォントを利用できるPaaS環境は無いかなぁ…？本当はFirebase Functionsで利用したいんだけど、そもそも無料プランでは外部URLを参照することすら出来ないので、実験すら出来ない…。
