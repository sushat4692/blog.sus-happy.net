---
title: "setTimeoutの代替関数？requestAnimationFrameを試してみた"
date: 2014-04-02T02:42:04.000Z
updated: 2016-04-03T11:06:28.000Z
tags: 
  - JavaScript
---

アニメーションを実装するときに、setTimeoutやsetIntervalを利用してDOMやCSSをいじってアニメーションを実装していましたが、今更ながらrequestAnimationFrameというものの存在を知りました。

調べてみると完全に代替出来るものではなさそうなので、自分なりに使い方とどんな時に利用できるのかを残しておこうと思います。


## requestAnimationFrameとは

setTimeoutは指定したミリ秒間隔で渡した関数を実行しますが、requestAnimationFrameは**「再描画を実行する前に実行」**します。

そのため、PCのスペックや同じタイミングで動作している処理の内容によって実行される間隔が変化します。（MDNによると毎秒60回程度実行されるとのこと）

### 利用するメリット

毎回描画出来るタイミングで実行されるため、描画できないタイミングでDOMやCSSを書き換えても実際には動いていない、というような無駄な処理が発生しません。  
 また、タブが非アクティブな状態になると処理が軽減される、そうなのですが、実はsetTimeoutでも同じような処理がなされているそうです。

### 利用するデメリット

処理が実行されるタイミングがブラウザ側に依存されるため、狙ったタイミングで実行することができません。  
 また、実行されるタイミングも必ずしも一定とは限らないため、特定の速度で処理させようとすると中間の処理が必要となります。

この辺りの詳細については、[コチラのスライド](http://0-9.sakura.ne.jp/pub/lt/modest/start.html)で詳しく説明されていますので参考になるかと思います。

### 利用方法

setTimeoutの様に関数を渡すと実行されますが、実行されるタイミングが「描画できるタイミング」になるので、ミリ秒の間隔は渡す必要はなく、渡したくても渡せません。

また、requestAnimationFrameは実験的な関数であるためベンダプレフィックスがついていたり、そもそも実装されていないブラウザも存在しているため、下記の様に記述することでrequestAnimationFrameを優先し、存在しない場合はsetTimeoutで実行させることが出来ます。

```javascript
// requestAnimationFrameを優先に、存在しなければsetTimeoutを取得する
var requestAnimationFrame = window.requestAnimationFrame
                            || window.webkitRequestAnimationFrame
                            || window.mozRequestAnimationFrame
                            || window.setTimeout;
window.requestAnimationFrame = requestAnimationFrame;
 
function func() {
    // 実行させたい何か
}
 
requestAnimationFrame( func, interval ); // intervalはsetTimeoutの時だけ利用されます
```

実際に使ってみたイメージとしてはsetTimeout的な動きのように感じました。


## 30FPS（くらい）を狙って出す例

この例が最適では無いとは思いますが、例えばこんな方法で30FPSくらいの速度を狙えるのでは無いかと思います。

```javascript
// 基準実行時間
var basetime = Date.now();
 
// FPS
var fps = 1000/30;
 
// setTimeoutを利用した場合は最初から30FPSで実行される
function animate_handler() {
    var now   = Date.now();
    var check = now - basetime;
    if( check / fps >= 1 ) {
        basetime = now;
 
        draw();
    }
 
    requestAnimationFrame( animate_handler, fps );
}
 
function draw() {
    // 再描画処理
}
 
animate_handler();
```

[デモも用意してみました](http://demo.sus-happy.net/javascript/requestAnimationFrame/)が、一定のリズムを刻むのは難しそうですね…。


## 雑感

全ての処理を書き換える必要はなさそうですが、一回のレンダリングの処理が重い場合は、ループ処理の方が過多になってしまって負荷がかかってしまうかもしれないので、そういった場合には使う価値がありそうな気がします。

参考のサイトでも記述されていますが、Canvasにアニメーションを描画する等、JavaScriptを使ったアニメーションは利用する価値大って感じですかね？またレンダリングの負荷が大きい処理で実験してみたいと思います。


## 参考

- [window.requestAnimationFrame – Web API インターフェイス | MDN](https://developer.mozilla.org/ja/docs/Web/API/window.requestAnimationFrame)
- [いまさらrequestAnimationFrameを理解する – console.lealog();](http://lealog.hateblo.jp/entry/2013/10/01/235736)
- [jQueryで破棄されたrequestAnimationFrameとJSでのアニメーション実装で注意すること](http://0-9.sakura.ne.jp/pub/lt/modest/start.html)