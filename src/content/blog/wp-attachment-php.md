---
title: "WordPressのテーマにattachment.phpを追加して、添付ファイルページを失くしてみた"
date: 2013-02-07T02:54:13.000Z
updated: 2016-04-03T13:31:08.000Z
tags: 
  - WordPress
---

自分ではなく第三者にWordPressを使って貰う場合に、メディアを追加した時に添付ファイルのページが出来てしまうことが煩わしく思っていました。

自分が更新するのであれば、リンクを切ってしまうか、ファイルへのリンクを貼っておけば良いのですが、第三者が更新を行う場合は確実に防げるかと言われると言い切れない所があります。

そこで、添付ファイルのページにアクセスしてしまっても、ファイルを表示してしまえば良いのだ、と思い立ってテーマファイルを調べてみました。


## 添付ファイルのページについて

そもそも添付ファイルのページはテーマファイルのどのファイルが優先されるのか、というところから。

優先順位は下記のとおりとなります。

1. MIMEタイプ.php
2. MIMEサブタイプ.php
3. MIMEタイプ_MIMEサブタイプ.php
4. attachment.php
5. single.php
6. index.php

MIMEタイプとは、image/jpenやtext/plain等の事を指します。  
 つまり、例えばJPEG画像の添付ファイルの場合の優先度は、

1. image.php
2. jpeg.php
3. image_jpeg.php
4. attachment.php
5. single.php
6. index.php

という順番となります。

パッと見ると「MIMEタイプ_MIMEサブタイプ.php」の方が優先度が高そうに見えますが違うみたいですね。


## attachment.phpで添付ファイルを直接表示

早速ですがソースコードは下記の様に記述しました。

```php
<?php
if ( ( $meta = wp_get_attachment_metadata( get_the_ID() ) ) ) {
	$file = WP_CONTENT_DIR.'/uploads/'.$meta['file'];
	header( sprintf( 'Content-type: %s', $meta['sizes']['thumbnail']['mime-type'] ) );
	header( sprintf( 'Content-Length: %d', filesize( $file ) ) );
	readfile( $file );
} else
	header( sprintf( 'Location: %s', get_bloginfo( 'url' ) ) );
```

get_the_ID()で添付ファイルのIDが取得出来るので、`wp_get_attachment_metadata`でファイル情報を取得して、表示させています。


## 注意点

URL内に拡張子が無いので、LightBox系のモーダルウィンドウを表示するJSライブラリの中で、拡張子で判断する仕組みの場合に画像ファイルとして扱ってくれない場合があります。

こんな感じにシステム側で何とかしようかと思いましたが、最終的にはマニュアルなどを用意してちゃんとファイルに対してのリンクを貼ってもらったほうが良いかもしれません。