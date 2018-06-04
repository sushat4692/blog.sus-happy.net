title: "PHPでMovableTypeのデータを扱ってみた"
date: 2012-09-08T18:11:43.000Z
updated: 2016-04-03T13:58:32.000Z
tags: 
  - MovableType
  - PHP
---

個人的にMovableTypeの様な静的生成が苦手なのですが、ダイナミックパブリッシングもイマイチ上手く扱えないのでどうにかしてPHPで直接取得できないか調べていました。

今まで知らなかったのですが、どうもPHPのライブラリが内包されているようで、それを利用することで割と簡単に実装することが出来たのでメモしておきます。


## 記事の一覧を取得

MovableTypeのアプリケーションディレクトリ内の「PHP」ディレクトリ内にライブラリが内包されています。  
 簡単な使い方の例として、“最新10件分の記事を取得”する記述は下記の通り。

### Movable Type 5の場合

MT5はPHP5以上を想定されているため、チェーンメソッドが使えたり、インスタンスメソッドが用意されています。

```php
// MTのシステムディレクトリを「path/to/mt」とする
$mt_dir = 'path/to/mt';

// MTのPHPライブラリを読み込み
require_once( $mt_dir.'/php/mt.php' );
require_once( $mt_dir.'/php/lib/MTUtil.php' );

// MTクラス
$mt_class = MT::get_instance($blog_id, $mt_dir.'/mt/mt-config.cgi');

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_class->db()->fetch_entries( $args );
```

### Movable Type 4の場合

Movable Type 4の場合、PHP4からの対応の為、クラスの実装方法が変わっているため、呼び出し方も変えないといけません。  
 特に気を付ける点としては、クラスの受け渡しにグローバル変数を利用している事でしょうか？

上記例と同じ事をするにはこんな感じに記述します。

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

// 最新10件取得
$args = array(
	'blog_id' => $blog_id,
	'limit' => 10
);
$result = $mt_db->fetch_entries( $args );
```


## カスタムフィールドの値を取得

参考のサイトを見てみると、「entry_field.ベースネーム」で取得されるように書いてあるのですが、うまく取れませんでした。MT4しか試してなかったので、MT5なら取得できるのでしょうか？

「mtdb_base.php」内の記述にもそれらしき箇所があるのですが、ちょっと分からなかったので、記事を取得してからもう一回カスタムフィールドのデータを取得する方法を取ってみました。

### MT5の場合

記事情報に対してい１つずつ「get_meta」を利用してカスタムフィールドの情報を取得します。

```php
// $mt_class = MT::get_instance( *** );
// $result = $mt_class->db()->fetch_entries( $args );
foreach( $result as $key => $val ) {
	$result[$key]["meta"] = $mt_class->db()->get_meta( 'entry', $val["entry_id"] );
}
```

### MT4の場合

基本的にMT5との違いはありません。

```php
// $mt = new MT( *** );
// $mt_db = $mt->db();
// $result = $mt_db->fetch_entries( $args );
foreach( $result as $key => $val ) {
	$result[$key]["meta"] = $mt_db->get_meta( 'entry', $val["entry_id"] );
}
```

本来はfetch_entries内に既に機能が備わっているはずなので、他に良い方法がありそうですが…。


## その他

### 引数について

fetch_entriesで渡したデータで返ってくる記事が変化しますが、代表的なモノとしては下記のモノが挙げられます。

<dl>
<dt>blog_id / include_blogs / exclude_blogs</dt>
<dd>ブログID</dd>
<dt>entry_id / not_entry_id</dt>
<dd>記事ID</dd>
<dt>limit</dt>
<dd>取得記事数</dd>
<dt>offset</dt>
<dd>オフセット</dd>
<dt>lastn</dt>
<dd>最新から取得記事数</dd>
<dt>category / categpries</dt>
<dd>カテゴリー</dd>
<dt>tag / tags</dt>
<dd>タグ</dd>
<dt>current_timestamp / current_timestamp_end</dt>
<dd>公開日時</dd>
<dt>author</dt>
<dd>投稿者</dd>
<dt>sort_by / sort_order</dt>
<dd>表示順</dd>
</dl>

### 記事以外を取得

fetch_entriesでは記事情報を取得しますが、その他の情報を取得する関数も用意されています。

<dl><dt>fetch_blogs / fetch_blog</dt><dd>ブログ</dd><dt>fetch_pages / fetch_page</dt><dd>ページ</dd><dt>fetch_categories / fetch_category</dt><dd>カテゴリー</dd></dl>

まだ他にもあるかと思いますが、代表的なものだけ。


## 参考

- [[Movable Type]PHPから特定のIDの記事のタイトル、本文、ステータス等を含んだオブジェクトを取得する « Codaholic](http://codaholic.org/?p=1617)
- [MT5のBrand new APIと格闘してみた。 – Junnama Online](http://junnama.alfasado.net/online/2010/02/_argsclass_entry_argsblog_id_blog_id_argsoffsetn_argslimitn_entries.html)
- [MT5のPHP APIを探る（その3） – The blog of H.Fujimoto](http://www.h-fj.com/blog/archives/2010/01/13-123957.php)