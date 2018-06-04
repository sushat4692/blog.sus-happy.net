title: "PHPでMovableTypeのデータを扱ってみた その2"
date: 2012-09-16T11:56:11.000Z
updated: 2016-04-03T13:54:04.000Z
tags: 
  - MovableType
  - PHP
---

前回の記事で、PHPでMovableTypeの記事を取得する方法を残していましたが、カスタムフィールドの情報の取得方法がちょっと回りくどい内容でした。

もうちょっとAPI内部を調べて見たところ、もう少しスマート？な方法が見つかったので残しておきます。

今回の方法では、データベースのアクセスは`fetch_entries`だけになるので、動作的には良くなっているかもしれません。


## 実装方法

内部を見てみると、どうも事前にどんなカスタムフィールドの情報が欲しいのか渡しておかないと、fetch_entriesでは返してくれないらしく、予め何のカスタムフィールドなのかと、ベースネームと変数型を伝えておく必要があるようです。

また、渡し方もMT5とMT4とバラバラのようなので注意が必要です。

### MT5の場合

静的メソッドが用意されているので、そこにカスタムフィールドの情報を渡します。

例えば、ブログ記事に、「hoge」というベースネームのテキスト形式のカスタムフィールドが用意されている場合は下記のように記述します。

```php
// MTのシステムディレクトリを「path/to/mt」とする
$mt_dir = 'path/to/mt';
 
// MTのPHPライブラリを読み込み
require_once( $mt_dir.'/php/mt.php' );
require_once( $mt_dir.'/php/lib/MTUtil.php' );

// Entryクラスにカスタムフィールドの情報を渡す
Entry::install_meta("entry", "hoge", "vchar_idx");

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_class->db()->fetch_entries( $args );
```

### MT4の場合

PHP4を想定されているため、クラス内の変数を直接触る事になります。

MT5の例と同じカスタムフィールドをMT4で取得する場合は下記のような記述になります。

```php
// MTのシステムディレクトリを「path/to/mt」とする
$mt_dir = 'path/to/mt';
 
// MTのPHPライブラリを読み込み
require_once( $mt_dir.'/php/mt.php' );
require_once( $mt_dir.'/php/lib/MTUtil.php' );
 
// MTクラス
// 他のライブラリで利用するので、グローバル変数「$mt」で割り当てること
global $mt;
$mt = new MT( $blog_id, $mt_dir.'/mt-config.cgi' );
// DBクラス
// チェーンメソッドが使えない環境を考慮して分割
$mt_db = $mt->db();

// DBクラスにカスタムフィールドの情報を渡す
$mt_db->object_meta["entry"] = array( "field.hoge:vchar_idx" );

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_db->fetch_entries( $args );
```


## 変数系の書き方について

上記の例でさらっと「`vchar_idx`」と書いていますが、カスタムフィールドに設定できる変数型の記述は少し特殊です。

各変数型の名前については、[こちらの記事でご紹介されています](http://www.h-fj.com/blog/archives/2010/01/13-123957.php)ので、こちらをご参照ください。


## 返り値について

上記記述によって`fetch_entries`でカスタムフィールドの値を取得することができますが、`get_meta`で取得した時はベースネームの名前がキーとなるのに対し、「`entry_field.ベースネーム`」と特殊な名前になりますので、こちらも注意が必要です。


## 参考

- [MT5のPHP APIを探る（その3） – The blog of H.Fujimoto](http://www.h-fj.com/blog/archives/2010/01/13-123957.php)