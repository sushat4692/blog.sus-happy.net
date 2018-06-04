title: "Foundation 4を使ってテーマを作ってみた"
date: 2013-07-28T19:01:36.000Z
updated: 2016-04-03T11:23:00.000Z
tags: 
  - CSS
  - CSSフレームワーク
  - SCSS
---

[Twitter Bootstrap](http://twitter.github.io/bootstrap/)や[HTML KickStart](http://www.99lime.com/)、[Blueprint](http://www.blueprintcss.org/)等、CSS Frameworkの一つの[Foundation 4](http://foundation.zurb.com/)を使ってWordPressのテーマを変えてみました。

本当はYUIの[Pure](http://purecss.io/)を使ってみようかと思っていたんですが、フォントの指定によって段落ちすることがある、という不具合が起きてしまったのでFoundation 4を使ってみました。


## 特徴

レスポンシブウェブデザイン対応のための仕組みが多数組み込まれており、基本的な事はFoundation 4の仕様で実装することが出来ます。

例えば、特定の幅より小さいウィンドウサイズの時の表示・非表示、グリッドのサイズ変更、メニューの格納・タップで表示等、便利な機能が多数含まれています。


## 使い方

Foundation 4は、「normalize.css」と「foundation.css」を読み込みます。

```html
<link rel="stylesheet" href="path/to/normalize.css" />
<link rel="stylesheet" href="path/to/foundation.css" />
```

また、SCSSに最適化されており、SCSSで記述する場合は、importするだけで利用することが出来ます。

```css
@import "path/to/foundation";
```

その他「components/_variables.scss」を編集することで、様々なスタイルの調整を行えます。


## 基本機能

ほんの少しだけ基本機能をメモしておきます。

### グリッド

レスポンシブレイアウトに対応するため少し特殊な記述方法になってます。

```html
<div class="row">
    <div class="small-2 large-2 columns">...</div>
    <div class="small-4 large-4 columns">...</div>
    <div class="small-6 large-6 columns">...</div>
</div>
```

その他のCSSフレームワークと同様に、グリッドの要素数は12個になっているようです。親に「row」、子に「columns」とクラスを指定し、「small-*」「large-*」にてグリッド数を指定します。

「small-*」「large-*」は、ウィンドウサイズが大きいか、小さいか、という判断となります。

```html
<div class="row">
    <div class="small-4 large-6 columns">...</div>
    <div class="small-8 large-6 columns">...</div>
</div>
```

そのため、上記のように記入すると、ウィンドウサイズが大きい時は当分割されますが、小さくすると右側の要素が大きくなります。

### ブロックグリッド

グリッドとは別に、ブロックグリッドという指定が可能です。

コチラの機能は、ウィンドウ幅が大きい時は横並びに沢山並べてもいいけど、小さくなった時は減らしたい、という時に使います。

```html
<ul class="small-block-grid-2 large-block-grid-4">
    <li>...</li>
    <li>...</li>
    <li>...</li>
    <li>...</li>
</ul>
```

こんな感じに、親の要素に「`small-block-grid-*`」「`large-block-grid-*`」と記述すると、*の数分に当分で並びます。  
 上記の例で言うと、ウィンドウサイズが大きい時は4つ、小さい時は2つ横並びで表示されます。

### ウィンドウサイズによって表示・非表示

ウィンドウサイズによって、表示・非表示の制御を行うことが出来ます。

例えば、下記のように記述すると、

```html
<div class="hide-for-small">...</div>
<div class="show-for-small">...</div>
```

「hide-for-small」ではウィンドウサイズが小さい時にだけ非表示になり、「show-for-small」ではウィンドウサイズが小さい時にだけ表示されるようになります。

ちなみに、各サイズに対して「`hide-for-*`」「`show-for-*`」が用意されているようで、[こちらのページから確認](http://foundation.zurb.com/docs/components/visibility.html)することが出来ます。

### グローバルナビ

最後に、ウィンドウサイズによってメニューが格納されるグローバルナビについて。

まずはHTML側をこんな感じに用意します。

```html
<header class="top-bar">
    <ul class="title-area">
        <li class="name"><h1><a href="/">SiteName</a></h1></li>
        <li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
    </ul>
    <section class="top-bar-section">
        <ul class="right">
            <li><a href="#">MENU01</a></li>
            <li><a href="#">MENU02</a></li>
            <li><a href="#">MENU03</a></li>
            <li><a href="#">MENU04</a></li>
            <li><a href="#">MENU05</a></li>
            <li><a href="#">MENU06</a></li>
            <li class="has-form">
                <form action="#" action="get">
                    <input type="text" name="text">
                </form>
            </li>
        </ul>
    </section>
</header>
```

「toggle-topbar」がメニュー開閉のリンク、開閉の対象が「top-bar-section」です。たぶん。

また、メニューの開閉を行うためにはJavaScriptの用意が必要です。

まずは「modernizr」。ブラウザの処理の差異を軽減するライブラリですね。別に他のJSを利用しなくても呼んじゃっても良いような気がします。  
 また、「modernizr」はheadタグ内に記述したほうが良いそうです。

```html
<script src="/js/vendor/custom.modernizr.js"></script>
```

次に、「Zepto」か「jQuery」を読み込みます。「Zepto」の方が軽量なのですが、モダンブラウザしか対応していません。  
[Foundationのサイトにどちらを読むか判別スクリプトが紹介](http://foundation.zurb.com/docs/javascript.html)されていたので、それを使っちゃいました。

```html
<!-- Check for Zepto support, load jQuery if necessary -->
<script>
  document.write('<script src=/js/vendor/'
    + ('__proto__' in {} ? 'zepto' : 'jquery')
    + '.js><\/script>');
</script>
```

そして、Foundationの大本のライブラリを読み込みます。今回のグローバルナビのライブラリだけでなく、他のライブラリを利用する際にも必要となります。

```html
<script src="/js/foundation.min.js"></script>
```

そして最後にメニューの開閉用のライブラリを読み込みます。「foundation.topbar.js」という名前のファイルですね。

```html
<script src="/js/foundation.topbar.js"></script>
```

これでウィンドウが小さくなると、MENU01〜MENU06とインプットテキストが収納されます。


## 雑感

今回このテーマでは複雑なレイアウトや処理を行なっていないので、正直どのフレームワークでも簡単に用意できたと思いますが、ウィンドウサイズによって文字サイズが自動的に調整したりと、至れり尽くせりな機能が充実していたように感じます。

またPureもバージョンが上がった頃を見計らって試してみたいのと、Twitter Bootstrapもフラットなデザインに成っていたり一度試した頃に比べて色々と追加されているようなので気になっています。

最終的にはサイトに合ったCSSを用意したほうが効率的なレスポンスを提供できるのですが、効率的な制作を求める際には「知っておく」事は重要な気がしますね。