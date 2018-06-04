title: "WordPress 4.1の管理画面の一部だけ文字化けが発生したのでメモメモ"
date: 2015-02-09T22:42:36.000Z
updated: 2016-04-03T10:36:10.000Z
tags: 
  - PHP
  - WordPress
---


WordPressの管理画面の一部だけ文字化けが発生するという、不思議な現象が発生したので調査した内容をメモしておきます。


## 目次

- [文字化けの発生箇所](#condition)
- [文字化け発生の原因を推測](#conjecture)
- [動的生成時の翻訳処理について調査](#dynamic_translation)
- [解決策](#result)


## <a name="condition">文字化けの発生箇所</a>

文字化けが発生したのは、管理画面内の一部分だけで、下記の通りです。

- 投稿画面の「メディアを追加」クリック時のモーダルウィンドウ内
- メディア画面のソートするプルダウン（グリッド表示時のみ）


## <a name="conjecture">文字化け発生の原因を推測</a>

全てが文字化けしているのであれば、PHPやApacheの設定かと思いましたが、ごく一部だけだったので、最初に疑ったのは翻訳ファイルの破損でした。

<dl><dt>検証</dt><dd>`/wp-content/languages`配下のpoファイルを確認し、破損していないことを確認してmoファイルに再コンパイル、上書き。</dd><dt>結果</dt><dd>変化なし。</dd></dl>ここまで確認した後に改めて文字化けが発生している箇所の共通点を洗い出してみると、どちらともJavaScript経由で動的に生成されている要素であることに気づきました。  
 （何でグリッド表示時のみ動的生成なのだろう）


## <a name="dynamic_translation">JS動的生成時の翻訳処理について調査</a>

では、JSによる動的生成時の翻訳はどのように行っているのか確認してみると、

1. `/wp-admin/load-scripts.php` 経由で必要なJSファイルをひとまとめにして読込
2. 翻訳用のデータはpoファイルから読み込む
3. `wp_localize_script`でJSON形式に変換してHTMLに直書き

おおよ上記の通りのようでしたので、次にどこの時点で化けているのかを調べてみると、3の`wp_localize_script`で吐き出している時に化けている事に気づきます。

では、恐らくJSON形式に変換しているところで何か起きていると踏んで調べているとjson_encodeをする前に下記の関数で変換していることが分かりました。

```php
// wp-includes/functions.php : 2756

function _wp_json_convert_string( $string ) {
	static $use_mb = null;
	if ( is_null( $use_mb ) ) {
		$use_mb = function_exists( 'mb_convert_encoding' );
	}

	if ( $use_mb ) {
		$encoding = mb_detect_encoding( $string, mb_detect_order(), true );
		if ( $encoding ) {
			return mb_convert_encoding( $string, 'UTF-8', $encoding );
		} else {
			return mb_convert_encoding( $string, 'UTF-8', 'UTF-8' );
		}
	} else {
		return wp_check_invalid_utf8( $string, true );
	}
}
```

UTF-8に変換してからJSON形式に変換するための関数のようですね。  
 よくよく見ると`mb_detect_order`を利用している事がわかります。

そこで、php.iniの設定状況を確認すると、**「SJIS,EUC-JP,JIS,UTF-8,ASCII」**という並びになっており、文字化けが起きているのはどうも**UTF-8に辿り着く前に一致した文字コードで変換をしてしまった**からのようでした。


## <a name="result">解決策</a>

解決方法は単純です、PHPの設定のdetect_orderを変更して、UTF-8を先頭にすることで解消しました。

まぁ、UTF-8のプログラム動かすなら、優先度もちゃんとUTF-8からにしましょうね、ということでした…。

ちなみにこの関数は4.1から追加されたようなので、4.1にアップデートして文字化けが起きた場合はこれが原因の可能性もあるかもしれません。