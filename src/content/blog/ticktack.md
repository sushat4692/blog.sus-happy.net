---
title: "TickTack.js - requestAnimationFrameをもうちょっと使いやすいモノにしてみた"
date: 2014-09-23T18:55:06.000Z
updated: 2016-04-03T10:56:47.000Z
tags:
  - JavaScript
---


以前に「[setTimeoutの代替関数？requestAnimationFrameを試してみた](http://blog.sus-happy.net/settimeout2requestanimationframe/ "setTimeoutの代替関数？requestAnimationFrameを試してみた")」という記事を書きましたが、ちょっと実行時間に狂いが激しかったので、色々と試してみてラッパークラスを作ってみたのでメモ。


## 改善点

- ある程度*FPSに近づける→*FPSの実行回数に近づける
- 以前のデモだと実はIE8非対応だったのですが解消


## 使い方

```html
<script src="path/to/TickTack.js"></script>
<script>
var someFunc = function() { /* 何か処理 */ };
var fps      = 30; // 30FPS : 1秒間に30回実行
var tick = new TickTack( someFunc, fps );

// 実行開始
tick.start();

/* 色々何か */

// 停止させたい時
tick.stop();
</script>
```


## デモ

[デモはコチラ](http://sushat4692.github.io/TickTack.js/)

「request30fps」が以前のテストコードです。それに比べると実行時間の総計は結構近くなっていると思います。


## ダウンロード

[GitHubで公開しています。](https://github.com/sushat4692/TickTack.js)
