title: "WordPressのmeta_queryを使ったカスタムフィールドによる検索をしてみた"
date: 2011-05-10T01:59:00.000Z
updated: 2016-04-03T15:07:32.000Z
tags: 
  - PHP
  - WordPress
---

WordPress3.1より`meta_query`が実装され、カスタムフィールドを用いた検索方法が細かく設定できるようになったようなので試してみました。


## 従来の方法

従来の方法は「`meta_key`」と「`meta_value`」を一つずつ指定するのみでした。

例えば「`hoge`」と名前の付けられたカスタムフィールドの値が「`fuga`」と設定されている記事を検索するには以下のように書きます。

```php
query_posts( array(
	"meta_key" => "hoge",
	"meta_value" => "fuga"
) );
```

また、「`meta_compare`」に、「=」（デフォルト）、「!=」、「>」、「>=」、「<」、「<」の指定をして異なる検索結果を得ることが出来ます。

先ほどの例に`meta_compare`を追加することで、「`hoge`」という名前の付けられたカスタムフィールドの値が「`fuga`」と設定されていない記事を検索することが可能です。

```php
query_posts( array(
	"meta_key" => "hoge",
	"meta_value" => "fuga",
	"meta_compare" => "!="
) );
```


## meta_queryを用いた方法

`meta_query`を用いると、従来は一つのカスタムフィールドしか検索できなかったものが、複数のカスタムフィールドを指定することが出来ます。

```php
query_posts( array(
	"meta_query" => array(
		array(
			"key" => "hoge",
			"value" => "fuga"
		),
		array(
			"key" => "foo",
			"value" => "bar"
		)
	)
) );
```

上記の例では「`hoge`」の値が「`fuga`」と設定されており、且つ、「`foo`」の値が「`bar`」と設定されている記事を検索出来ます。

また、条件式の「`compare`」も追加されており、「LIKE」、「NOT LIKE」、「IN」、「NOT IN」、「BETWEEN」、「NOT BETWEEN」という曖昧な検索を行えるようになりました。

以下のように記述することで、「`hoge`」に「`fuga`」という文字列を含み、「`foo`」（配列）の値が「`bar`」を持たない記事を検索できます。

```php
query_posts( array(
	"meta_query" => array(
		array(
			"key" => "hoge",
			"value" => "fuga",
			"compare" => "LIKE"
		),
		array(
			"key" => "foo",
			"value" => "bar",
			"compare" => "NOT IN"
		)
	)
) );
```

単純なブログとして利用する分にはあまり使わないかもしれない機能ですが、少し規模を大きくしていくと必要となってくる場合があります。

以前であれば`add_filter`等を用いて回りくどく設定しないといけない内容でしたが大分楽に行えるようになりました。  
 こういう機能は増えていくと嬉しいですね。