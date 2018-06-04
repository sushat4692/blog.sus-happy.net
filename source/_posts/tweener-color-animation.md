title: "Tweenerを利用した色を変化させるアニメーション"
date: 2010-07-15T01:05:35.000Z
updated: 2016-04-03T16:06:02.000Z
tags: 
  - AS3
  - Flash
  - Tweener
---

Flashでロールオーバー時に色の変化をさせたいことがあったので、Tweenerを利用して実現しました。

BetweenAS3でも色の変化をアニメーションさせることが可能なのですが、ColorMatrixFilterの使い方がイマイチ分からなかったのでもう少し勉強してからにします。

まずはTweenerの本体と、Tweenerのcolorプロパティを利用できるように、事前準備を行います。

```actionscript
import caurina.transitions.Tweener;
import caurina.transitions.properties.ColorShortcuts;
ColorShortcuts.init();
```

準備が終わったら、ほぼ通常のトゥイーンを生成するように設定し、変化させたい色を「_color」の値に代入します。

```actionscript
Tweener.addTween(hoge, {_color:0xFF0000,time:2,transition:"linear"});
```

上記の記述だと、hogeというムービークリップを等速で2秒間かけて、「0xFF0000」→赤色に変化させます。