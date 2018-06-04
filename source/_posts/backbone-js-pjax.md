---
title: "Backbone.jsのpjaxを試してみた"
date: 2012-12-05T00:14:38.000Z
updated: 2016-04-03T13:44:24.000Z
tags: 
  - Backbone.js
  - JavaScript
  - jQuery
  - PHP
---

なんだか名前を良く聞くような気がする[Backbone.js](http://backbonejs.org/)を一度触ってみたかったので、Twitterの仕様が変わってタイムラインが取得できなくなった[自サイト](http://sus-happy.net/)に組み込んでみました。

中でもpjaxが出来るとかなんとか聞いたので、その辺りを中心に試しています。むしろそれ以外は別にBackbone.jsじゃなくても良いくらいの状態なので、少しずつ試していこうかと思います。


## Backbone.jsを使う準備

Backbone.jsは単体で動くわけではないみたいなので、下記ライブラリを用意しました。

- [Backbone.js](http://backbonejs.org/)
- [Underscore.js](http://underscorejs.org/)
- [jQuery](http://jquery.com/)

jQueryの代わりに[Zepto.js](http://zeptojs.com/)でも良いのですが、IE非対応みたいなので、一応jQueryにしました。


## Backbone.RouterとBackbone.history

Backbone.jsでpjaxを実装するためにはBackbone.RouterとBackbone.historyを利用します。

Backbone.RouterはURLの変更を監視してイベントを実行し、その裏処理をBackbone.historyで行なっているみたいです。

### イベントを実行するURLの指定

まず、どんなURLでアクセスされた時にアクションを起こすのか指定します。

```javascript
var Router = Backbone.Router.extends( {
	routes : {
		'' : 'index',
		'/about/' : 'about',
		'/contact/' : 'contact'
	},
	'index' : function( page ) {
		// http://example.com/ へのリンク時
	},
	'about' : function( page ) {
		// http://example.com/about/ へのリンク時
	},
	'contact' : function( page ) {
		// http://example.com/contact/ へのリンク時
	}
} );
```

これで、3ページ分用意できました。それぞれ、「/」「/about/」「/contact/」にURLが変更された時にイベントが実行されます。

また、このままではpushState、popStateが有効化されていませんので、Background.historyを利用して有効化します。

### pushState / popStateの有効化

Background.historyは下記一行の指定だけです。

```javascript
Backbone.history.start( { 'pushState' : true } );
```

一行だけ、素敵、便利。

### Backbone.Router.navigateの指定

最後にURLを変更する処理を追加します。  
 Backbone.Router.navigateを利用することで、pushStateを利用したURLの変更を行うことが出来ます。

```javascript
var R = new Router();
$('nav li a').click( function() {
	R.navigate( $(this).attr('href'), true );
	return false;
} );
```

これで、戻る/進むでイベントが実行されるようになりました。

### その他URL指定の方法

また、ページの指定の所で、下記のようにURLを変数として持たせることも出来るみたいです。

```javascript
var Router = Backbone.Router.extends( {
	routes : {
		'' : 'index',
		'/alert/:message' : 'about',
		'/contact/' : 'contact'
	},
	'alert' : function( message ) {
		alert( message );
		// http://example.com/alert/hogehoge にリンクすると、
		// 「hogehoge」とダイアログが出ます
	}
} );
```

サーバサイドのフレームワークみたいな動きも出来そうですね。

### コンテンツの取得

URLが変わったときに内容も変更させたいので、jQuery.loadを使ってコンテンツを取得するように追記します。


```javascript
var Router = Backbone.Router.extends( {
	routes : {
		'' : 'index',
		'/about/' : 'about',
		'/contact/' : 'contact'
	},
	'index' : function( page ) {
		// http://example.com/ へのリンク時
		$('#contents').load( '/' );
	},
	'about' : function( page ) {
		// http://example.com/about/ へのリンク時
		$('#contents').load( '/about/' );
	},
	'contact' : function( page ) {
		// http://example.com/contact/ へのリンク時
		$('#contents').load( '/contact/' );
	}
} );
```

ここまででpushStateを用いたページ切り替えが実装出来ました。

ただ、JavaScriptを無効化されていた場合を考えて、通常のアクセスの場合は全コンテンツを、pjax経由の場合は内容だけ取得できるようにPHPと連携させてみました。


## PHPとの連携

jquery-pjaxの場合は、headerやGET要素に自動的に特定の値が渡されるので、その値で判定すれば良かったのですが、Backbone.jsを使ったpjaxではコンテンツを取得する処理は別なので、自動的に付与されません。

ということで、手動で付与しました。  
 上の記述にもう少し追記して`$_POST['_pjax']=true`を追加します。

```javascript
var Router = Backbone.Router.extends( {
	routes : {
		'' : 'index',
		'/about/' : 'about',
		'/contact/' : 'contact'
	},
	'index' : function( page ) {
		// http://example.com/ へのリンク時
		$('#contents').load( '/', {'_pjax':'true'} );
	},
	// 省略
} );
```

後は、PHP側で`$_POST['_pjax']=true`の判定をするだけです。

```php
<?php
if( $_POST['_pjax'] !== 'true' ) {
	// ヘッダ部を出力
	get_header();
}

// コンテンツ部を出力
get_contents();

if( $_POST['_pjax'] !== 'true' ) {
	// フッタ部を出力
	get_footer();
}
```

これでpushStateが対応していないブラウザや、JavaScriptが無効化されていたとしても正常に表示されるはずです。


## 雑感

実は前に少し試そうかと思ってリファレンスを見て挫折していたのですが、いざ触ってみると思っていたよりもすんなり動作しました。

ちょっとした処理でもサクッと導入できるのは、大規模なフレームワークでは出来ない感じがして気持ちいですね。

まだまだほんの少ししか触っていないため、もっと魅力的な機能が色々とあるかと思いますので色々と試してみようと思います。


## 参考

- [Backbone.js](http://backbonejs.org/)
- [kennyjのブログ(仮): backbone.jsがいつのまにかpjax対応していた](http://kennyj-jp.blogspot.jp/2011/07/backbonejspjax.html)