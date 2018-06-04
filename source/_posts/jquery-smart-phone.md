title: "jQueryを使ってスマートフォン用のイベントを扱ってみた"
date: 2011-12-15T00:56:22.000Z
updated: 2016-04-03T14:55:28.000Z
tags: 
  - JavaScript
  - jQuery
  - スマートフォン
---

スマートフォン用のサイトを作る場合は、[jQuery Mobile](http://jquerymobile.com/)やら、[jQTouch](http://jqtouch.com/)やら、[Sencha Touch](http://www.sencha.com/products/touch/)やら色々ありますが、ちょっとそこまで必要ないときに、スマートフォン特有のイベントをjQueryを使って扱えないか触ってみました。


## スマホ特有のイベント

スマホ特有のイベントは幾つかありますが、今回は特に使われるであろうタッチ、スライド、ピンチイン、ピンチアウトに重点を置いて調べてみました。

上記操作に必要なイベントは以下の通りです。

- touchstart
- touchmove
- touchend
- touchcancel
- gesturestart
- gesturechange
- gestureend

「touch\*\*\*」というイベントが画面に指でタッチした、している時のイベント、「gesture\*\*\*」というイベントが「二本指以上」の操作（ピンチイン、ピンチアウト、回転等）を行っている時のイベント、と考えていただければ良いかと思います。

また、「touch\*\*\*」は一本指だけでなく、二本指以上の操作でも実行されるため、今何本の指が画面上にタッチされているかを確認しながら動作する必要があります。


## イベントの実行される流れ

### 一本指での操作の場合

一本指だけのイベント進行は単純で以下のように進行していきます。

<dl><dt>1.touchstart</dt><dd>指が画面をタッチした時に実行</dd><dt>2.touchmove</dt><dd>タッチした指を画面上で動かした時に実行</dd><dt>3.touchend</dt><dd>画面上から指を離した時に実行</dd></dl>マウスイベントとほとんど変わらないと思います。

### 二本指での操作の場合

二本指が画面上にタッチされた時は少し特殊で、以下のような順番でイベントが進行します。

<dl><dt>1.touchstart</dt><dd>一本目の指が画面をタッチした時に実行</dd><dt>2.gesturestart</dt><dd>二本目の指が画面をタッチした時に実行</dd><dt>3.touchstart</dt><dd>gesturestartの後に実行</dd><dt>4.gesturechange</dt><dd>タッチした指を画面上で動かした時に実行</dd><dt>5.touchmove</dt><dd>gesturechangeの後に実行</dd><dt>6.gestureend</dt><dd>指を一本画面から離した時に実行</dd><dt>7.touchend</dt><dd>gestureendの後に実行</dd><dt>8.touchend</dt><dd>もう一本の指を画面から離した時に実行</dd></dl>何れかの指が画面にタッチした時、離した時に毎回touchイベントが実行されます。  
 また、二本タッチされている時は同時にgestureイベントも実行されるのですが、その際はgestureイベントが優先される様です。


## イベント実行時に得られる値

イベント実行時に得られる値も、「`touch***`」と「`gesture***`」で異なります。

### touchイベント

主に画面を触っている指の数や、位置を取得することが可能です。

```javascript
function touchHandler( event ) {
	// 画面を触っている指の本数だけ配列で渡されます
	var touches = event.touches;
	// 一本目の指の位置取得
	alert( "x = " + touches[0].pageX + " / y = " + touches[0].pageY );
}
```

### gestureイベント

主にピンチインなどの動作によって変化した値を取得することが可能です。

```javascript
function gestureHandler( event ) {
	// ピンチインによる拡大率
	var scale = event.scale;
	// 回転角度
	var rotate = event.rotation;
	alert( "scale = " + scale + " / rotetion = " + rotate );
}
```


## jQueryで利用する際の注意点

jQueryのbindを持ちいてイベントを実行した場合、上記値の読み方が若干変わります。

addEventListenerを用いた方法では以下のように記述しますが。

```javascript
document.getElementsById("touch").addEventListener("touchstart", touchHandler, false);
function touchHandler( event ) {
	alert( event.touches[0].pageX );
}
```

jQueryを用いた場合は、引数にtouchesが与えられておらず、さらに「originalEvent」内から取得する必要があります。  
 上のコードをjQueryで記述すると以下のようになります。

```javascript
$("#touch").bind("touchstart", touchHandler);
function touchHandler( event ) {
	alert( event.originalEvent.touches[0].pageX );
}
```

詳しくは調べていませんが、引数のeventはjQuery内で生成した変数、originalEventがaddEventListenerで渡されている値と同等なのかな？と思っています。

また、touchイベントはiPhone、Andoroidで動作確認できましたが、gestureイベントはAndroidで動作しません。  
 その他動作環境については、[こちらのページにまとめられている](http://www.lukew.com/ff/entry.asp?1071)ようなので、参考にしようかと思います。


## 参考サイト

- [GestureEvent Class Reference](http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/GestureEventClassReference/GestureEvent/GestureEvent.html#//apple_ref/javascript/cl/GestureEvent)
- [iPhone/SafariでjQueryを使ったイベントのバインドにおける注意点 : nogunogu](http://dev.worksap.co.jp/Members/nogunogu/2010/08/17/iphonesafari%E3%81%A7jquery%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%81%AE%E3%83%90%E3%82%A4%E3%83%B3%E3%83%89%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E6%B3%A8%E6%84%8F/)
- [LukeW | Touch Gesture Reference Guide](http://www.lukew.com/ff/entry.asp?1071)