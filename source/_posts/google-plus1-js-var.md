title: "Google+1風にJavaScriptに渡す変数をページ毎に変更する"
date: 2011-08-08T03:10:34.000Z
updated: 2016-04-03T14:58:49.000Z
tags: 
  - Google
  - JavaScript
---

javascriptをページ毎に違う変数を渡したいと思ったときに、読み込むscriptタグの前に、グローバル変数で定義する方法が一般的だと思いますが、もうちょっとスマートな方法が無いか探していました。

そこで、Google+1の埋め込みタグを見ていると、以下のようになっているのに気づきました。

```html
<script type="text/javascript" src="https://apis.google.com/js/plusone.js">{lang: 'ja'}</script>
```

ファイルを読み込むscriptタグ内に言語を特定する変数を直接記入しているようで、この方法が良さそうだと思い、同じ方法か分かりませんが自分でも試してみました。


## 自身のscript要素を取得する

最初に、HTMLタグ内に記入したところで、JavaScript上のどの変数にも渡されている訳ではない様なので、自分自身のscriptタグを取得する方法を探しました。

ファイル名をJSファイル内に埋め込んでgetElementsByTagNameで取得したscriptタグ一つ一つと照合していましたが、[とてもシンプルに自分自身が属する script 要素を取得 – IT戦記](http://d.hatena.ne.jp/amachang/20061201/1164986067)という記事を発見したので、こちらを参考にさせていただきました。


## HTMLに記述された情報をJavaScript内で利用できるようにする

そして、scriptタグ内のテキストはinnerHTMLで取得できますので、このデータをevalで取得します。

Google+1の様なJSON形式の場合は、eval内でも括弧で括った方が良いみたいです。


## サンプルコード

まず、以上を踏まえて出来上がったJavaScriptファイルはこんな感じ。

```javascript
var currentScript = (function (e) { if(e.nodeName.toLowerCase() == 'script') return e; return arguments.callee(e.lastChild) })(document);
var data = eval("("+currentScript.innerHTML+")");
```

そして、HTML側で上記JSファイル（get.js）を以下の様に読み込みます。

```html
<script type="text/javascript" src="get.js">{foo:'var'}</script>
```

すると、JavaScript内の変数「data」にfoo:varという値が代入されるはずです。

ページ毎に少しずつ与える値を変える場合や、Google+1のようにAPI的に使う場合に使えそうな気がします。