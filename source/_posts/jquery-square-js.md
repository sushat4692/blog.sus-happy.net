title: "正方形の要素を敷き詰めるjQueryライブラリ – jquery.square.js"
date: 2010-11-21T16:13:44.000Z
updated: 2016-04-03T15:33:32.000Z
tags: 
  - JavaScript
  - jQuery
---


- 2010年12月23日、修正を行いました。

ブログではなくて、トップページに使ってみようと作ってみた正方形の要素を敷き詰めるｊQueryライブラリを作ってみたので公開してみようかと思います。

オプションで、一つの正方形のサイズ、隣の要素との間隔等などの設定が可能です。

使い方はこんな感じ。

```javascript
$("#hoge").square();
```

上の記述で、「hoge」というidの付いた要素に適用されます。

[デモはこちら](http://demo.sus-happy.net/javascript/square/)

[ダウンロード（名前をつけて保存）](http://demo.sus-happy.net/javascript/square/js/jquery.square.js)

以下は詳細説明。


## 関数概要

`{target}.alphaRo({option});`

<dl><dt>{target}</dt><dd>適用する対象</dd><dt>{option}</dt><dd><dl><dt>[target](string) = square</dt><dd>敷き詰める要素のクラス名</dd><dt>[inner](string) = inner</dt><dd>敷き詰める要素と同じ高さにしたいクラス名</dd><dt>[scaleSplit](string) = _</dt><dd>要素一つの大きさを決める間の文字列（_x_y）  
 デフォルトでは「square _2」で2倍のサイズ、  
 「square _1_2」で縦長の長方形になります</dd><dt>[size](number) = 150</dt><dd>正方形一つの基本サイズ</dd><dt>[space](number) = 10</dt><dd>正方形と正方形の間隔</dd><dt>[speed](*) = 700</dt><dd>アニメーションの速度  
 （slow, normal, fastの三段階、もしくはミリ秒）</dd><dt>[ease](string) = easeOutQuad</dt><dd>イージングの種類  
 （<a href="http://gsgd.co.uk/sandbox/jquery/easing/">jQuery Easing Plugin</a>が必要です）</dd></dl></dd></dl>
## サンプルコード

スタンダード

```javascript
$(“a.sample01”).square();
```

正方形のサイズ変更

```javascript
$(“a.sample02”).square({size:200});
```

アニメーション速度変更

```javascript
$(“a.sample03″).square({speed:”fast”});
```
