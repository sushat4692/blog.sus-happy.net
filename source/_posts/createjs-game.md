title: "CreateJSを使って簡単なゲームを作ったのでメモ"
date: 2013-03-23T09:20:20.000Z
updated: 2016-04-03T13:29:19.000Z
tags: 
  - Canvas
  - CreateJS
  - html5
  - JavaScript
---

とある案件でCreateJSを利用してスマホ用のWebゲームを作ったので、その時に調べた内容をメモメモ。

Canvasを利用すること自体あんまり無かったのですが、結構簡単に実装することが出来ました。


## CreteJS

そもそもCreateJSとは、HTMLの要素であるCanvas要素の描画をFlashの様に操作出来るライブラリで、実際に自分もFlashを利用することもあったことから、比較的とっつきやすい内容でした。

また、実際には

- Canvasへの描画を制御する「[EaselJS](http://www.createjs.com/#!/EaselJS)」
- アニメーションの動きを制御する「[TweenJS](http://www.createjs.com/#!/TweenJS)」
- 外部ファイルの読み込みを制御する「[PreloadJS](http://www.createjs.com/#!/PreloadJS)」
- 今回利用していなかったのでご紹介は省かせて頂きますが音声データを制御する「[SoundJS](http://www.createjs.com/#!/SoundJS)」

の4つをパッケージ化したものが「[CreateJS](http://www.createjs.com/#!/CreateJS)」となります。

そのため、一部の機能だけ必要という事であれば、バラバラに利用することも可能です。


## Canvasを用意

とりあえず描画するためのCanvasが必要となります。

```html
<canvas id="sample_canvas"></canvas>
```

HTML側に用意できたらCreateJS側で指定します。

```javascript
var stage = new createjs.Stage('sample_canvas');
```

こんな感じで、CreateJSに関わるオブジェクトを利用する際は、createjs.***と記述することになります。


## 図形を描く

Canvas上に図形を描く場合はEaselJSのShapeオブジェクトを利用します。

```javascript
var rectangle = new createjs.Shape();
rectangle.graphics.beginFill("#ff0000").fillRect( 0, 0, 100, 100 );
stage.addChild( rectangle );
```

ネイティブのJavaScriptを利用する場合はcanvasタグの描画コンテキストに記述しますが、CreateJSはFlashのようにShapeを用意して、それぞれのgraphicsに指定することが出来ます。

さらに、サイズを指定した後でも、位置を変更したり、拡縮を行うことが出来る所も便利です。

```javascript
rectangle.x = 100; // x座標を100に
rectangle.y = 100; // y座標を100に
rectangle.scaleX = 2; // 横幅を2倍
rectangle.scaleY = 2; // 縦幅を2倍
```

この辺りもFlashっぽいですね。


## 画像を配置する

CreateJSには簡単に画像を配置出来るBitmapオブジェクトが用意されています。

使い方はこんな感じ。

```javascript
var bitmap = new createjs.Bitmap( 'path/to/image.png' );
stage.addChild( bitmap );
```

こちらもShapeオブジェクト同様に位置指定、拡縮を行うことが出来ます。便利。

```javascript
bitmap.x = 100; // x座標を100に
bitmap.y = 100; // y座標を100に
bitmap.scaleX = 2; // 横幅を2倍
bitmap.scaleY = 2; // 縦幅を2倍
```


## マウスイベントを割り当てる

ネイティブのJavaScriptの場合Canvasに配置したオブジェクトにはイベントを割り当てることが出来ず、クリック位置を計算する必要がありますが、CreateJSでは各オブジェクトにイベントを割り当てることが出来ます。

```javascript
bitmap.addEventListener( 'click', function() {
	alert( 'clicked.' );
} );
```

このように、addEventListenerでイベントを割り当て、また、removeEventListenerでイベントを外すことが出来ます。

```javascript
bitmap.removeEventListener( 'click', arguments.callee ); // 特定のイベントを解除
bitmap.removeAllEventListeners(); // 全て解除
```


## パラパラ漫画のように画像を変更する

位置だけではなく画像自体を変更してアニメーションをする場合、大きな一枚画像の中にアニメーションのコマを配置して見せるエリアをフレームごとに変化させ、パラパラ漫画のように見せる手法があります。Googleのトップでアニメーションする時は大体その手法が取られていますね。

CreateJSにはそのアニメーションを簡単に実装することが出来るBitmapAnimationオブジェクトが用意されています。

例えば、400px x 400pxの画像に100px x 100pxのコマの画像を縦横2枚ずつ、4フレームのアニメーション画像を用意したとすると、下記のような記述をします。

```javascript
var spritesheet = new createjs.SpriteSheet( {
	images: [ 'path/to/animation.png' ], // アニメーション画像を指定
	frames: [ 'width':100, 'height':100 ], // 1コマのサイズを指定
	animations: {
		run: [0,3] // アニメーションの最初と最後のフレーム数を指定 0から3までなので4枚
	}
} );
var animate = new createjs.BitmapAnimation( spritesheet );
stage.addChild( animate );
animate.gotoAndPlay( 'run' );
```

簡単、とか言っておきながら結構長ったらしい記述が必要となりますが…こんな感じです。

SpriteSheetで画像のコマ割りを指定して、BitmapAnimationで実際に制御します。

また、SpriteSheetの指定にはその他色々な設定があるので、少しご紹介しておきます。

```javascript
var spritesheet = new createjs.SpriteSheet( {
	images: [ 'path/to/animation.png' ],
	frames: [ 'width':100, 'height':100 ],
	animations: {
		run: { // animationsをより細かく指定します
			frames: [ 0, 2, 1, 3 ], // 0から3ではなく、フレーム番号を指定出来ます
			next: 'walk', // アニメーション完了後の動きを指定します、未設定、またはtrueの場合はループします
			frequency : 5 // 5フレームに1度画像を変更する
		},
		walk: {
			frames: [ 4, 5, 6 ],
			next: false, // nextにfalseを指定すると、アニメーションが終了します
		}
	}
} );
var animate = new createjs.BitmapAnimation( spritesheet );
stage.addChild( animate );
animate.gotoAndPlay( 'run' );
```

このように書くと、まず「run」で指定したアニメーションが発生し、「walk」へと移り、最後に停止します。

ややこしいですが実際に自分で作ろうとするともっとややこしいことになるので、かなり整理されていると思います。


## 描画の更新を自動的に行う

ここまで触れていませんでしたが、Canvas要素に描画した内容を動かすためには、内容を変更するごとにCanvasを更新するメソッドを呼ばなければなりません。

色んな所に更新するメソッドが出来てしまったり、忘れてしまって表示が変わらないと焦ってしまわないように、CreateJSに用意されている自動更新を使ってみます。

```javascript
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick( event ) {
	stage.update();
}
```

これだけであればsetIntervalで設定してしまっても何らかわりはありませんが、その他にもFPSの指定が出来たりする機能があります。

```javascript
createjs.Ticker.setFPS( 40 );
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick( event ) {
	stage.update();
}
```

FPS指定もFlasherには慣れ親しんだ設定なので、setIntervalでミリ秒指定するよりも分かりやすそうですね。


## アニメーションさせてみる

図形や画像の配置が出来たら今度は動かしてみます。

```javascript
createjs.Tween.get( rectangle )
	.to( { x: 100 }, 100 )
	.to( { y: 100 }, 100 );
```

ココからはTweenJSを利用します。Tween.getで動かす要素をしていして、メソッドチェーンでアニメーションをつなげていくことが出来ます。

上の例では、「100ミリ秒でx座標を100に移動」した後、「100ミリ秒でy座標を100に移動」します。

また、動き終わったらアクションを起こす、ということも可能です。

```javascript
createjs.Tween.get( rectangle )
	.to( { x: 100 }, 100 )
	.to( { y: 100 }, 100 )
	.call( hoge );
function hoge() {
	alert( 'animation end.' );
}
```

簡単ですがTweenJSの説明はこんな感じです。  
 その他、TimeLineなんて名前も見かけましたが、使ってないのと内容も把握できていないのでで説明を省いておきます。


## 外部データを予め読み込む

最後にPreloadJSをご紹介します。

通常のWebサイトであれば上から順に表示される、ということが普通ですが、ゲーム内で必要な要素が後から後から表示されてしまうと見栄えも悪いですし、ゲーム内容にも影響が出てしまう恐れがあります。

ということで、PreloadJSを利用して予め必要なデータを読み込んでおきます。

```javascript
var queue = new createjs.LoadQueue();
queue.loadFile( { id:"image", src:"path/to/image.png" } );
queue.load();
```

読み込みが完了したらイベントを起こす、というような設定は、addEventListenerで指定します。  
 また、addEventListenerのprogressで読込中の状況を取得出来ます。

JavaScript

```javascript
queue.addEventListener( 'complete', completeHandler );
queue.addEventListener( 'progress', progressHandler );
function completeHandler( event ) {
	alert( 'load end.' );
}
function progressHandler( event ) {
	event.loaded; // ロード読み込み状況 0から1の値が入ります
}
```

読み込みが完了したデータは、こんな感じで使うことが利用します。

```javascript
var bitmap = new createjs.Bitmap( queue.getResult( 'image' ) );
```

読み込むファイルを指定する際に設定したidをキーに、getResultでファイルの情報を取得することができますので、そのままBitmapオブジェクトに渡すことが出来ます。


## 雑感

長々と書かせて頂きましたが、Flashの様に、の説明通りFlashを触ったことがありASでアニメーションを制御してた方であれば結構分かりやすい作りだったと思います。

以前にSVGのライブラリをご紹介させて頂きましたが、CanvasはCanvasで面白いなぁなんて感じました。

まだまだご紹介しきれていない内容がありますので、公式のドキュメント等をご覧になっていただき活用していただければと思います。


## 参考サイト

- [EaselJS v0.6.0 API Documentation : EaselJS](http://www.createjs.com/Docs/EaselJS/modules/EaselJS.html)
- [TweenJS v0.4.0 API Documentation : TweenJS](http://www.createjs.com/Docs/TweenJS/modules/TweenJS.html)
- [PreloadJS v0.3.0 API Documentation : PreloadJS](http://www.createjs.com/Docs/PreloadJS/modules/PreloadJS.html)