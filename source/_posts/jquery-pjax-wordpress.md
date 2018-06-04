---
title: "jquery-pjax + WordPressでスニペット集を作ってみた"
date: 2012-02-19T23:39:29.000Z
updated: 2016-04-03T14:43:06.000Z
tags:
  - JavaScript
  - jQuery
  - PHP
  - WordPress
---

Ajaxを利用しつつ、戻る・進むリンクが効くような作りで、Twitterと同じようにHashchangeイベントを使ったことがあったのですが、HTML5ならpushstateを覚えなくては―と思っていた頃に[この記事](http://d.hatena.ne.jp/punitan/20110404/1301895279)を読んでjquery-pjaxの存在を知りました。

また、ちょっとしたコードをメモして置く場所が欲しかったので、WordPressと組み合わせてスニペット集を作ってみました。

こんな感じです » ~~Snippets | SUSH-i LOG~~

まだまだ分類分けが中途半端だったり、導線が不十分だったり、ブラウザの進む・戻るを使った時に少し不具合がありますが、何とか形になったかな？と思っています。


## クライアントサイド

ソースファイルは、[defunkt/jquery-pjax – GitHub](https://github.com/defunkt/jquery-pjax)からダウンロードできます。

クライアントサイドの記述方法は参考リンク先でもご紹介されていますが、こんな感じ。

```javascript
$('.pjax-cont').pjax('#wrap', { complete: function() {
	prettyPrint();
	gapi.plusone.go();
	FB.init({appId: 'YOUR APP ID', status: true, cookie: true, xfbml: true});
} });
```

で書いていたのですが、`pjax:end`にbindすると、ブラウザの進む・戻るの際にも読み込み完了時にフックされるので以下の書き方の方が良いかと思います。

```javascript
$('.pjax-cont').pjax('#wrap');
$("#wrap").bind("pjax:end", function() {
	prettyPrint();
	gapi.plusone.go();
	FB.init({appId: 'YOUR APP ID', status: true, cookie: true, xfbml: true});
} );
```

また、今回スニペット集を作る時に、ソーシャルボタンや、google-code-prettifyを使っていたので、読み込み完了時に各初期化関数を呼んでいます。


## サーバサイド

今度はWordPressのテーマファイルに追記していきます。

jquery-pjaxで呼ばれると、HTTPヘッダに`X-PJAX: true`が追加されるので、そちらを利用します。

```javascript
$header = getallheaders();
if(! $header["X-PJAX"] )
	get_header("snippets");
```

こんな感じで、HTTPヘッダにX-PJAXが存在しない時だけヘッダやフッタを呼び出しているようにしています。

ただし、このままだと`wp_head`や`wp_footer`が呼ばれないような作りのテンプレートが通常だと思うので、必要とあらば適宜呼び出すようにしてください。

pushstateが使えないブラウザでは通常のリンクとして、使うことのできるモダンブラウザはAjaxを利用するように自動的に判別してくれるのも嬉しいですね。


## 参考

- [pjax こそが pushState + Ajax の本命 – punitan (a.k.a. punytan) のメモ](http://d.hatena.ne.jp/punitan/20110404/1301895279)


## 追記 12/02/21

jquery-pjaxの扱い方が微妙だったので修正しました。

`complete`を利用するより、`pjax:end`を使った方がブラウザの進む・戻るにも対応しているのでそちらの追記をしています。

その代わりに今度はTweetボタンとはてブボタンがおかしくなってしまいました･･･。調査します･･･。
