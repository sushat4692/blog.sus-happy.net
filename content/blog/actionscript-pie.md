---
title: "ActionScript3で扇形を描画してみた"
date: 2011-10-04T01:24:44.000Z
updated: 2016-04-03T14:57:14.000Z
tags: 
  - AS3
  - Flash
---

とある案件で円グラフを表示する必要があったので、今の流行からするとHTML5かもしれませんが、Flashで作ることにしました。

と、思ったのですが、矩形や直線・曲線、円は描画したことあったんですが、扇形は経験がなかったのと、計算する手間も惜しかったので調べてみました。


## 早速実装

調べてみると正に求めているクラスが公開されていたのでそちらを利用させていただきました。  
[参考サイト：扇形を描く](http://www.d-project.com/flex/001_DrawPie/)

ただ、参考サイトのデモでは単純な扇形の書き方が無かったので、逆にそれを残しておきます。

```actionscript
var x:uint = 100; var y:uint = 100; var r:uint = 100;
var shape = new Shape();
var g:Graphics = shape.graphics;
g.moveTo(x, y);
g.beginFill(0xff0000, 1);
// GraphicsLib.drawPie(Graphics,X座標,Y座標,半径,開始(rad),終了(rad),中心から描画の有無)
GraphicsLib.drawPie(g, x, y, r, 0, Math.PI, true);
g.endFill();
```

上記のコードで、(100, 100)を中心に半径100pxで下弦の半円が出来るはずです。

適宜、ShapeはSpriteやMovieClipに変更していただき、stage等にaddChildをしてください。