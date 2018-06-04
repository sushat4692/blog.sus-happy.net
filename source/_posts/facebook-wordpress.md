title: "Facebook公式WordPressプラグインをインストール→英語になったので少しいじってみた"
date: 2012-06-14T01:05:26.000Z
updated: 2016-04-03T14:18:30.000Z
tags: 
  - Facebook
  - WordPress
---

FacebookがWordPress向けの公式プラグインを公開していましたので、早速インストールしてみました。  
 どんな感じで表示されるのかのテストと、英語で表示されてしまっていたのを修正した箇所についてメモしておきます。

管理画面の日本語化ではないのであしからず･･･。


## インストール

通常のプラグインと変わりはなく、[プラグインのページ](http://wordpress.org/extend/plugins/facebook/)からダウンロード、「wp-content/plugins」の中にアップロードして、「有効化」します。

設定方法については、既に詳しく紹介されているページが、[ここ](http://jp.techcrunch.com/archives/20120612facebook-wordpress/)とか[ここ](http://www.landerblue.co.jp/blog/?p=3439)とか、英語ですが[Facebook上にもあります](http://developers.facebook.com/wordpress/)ので、割愛しておきます。


## 日本語化

そのままですと、JavaScript SDKを英語版を取得しにいってしまうため、英語表記のボタンやコメント欄が表示されてしまいます。

SDKを読み込んでるっぽい「fb-core.php」の中を見ていると、こんな記述が。

```php
function fb_get_locale() {
	$fb_valid_fb_locales = array(
		/*... 国名が一杯省略。　この中に「ja_JP」が存在している ...*/
	);

	$locale = get_locale();

	// convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does)
	if (strlen($locale) == 2) {
		$locale = strtolower($locale).'_'.strtoupper($locale);
	}

	// convert things like de-DE to de_DE
	$locale = str_replace('-', '_', $locale);

	// check to see if the locale is a valid FB one, if not, use en_US as a fallback
	if ( !in_array($locale, $fb_valid_fb_locales) ) {
		$locale = 'en_US';
	}

	return $locale;
}
```

パッと見た限りでは、ちゃんと各国に対応しているように感じますが、問題は「`get_locale()`」で取得される値と、SDKで判別する国名のスペルの違いです。

「`get_locale()`」では「ja」という値が返ってくるのですが、Facebook側では「ja_JP」が日本と扱っているため、存在しない国、と認識されてしまいます。

そこであまり美しくないですが、156行目辺りに以下の様にif文を追加･･･。  
 （別にこの関数の返り値を「ja_JP」で固定してしまっても問題ないと思います）

```php
// convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does)
if (strlen($locale) == 2) {
	if( $locale === "ja" )
		$locale = "ja_JP";
	else
		$locale = strtolower($locale).'_'.strtoupper($locale);
}
```

これでプラグインで追加したボタンやコメント欄も日本語化されていると思います。


## 参考

- [Facebook、ウェブの16.6%の制覇に乗り出す―WordPressにワンクリックでインストールできるソーシャル機能多数を発表](http://jp.techcrunch.com/archives/20120612facebook-wordpress/)
- [【速報版】慌ててココに実装。Facebook公式WordPressプラグイン | More Access,More Fun!](http://www.landerblue.co.jp/blog/?p=3439)
- [Facebook for WordPress – Facebook開発者](http://developers.facebook.com/wordpress/)