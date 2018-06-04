title: "AS3でaddEventListenerに変数を渡してみた"
date: 2011-01-08T01:46:30.000Z
updated: 2016-04-03T15:28:29.000Z
tags: 
  - AS3
  - Flash
---

AS3のaddEventListenerでマウスのクリック時や、オーバー時にイベント割り当てた時に変数を渡したいと思うことがあったので、方法は無いかと探したところ、以下のような方法で実現が可能であることが分かりました。

参考：[ActionScript3.0(AS3.0) – addEventListenerで関数へ引数を渡す | maxar quartz](http://quartz.maxar.jp/blog/flash/1438.html)

方法としては、「Function」の返り値を持つ関数をaddEventListenerで指定します。

```actionscript
hoge.addEventListener( MouseEvent.CLICK, fuga(1, 2) );

function fuga( foo:Number, bar:Number ):Function {
	return function( e:MouseEvent ):void {
		trace( foo+bar );
	}
}
```

上記のプログラムで、ムービークリップ「hoge」をクリックした時に、変数として与えた、二つの値の合計をtraceします。

ただ注意点として、この方法でイベントを割り当てた場合、「fuga」をremoveEventListenerをしても解除されませんので、参考にさせていただいたページに書いてあるように、arguments.calleeを利用して外す必要があります。

```actionscript
hoge.removeEventListener( MouseEvent.CLICK, arguments.callee );
```

複数のムービークリップに、同じアクションで少しだけ違う処理をさせたい時などに使えそうです。