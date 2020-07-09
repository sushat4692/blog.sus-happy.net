---
title: "「Raphaël」を使ってSVGによる図を描いてみた"
date: 2013-01-29T00:39:17.000Z
updated: 2016-04-03T13:35:26.000Z
tags: 
  - JavaScript
  - svg
---

やけに解像度の高いRetinaディスプレイが登場したり、手持ちのタブレット端末が流行ったりと、固定の画像で対応するには大変になってきそうな気がしたので、SVG等のベクタ画像をサイトに表示させる必要性があるのではないかと感じています。

そこで、実験的にJavaScriptを利用してベクタ画像を描画する[Raphaël](http://raphaeljs.com/)を使って[自サイト](http://sus-happy.net/)に線を引いてみました。

その他、矩形や円を描画したり、色を塗ったり出来るみたいなので、その辺りも含めて残しておきます。


## Raphaëlを使う準備

<script src="//yandex.st/raphael/2.1.0/raphael.min.js" type="text/javascript"></script>  
<style type="text/css">.entry-content svg{border:1px solid #999;}</style>

何だか最近フレームワークばかり触っていたので、色々読み込まないと行けないかと思ってましたが、ファイルは一つだけ。  
 また、描画するDOMを用意しておきます。

```html
<div id="canvas"></div>
<script type="text/html" src="path/to/raphael-min.js"></script>
```

最初に描画するコマンドを呼び出す前に描画するDOMの指定と、サイズを指定します。

```javascript
// Raphael( ID, width, height );
var paper = Raphael( "canvas", 300, 300 );
```


## パス（線）を描く

基本的に[SVG1.1](http://www.w3.org/TR/SVG/)を準拠した書き方のようです。が、[SVGのパスを描く記法](http://www.w3.org/TR/SVG/paths.html#PathData)が分かりづらい…。

「M」がmove to（座標位置を移動）、「L」がline to（現在地から指定位置まで線を引く）の様です。

<div id="raphael_canvas_path"></div>

```javascript
var path = paper.path( "M 10 10 L 90 90 M 90 10 L 10 90" );
```

<script type="text/javascript">var path_paper = Raphael( 'raphael_canvas_path', 100, 100 );
var path = path_paper.path( 'M 10 10 L 90 90 M 90 10 L 10 90' );</script>

この記述で、「x:10,y10に移動、そこからx:90,y:90まで線を引き、x:90,y:10に移動、そこからx:10,y:90まで線を引く」という指定になります。（日本語にしてもよく分からない…。）  
 単純に一本の線を引くだけなら、「M x1 y1 L x2 y2」という感じですね。

また、最後に「z」を置くとパスを閉じます。

<div id="raphael_canvas_path_z"></div>

```javascript
var path_z = paper.path( "M 50 10 L 10 90 L 90 90 z" );
```

<script type="text/javascript">var path_paper_z = Raphael( 'raphael_canvas_path_z', 100, 100 );
var path_z = path_paper_z.path( 'M 50 10 L 10 90 L 90 90 z' );</script>


## 円を描く

円はパスに比べるとかなり分かりやすいですね。

circle( x座標, y座標, 半径 )の様に指定します。

<div id="raphael_canvas_circle"></div>

```javascript
var circle = paper.circle( 50, 50, 25 );
```

<script type="text/javascript">var circle_paper = Raphael( 'raphael_canvas_circle', 100, 100 );
var circle = circle_paper.circle( 50, 50, 25 );</script>


## 矩形を描く

矩形もほぼ円と変わりません。

rect( x座標, y座標, 横幅, 縦幅 )の様に指定します。

<div id="raphael_canvas_rect"></div>

```javascript
var rect = paper.rect( 10, 30, 80, 40 );
```

<script type="text/javascript">var rect_paper = Raphael( 'raphael_canvas_rect', 100, 100 );
var rect = rect_paper.rect( 10, 30, 80, 40 );</script>


## 色を変更する

fillで塗り、strokeで線の色を変更できます。

<div id="raphael_canvas_color"></div>

```javascript
// 赤
var circle_red = paper.circle( 10, 50, 10 );
circle_red.attr( "fill", "#ff0000" );
// 緑
var circle_green = paper.circle( 50, 50, 10 );
circle_green.attr( "fill", "#00ff00" );
// 青
var circle_blue = paper.circle( 85, 50, 10 );
circle_blue.attr( "fill", "#0000ff" );
```

<script type="text/javascript">var color_paper = Raphael( 'raphael_canvas_color', 100, 100 );
var circle_red = color_paper.circle( 15, 50, 10 );
circle_red.attr( 'fill', '#ff0000' );
var circle_green = color_paper.circle( 50, 50, 10 );
circle_green.attr( 'fill', '#00ff00' );
var circle_blue = color_paper.circle( 85, 50, 10 );
circle_blue.attr( 'fill', '#0000ff' );</script>

描画のメソッドにチェーンメソッドで続けたり、attrに複数指定することも出来ます。

<div id="raphael_canvas_chain"></div>

```javascript
var circle_chain = paper.circle( 50, 50, 25 ).attr( { "fill":"#ff0000", "stroke":"#0000ff" } );
```

<script type="text/javascript">var chain_paper = Raphael( 'raphael_canvas_chain', 100, 100 );
var circle_chain = chain_paper.circle( 50, 50, 25 ).attr( { 'fill':'#ff0000', 'stroke':'#0000ff' } );</script>


## その他

Raphaëlの魅力は何といってもIE6からでも利用できる、という点だと思います。  
 正確にはSVGは対応していないので、VMLという形式を利用しているようです。

正直な所、IE6に力を入れるべきなのか迷う所ですが、利用できるに越したことはないですね。

その他、アニメーションやイベントのトリガーなどなど、色々な事が出来るようなので参考サイトを残しておきます。  
 自分でもまたちょこちょこと調べていきます、と書いたエントリーが溜まってきました…ガンバリマス。


## 参考サイト

- [Raphaël Reference](http://raphaeljs.com/reference.html)
- [svgをやりたいからRaphaëlを使ってみる – @blog.justoneplanet.info](http://blog.justoneplanet.info/2010/07/19/svg%E3%82%92%E3%82%84%E3%82%8A%E3%81%9F%E3%81%84%E3%81%8B%E3%82%89raphael%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B/)
- [Scalable Vector Graphics (SVG) 1.1 (Second Edition)](http://www.w3.org/TR/SVG/)