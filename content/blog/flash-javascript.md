---
title: "FlashとJavaScriptを連動させてみる"
date: 2010-07-23T01:38:00.000Z
updated: 2016-04-03T16:03:57.000Z
tags: 
  - Flash
  - JavaScript
---

FlashからHTMLへのアクションを起こしたり、その逆を実現するために、間にJavaScriptをかませる方法を取っています。

しかし、何回かやってみても毎回調べなおしをしている気がするので、ここに書いておくことで、また調べる時には簡単に見直すことが出来るようにしたいと思います。


## FlashからJavaScriptを実行

Flashのボタンをクリックした時にJavaScriptを実行するなど、Flash側からJavaScriptを実行させるためには、Flashから実行されるJavaScriptの関数の用意と、ActionScriptに用意したJavaScriptの関数を呼び出す記述を行います。

まずはJavaScriptに関数を用意します。ここでの注意点は特にありません。

```javascript
function hoge() {
	alert("done");
}
```

次に用意したJavaScriptの関数を呼び出すActionScriptを記述します。

```actionscript
button_mc.addEventListener(MouseEvent.CLICK, buttonClickHandler);
function buttonClickHandler(e:MouseEvent):void {
	ExternalInterface.call("hoge");
```


これで「button_mc」というムービークリップをクリックしたときに、ダイアラグボックスで「done」と表示されます。

また、FlashからJavaScriptを呼び出す際、関数名の後に続けて値を入れることで、JavaScriptに値を渡すことが可能です。

```actionscript
ExternalInterface.call("huga", variable);
```


## JavaScriptからFlashを実行

手順はまったく逆で、Flash側に呼び出される関数を用意し、JavaScriptにFlashの関数を呼び出す記述をおこなうのですが、FlashからJavaScriptに比べて少し大変です。

まずFlash側にActionScriptで呼び出される関数を用意します。

```actionscript
ExternalInterface.addCallback("callFlash", hoge);
function hoge():void {
	trace("done");
```

また、ここで作成したFlashをHTMLに貼る時に少し注意が必要です。

objectとembedにidかnameを指定し、allowScriptAccessに”always”を指定しないといけません。

```html
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
	codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"
	width="550" height="400" id="swf_obj" align="middle">
	<param name="allowScriptAccess" value="always" />
	<param name="movie" value="hoge.swf" />
	<param name="quality" value="high" />
	<param name="bgcolor" value="#ffffff" />
	<embed src="hoge.swf"
		quality="high" bgcolor="#ffffff" width="550" height="400"
		id="swf_embed" align="middle" allowScriptAccess="always"
		type="application/x-shockwave-flash"
		pluginspage="http://www.macromedia.com/go/getflashplayer" />
</object>
```

次に、JavaScriptにFlash側の関数を呼び出す記述を行います。

```javascript
var fuga = document.getElementById("fuga");
fuga.onclick = function() {
	var tgt;
	if (navigator.appName.indexOf("Microsoft") != -1)
		tgt = document.getElementById("swf_embed");
	else
		tgt = document.getElementById("swf_obj");
	tgt.callFlash();
}
```

これでidに「fuga」と付いている要素をクリックすることで（表示できませんが）traceで「done」と表示されるはずです。