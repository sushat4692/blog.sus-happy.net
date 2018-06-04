---
title: "three.jsを少し触ってみたのでテクスチャを利用する際のメモ"
date: 2015-06-21T21:58:05.000Z
updated: 2016-04-03T10:28:42.000Z
tags: 
  - 3D
  - html5
  - JavaScript
  - three.js
  - WebGL
---


次世代Canvasとも言える、WebGLを簡単に扱うことができる、[three.js](http://threejs.org/)を少しだけ触ってみたのでメモです。

インストールから初期設定、[簡単なサンプルの実行までは、既に詳細に分かりやすく説明されている記事](https://html5experts.jp/yomotsu/5225/)がありますので、そちらをご覧頂ければと思います。

※「THREE.CubeGeometry」は「THREE.BoxGeometry」に名称変更されている様なので注意。


## 画像をテクスチャとして貼る

画像をテクスチャとして貼る場合は、「THREE.ImageUtils.loadTexture」で読み込んで、Materialに貼り付けます。

```javascript
// 立方体を用意
var geometry = new THREE.BoxGeometry( 30, 30, 30 );

// 画像を読み込む
var texture = THREE.ImageUtils.loadTexture( 'path/to/image.jpg' );

// マテリアルに画像を貼る
var material = new THREE.MeshPhongMaterial( { map: texture } );

// オブジェクトを生成
var mesh = new THREE.mesh( geometry, material );
```


## 動画をテクスチャとして貼る

テクスチャに動画も簡単に利用することが可能です。  
 ただし、動画の再生にはHTML5のvideoタグを利用するので、スマホでは再生されないので注意です。

```javascript
// 立方体を用意
var geometry = new THREE.BoxGeometry( 30, 30, 30 );

// videoタグの用意
var video = document.createElement( 'video' );
video.src = 'path/to/video.mp4';
video.load();
video.play();

// three.js用のテクスチャに変換
var texture = new THREE.VideoTexture( video );
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBFormat;

// マテリアルに動画を貼る
var material = new THREE.MeshPhongMaterial( { map: texture } );

// オブジェクトを生成
var mesh = new THREE.mesh( geometry, material );
```


## 雑感

今までずっとFlashやCanvas等で2Dを触ってきたので3Dには少し抵抗感がありましたが、思っていたよりも簡単に触ることが出来ました。  
 また、WebGLのパフォーマンスもかなり高く、スマホでも思った以上にヌルヌル動くので、今後もっと3Dのコンテンツが出てくるのでは無いかと思いました。

また、まだ基本のマテリアルを使ったテストしかしていないので、モデルを使ったコンテンツも作ってみたいなぁと思います。


## 参考

- [初心者でも絶対わかる、WebGLプログラミング＜three.js最初の一歩＞ | HTML5Experts.jp](https://html5experts.jp/yomotsu/5225/)
- [Three.jsで動画をテクスチャに指定する – Qiita](http://qiita.com/edo_m18/items/b697cba36de168e8a608)