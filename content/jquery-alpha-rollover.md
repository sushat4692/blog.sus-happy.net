---
title: "jQueryを利用した透明度の変化でロールオーバーを表現するプラグイン"
date: 2010-06-01T01:08:02.000Z
updated: 2016-04-03T16:22:02.000Z
tags: 
  - JavaScript
  - jQuery
---

何番煎じになるかどうかわかりませんが、自分でも透明度を操作して、ロールオーバーを表現するプラグインを作ってみました。

オプションで、ロールオーバー前の透明度、ロールオーバー後の透明度、フェードアニメーションの有無、フェードありならフェードするスピードの設定が可能です。

使い方はこんな感じ。

```javascript
$("#hoge").alphaRo();
```

上の記述で、「hoge」というidの付いた要素に適用されます。

以下は詳細説明。


## 関数概要

`{target}.alphaRo({option});`

<dl><dt>{target}</dt><dd>適用する対象</dd><dt>{option}</dt><dd><dl><dt>[from](number) = 1</dt><dd>ロールオーバー前の透明度</dd><dt>[to](number) = 0.8</dt><dd>ロールオーバー前の透明度</dd><dt>[fade](boolean) = false</dt><dd>ロールオーバー前の透明度</dd><dt>[speed](*) = normal</dt><dd>アニメーションの速度  
 （slow, normal, fastの三段階、もしくはミリ秒）</dd></dl></dd></dl>
## サンプルコード

スタンダード

```javascript
$("a.sample01").alphaRo();
```

フェードアニメーション

```javascript
$("a.sample02").alphaRo({fade:true});
```

アニメーション速度変更

```javascript
$("a.sample03").alphaRo({fade:true,speed:"fast"});
```

透明度変更

```javascript
$("a.sample04").alphaRo({from:0.5,to:1,fade:true});
```

グループ化

rel属性に同じ値を付けると同時に適用されます

```html
<a href="#" rel="group" class="sample05"><img src="img/btn.jpg" alt="test" border="0" /></a>
<a href="#" rel="group" class="sample05"><img src="img/btn.jpg" alt="test" border="0" /></a>
```

```javascript
$("a.sample05").alphaRo();
```

全体のコードもそれほど長くないのでペタリ。

```javascript
jQuery.fn.extend({
	alphaRo : function(opt) {
		if( !opt ) opt = new Object();
		var _from = opt.from!=null ? opt.from : 1;
		var _to = opt.to!=null ? opt.to : 0.8;
		var _f = opt.fade!=null ? opt.fade : false;
		var _s = opt.speed!=null ? opt.speed : "normal";
		$(this).css({"opacity":_from, display:"inline-block"}).bind("mouseenter", {toNum:_to}, toOpacity).bind("mouseleave", {toNum:_from}, toOpacity);
		function toOpacity(event) {
			var tgt = $(this);
			var rel = tgt.attr('rel');
			if( rel ) {
				tgt = $("*[rel='"+rel+"']");
			}
			( _f ) ? tgt.queue([]).fadeTo(_s, event.data.toNum) : tgt.css("opacity", event.data.toNum);
		}
		return $(this);
	}
});
```