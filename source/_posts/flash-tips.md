title: "Flashの便利関数色々"
date: 2010-06-10T02:08:28.000Z
updated: 2016-04-03T16:13:31.000Z
tags: 
  - ActionScript
  - Flash
---

Flashでアニメーションやら、プログラムやら作っている時に、副産物的に出来たり、参考サイトから引用させていただいた便利な関数が色々出来たので、忘れないように残していきます。


## 指定の要素を削除

ムービークリップを削除したい時にremoveChildを利用しますが、削除したい要素とその親のムービークリップを指定する必要があります。

削除したい要素の親をイチイチ覚えて居なかったりするので、削除したい要素を指定するだけで、削除できる関数を用意しました。

```actionscript
function deleteElement(target) {
	if( MovieClip(target.parent) is MovieClip){
		MovieClip(target.parent).removeChild(target);
	}
}
```


## 指定のムービークリップの子ムービークリップを全て削除

メモリーフローが起きる原因として、削除したはずのムービークリップが残ってしまっていることがあります。

そこで、指定の子供を削除する[こちらの関数](http://ameblo.jp/linking/entry-10152208935.html)を参考にさせていいただき、指定したムービークリップの子供を全て走査して削除する関数を用意しました。  
 こちらを利用することで、ムー日クリップの削除し忘れが軽減できると思います。

```actionscript
function allRemoveChild(parenMC:MovieClip):void {
	var deleteNum:uint = parenMC.numChildren;
	for(var i:uint=0; i<deleteNum; i++){
		if( parenMC.getChildAt(i) is MovieClip){
			var lTgt:MovieClip = parenMC.getChildAt(i) as MovieClip;
			allRemoveChild( lTgt );
		}
	}
	for (var k:uint = 0; k<deleteNum; k++) {
		var child:* = parenMC.getChildAt(0);
		parenMC.removeChild(child);
	}
}
```
 
###透明度を操作したロールオーバー

簡易的にロールオーバーを作成するには、透明度を操作するのが一番手っ取り早いので、なるべく簡単に設定できる関数を用意しました。

```actionscript
function setAlphaRollOver(targetMC:MovieClip, sfrom:Number, sto:Number, stime:Number = 0 ) {
	targetMC.mfrom = sfrom;
	targetMC.mto = sto;
	targetMC.mtime = stime;
	targetMC.addEventListener( MouseEvent.ROLL_OVER, rovHandler );
	targetMC.addEventListener( MouseEvent.ROLL_OUT, rotHandler );
}
```


ここからは使っているトゥイーンライブラリによって少し記述を変えます。

Tweener使用Ver.

```actionscript
function rovHandler( e:MouseEvent ) {
	var tgt:MovieClip = e.currentTarget as MovieClip;
	Tweener.addTween( tgt, { alpha:tgt.mto, time:tgt.mtime. transition:"easeOutCubic" } );
}
function rotHandler( e:MouseEvent ) {
	var tgt:MovieClip = e.currentTarget as MovieClip;
	Tweener.addTween( tgt, { alpha:tgt.mfrom, time:tgt.mtime. transition:"easeOutCubic" } );
}
```

BetweenAS3使用Ver.

```actionscript
function rovHandler( e:MouseEvent ) {
	var tgt:MovieClip = e.currentTarget as MovieClip;
	if( tgt.tw != null ) {
		tgt.tw.stop();
	}
	tgt.tw = BetweenAS3.tween( tgt, { alpha:tgt.mto }, null, tgt.mtime, Cubic.easeOut );
	tgt.tw.play();
}
function rotHandler( e:MouseEvent ) {
	var tgt:MovieClip = e.currentTarget as MovieClip;
	if( tgt.tw != null ) {
		tgt.tw.stop();
	}
	tgt.tw = BetweenAS3.tween( tgt, { alpha:tgt.mfrom }, null, tgt.mtime, Cubic.easeOut );
	tgt.tw.play();
}
```