---
title: "ローカルファイルをブラウザにドラッグするJavaScriptを試してみた"
date: 2015-01-16T00:06:29.000Z
updated: 2016-04-03T10:38:20.000Z
tags: 
  - JavaScript
---


随分前からある機能ですが、今更ながら調べてみて自分にとって使いやすいライブラリとして用意したのでメモしておきます。


## 仕様について

どうせやるならウィンドウ全体に出来ると良いよね、ということでGmailとかWodPressとかみたいに、ウィンドウの何処でもいいのでドラッグ出来るような方法でやってます。

処理としては単純で、下記の通りです。[参考にさせていただいたのはコチラ](http://qiita.com/yaegaki/items/b7ea40490b06bd4f8e4f)、感謝です。

- 画面全体を覆う空のdiv（マスク）を用意して、最初は非表示にしておく
- bodyに対してdragoverイベントを付与、マスクにはdragleave、dropイベントを付与
- dragoverイベント発火時にマスクを表示
- dragleave、dropイベント発火時にはマスクを非表示

という方法を取れば、ローカルファイルをブラウザ内にドラッグした時にマスクが表示されて次の工程のイベントが発火出来る状態になるので、ウィンドウ全体でドロップできるようになります。


## オレオレライブラリ

[ライブラリ全体はGistにアップ](https://gist.github.com/sus-happy/d24bf9d801a18f0dd591)してあります。

使い方はこんな感じ。

```javascript
var drop = new DROP_FILES();

// dragover時のフック
drop.setEvent( 'over', function( e ) {
	// ほげほげ
} );

// dragleave時のフック
drop.setEvent( 'leave', function( e ) {
	// ゴニョゴニョ
} );

// drop時のフック
drop.setEvent( 'drop', function( e ) {
	// もにょもにょ
} );
```

まとめて指定することも出来ます。

```javascript
var drop = new DROP_FILES( {
	// dragover時のフック
	'over': function( e ) {
		// ほげほげ
	},
	// dragleave時のフック
	'leave': function( e ) {
		// ゴニョゴニョ
	},
	// drop時のフック
	'drop': function( e ) {
		// もにょもにょ
	}
} );
```

初期設定だと黄色いオーバーレイですが、CSSを書き換える事もできます。

```javascript
var drop = new DROP_FILES();

// 個別指定
drop.setCss( 'background', 'rgba( 255, 0, 0, .5 )' );

// 複数同時指定
drop.setCss( {
	'background': 'rgba( 0, 0, 255, .5 )',
	'z-index': '100'
} );
```


## 参考サイト

- [HTML5でファイルをドロップする際に画面全体にオーバーレイを表示する方法 – Qiita](http://qiita.com/yaegaki/items/b7ea40490b06bd4f8e4f)