---
title: "PHPでFlash Liteを動的生成するライブラリMedia_SWFを色々といじって自分向けにしてみた"
date: 2013-05-28T22:50:20.000Z
updated: 2016-04-03T11:28:14.000Z
tags: 
  - Flash
  - Flash Lite
  - PHP
---


とある案件でFlash Lite 1.1を触っていまして、少しでもややこしい動きをさせようとすると「そんなこと出来ませんよ」って言われながら、色々と試行錯誤をしていました。

その中で、容量を減らすために通常のFlashでは非同期的に素材を読み込んだりすると思うんですが「そんなこと出来ませんよ」と言われたので、PHPでswf内の変数や画像を書き換える事が出来る、と以前聞いたことがあったを思い出しながら挑戦してみました。


## swfをPHPで操作するライブラリ

swfをPHPで操作するライブラリは「[swfmill](http://swfmill.org/)」「[SWFEditor](http://sourceforge.jp/projects/swfed/)」「[Ming](http://php.net/manual/ja/ref.ming.php)」という様なライブラリがあるそうなのですが、今回実装したかったのは、「変数の挿入・置換」「特定の画像の差し替え」の2つだけだったので、[参考サイト](http://tech.kayac.com/archive/generate_flashlite_var1.html)で紹介されていた「[Media_SWF](https://github.com/ken39arg/Media_SWF)」を利用することにしました。


## Media_SWFをいじる

<dl>
<dt>変数挿入メソッド追加</dt>
<dd>Media_SWFを見てみると、「変数の値を置換する」処理は存在していたのですが、「変数を挿入する」処理はありませんでした。 
本来的には置換だけで良いかと思うんですが、<del>変数定義し忘れて後から挿入するものぐさな事が出来なかったので</del>念のために追加しました。</dd>
<dt>入力補助クラスの追加（簡略化）</dt>
<dd>同じswfを触るのに新しいクラス定義したりする処理が個人的に過ぎじゃなかったのと、複雑な処理をするつもりはなかったので、簡単な変数を与えるだけで処理するクラスを用意してみました。 
やれることが少ない分、簡単に利用できるようになっていると思います。</dd>
<dt>その他諸々</dt>
<dd>その他、「[FlashForward](http://ken39arg.github.io/FlashForward/)」というFlashLite 1.1をSVGアニメーションに変換させるライブラリがMedia_SWFを色々と最適化させているようだったので、サクッと気づいた部分だけ踏襲させて頂きました。</dd>
</dl>
 
### ダウンロード

[GitHubに公開しています](https://github.com/sus-happy/Media_SWF)


## 使い方

### はじめに

読み込むファイルは一つのみです。その他のファイルはそこから読み込みます。 
使っていないファイルも読み込んでしまうので、パフォーマンス的にはイマイチかもしれませんが…。

```php
require_once( 'path/to/SwfWrapHelper.php' );
```

まず、書き換えたいswfを入力補助クラスに渡します。

```php
$swf = new SwfWrapHelper( 'path/to/movie.swf' );
```

単純にswfを書き換えたデータを取得したいだけの場合は、

```php
$content = $swf->build();
```

そのまま表示まで行う場合は、

```php
$swf->view();
```

のように書きます。 
「view」の場合は、「build」も一緒に実行しますので、「build」->「view」のように実行する必要はありません。

### 変数を挿入する

読み込んだswfの「1フレーム目の先頭」に変数を挿入するメソッドです。もし、既に1フレーム目に同名の変数が存在する場合は値を書き換えます、たぶん。（試してませんが）

```php
$swf->set_master_var( 'key', 'var' );
```

変数名「key」に「var」という値が入ります。

また、一気に値を追加したい場合は、

```php
$vars = array(
	'hoge' => 'fuga',
	'foo' => 'bar'
);
$swf->set_master_var_array( $vars );
```

というメソッドも用意してあります。

### 画像を差し替える

swf内で利用されている画像を差し替える際に、利用している各画像のIDを渡します。ですが、このIDを何処で調べることが出来るのか良く分かっていません。  
 タイムライン上に出現する順番にIDが割り振られているんじゃないかと思うんですが…。調べる方法を見つけたら追記します。

実際の書き方はこんな感じです。

```php
// $id = swf内の画像ID
$swf->replace_image( $id, 'path/to/image.jpg' );
```

画像形式はJPG、PNG、GIFに対応していて、拡張子で判別しています。 
逆に言うと拡張子でしか判別していないので、動的に画像データを渡す際は気をつける必要があります。

### 一連の記述例

```php
<?php 
require_once( 'path/to/SwfWrapHelper.php' );

// swfファイルの読み込み
$swf = new SwfWrapHelper( 'path/to/movie.swf' );

// 変数の挿入/置換
$swf->set_master_var( 'key', 'val' );
$vars = array(
	'hoge' => 'fuga',
	'foo' => 'bar'
);
$swf->set_master_var_array( $vars );

// 画像の差し替え
$swf->replace_image( $id, 'path/to/image.jpg' );

// 書き換え後のswfの出力
$swf->view();
```


## 雑感

あんまり今回の件とは関係ありませんが…HTML5やCSS3やらSVGやらCanvasやらなにやら騒がれていますが、適材適所でFlashもしっかりと取り入れていく頭は残しておかないといけないように感じます。

モダンブラウザの浸透率を考えるとクロスブラウザを考えなくていいのは結構大きな強みなんじゃないかと思っていますし、Flashから変換する技術も高くなってきているんじゃないかと思っています。

簡単なアニメーションを作れる所も優秀なツールですよね。HTML5でもEdge Animateとか出てきましたがどうなんでしょう？色々試してみないと…。


## 参考サイト

- [FlashLite 動的生成の全てを教えます(その1?) | tech.kayac.com – KAYAC engineers' blog](http://tech.kayac.com/archive/generate_flashlite_var1.html)
- [FlashForward @ GitHub](http://ken39arg.github.io/FlashForward/)