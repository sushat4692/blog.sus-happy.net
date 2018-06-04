---
title: "PHPでMovableTypeのデータを扱ってみた その3"
date: 2014-01-30T22:27:50.000Z
updated: 2016-04-03T11:15:52.000Z
tags: 
  - MovableType
  - PHP
---

[その1](http://blog.sus-happy.net/201209/php-movabletype/ "PHPでMovableTypeのデータを扱ってみた")、[その2](http://blog.sus-happy.net/201209/php-movabletype-2/ "PHPでMovableTypeのデータを扱ってみた その2")でPHPで記事内容を取得する方法を掲載してきましたが、実はあれだけではカスタムフィールドのメディアファイルを取得出来ていませんでした。

今回はPHPライブラリを利用してメディアファイルの情報を取得する方法を探した所見つかったのでメモしておきます。


## 実装方法

### MT5の場合

[その2](http://blog.sus-happy.net/201209/php-movabletype-2/ "PHPでMovableTypeのデータを扱ってみた その2")の書き方で、メディアファイルのIDを取得します。

```php
// メディアファイルのカスタムフィールド [field_name] を宣言
Entry::install_meta( 'entry', 'field_name', 'vclob' ); // メディアファイルは [vclob] 形式
```

メディアファイルのIDを取得した後は、詳細情報を取りに行きます。  
 メディアファイルの詳細は「fetch_assets」というメソッドで取得出来ます。

```php
$args = array( 'id' => $asset_id );
$asset = $mt_class->db()->fetch_assets( $args );
```

また、PHPライブラリ側にもサムネイル画像を生成する関数が用意されていますので、リサイズも可能です。  
 ただ、何故かブログIDだけじゃなくブログ情報を要求されます。

```php
$blog_data = $mt_class->db()->fetch_blog( $blog_id );
$thumbnail = get_thumbnail_file( $asset, $blog_data, array( 'width' => 300, 'height' => 300 ) );
```

一連の流れをまとめて書くと、こんな感じです。

```php
// インスタンスは $mt_class で取得していると仮定
$mt_class = MT::get_instance( *** );

// ブログの情報を取得しておく
$blog_data = $mt_class->db()->fetch_blog( $blog_id );

// メディアファイルのカスタムフィールド [field_name] を宣言
Entry::install_meta( 'entry', 'field_name', 'vclob' ); // メディアファイルは [vclob] 形式

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_class->db()->fetch_entries( $args );

// ぐるぐる
foreach( $result as $post ) {
	// $post->field_name にメディアファイルのIDが入ってます
	$asset = $mt_class->db()->fetch_assets( array( 'id' => $post->field_name ) );

	// 横:300 x 縦:300のサムネイル画像を生成
	$thumbnail = get_thumbnail_file( $asset, $blog_data, array( 'width' => 300, 'height' => 300 ) );
}
```

### MT4の場合

[その2](http://blog.sus-happy.net/201209/php-movabletype-2/ "PHPでMovableTypeのデータを扱ってみた その2")の書き方で、メディアファイルのIDを取得します。

```php
global $mt;
$mt_db = $mt->db();
$mt_db->object_meta['entry'] = array( 'field.field_name:vclob' );
```

MT4の場合、メディアファイルのカスタムフィールドには、HTMLタグが保存されますので<del>面倒ですが</del>、まずはメディアファイルのIDをHTMLタグの中から抽出しないといけません。

カスタムフィールドから取得するとこんな形式の値が返ってくるはずです。

```html
<form mt:asset-id="***"></form>
```

なので、正規表現を使って頑張ってメディアファイルのIDを抽出します。  
 上記HTMLからIDを抽出し、fetch_assetsに代入するまでの関数を用意してみました。

```php
function get_asset( $asset ) {
	global $mt;
	$mt_db = $mt->db();
	if( preg_match( '/^<form.*mt:asset-id="(.*?)".*$/', $asset, $matches ) ){
		$asset_id = $matches[1];
		// 一件だとしても配列で返ってくるので抜き出す
		return array_shift( $mt_db->fetch_assets(array('id' => $asset_id)) );
	}
	return FALSE;
}
```

また、MT4にもサムネイルを作成する関数が用意されていますのでリサイズも可能です。MT5とほとんど変わりませんね。

```php
$blog_data = $mt_db->fetch_blog( $blog_id );
$thumbnail = get_thumbnail_file( $asset, $blog_data, array( 'width'=>300, 'height'=>300 ) );
```

一連の流れをまとめて書くと、こんな感じです。

```php
global $mt;
$mt_db = $mt->db();

// ブログの情報を取得しておく
$blog_data = $mt_db->fetch_blog( $blog_id );

// メディアファイルのカスタムフィールド [field_name] を宣言
$mt_db->object_meta['entry'] = array( 'field.field_name:vclob' );

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_db->fetch_entries( $args );

// ぐるぐる
foreach( $result as $post ) {
	// $post['entry_field.field_name'] にメディアファイルの情報が入ってます
	$asset = get_asset( $post['entry_field.field_name'] );

	// 横:300 x 縦:300のサムネイル画像を生成
	$thumbnail = get_thumbnail_file( $asset, $blog_data, array( 'width' => 300, 'height' => 300 ) );
}

// メディアファイルの詳細を取得する関数
function get_asset( $asset ) {
	global $mt;
	$mt_db = $mt->db();
	if( preg_match( '/^<form.*mt:asset-id="(.*?)".*$/', $asset, $matches ) ){
		$asset_id = $matches[1];
		// 一件だとしても配列で返ってくるので抜き出す
		return array_shift( $mt_db->fetch_assets(array('id' => $asset_id)) );
	}
	return FALSE;
}
```

## 雑感

ここまで来るともうちゃんとテンプレート作ろうよ、という話になりそうですが、どうしてもPHPで済ませたい場合は試してみる価値はあるかもしれません。

…自分はどうしてもPHPで済ませたかったので試してみましたが、ちゃんと動いています。