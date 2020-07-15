---
title: "FuelPHPのクエリビルダでMySQLのorder by fieldを利用するためにDB::expr()を使ってみた"
date: 2013-04-08T23:23:48.000Z
updated: 2016-04-03T13:24:54.000Z
tags: 
  - FuelPHP
  - MySQL
  - PHP
---

FuelPHP等のフレームワークを使う時はついつい便利なのでクエリビルダを利用してるのですが、どうしても特殊な操作を行う時はクエリビルダを利用するほうが分かりづらくなってしまったり、自動的にエスケープされて利用できなかったりして、結局クエリ文を直書きしてしまっていました。

その一つとして、MySQLのorder by field機能がクエリビルダにメソッドが存在しないのですが、何とかクエリビルダを使いながら実現出来ないか調べてみました。


## order by fieldって？

そもそもorder by fieldとは、指定した順番に検索結果を並べかえる、というMySQL独特な記法です。

```sql
SELECT * FROM `table` ORDER BY FIELD( `column`, 3, 1, 2 );
```

のように記述すると、columnが3→1→2の値の順に取得出来ます。

order by fieldで一つかと思ってましたが、fieldという文字列関数を利用しているみたいです。  
 参考：[MySQL :: MySQL 5.1 リファレンスマニュアル (オンラインヘルプ) :: 7.4 文字列関数](http://dev.mysql.com/doc/refman/5.1-olh/ja/string-functions.html#function_field)


## FuelPHPのクエリビルダ

FuelPHPのクエリビルダはDBクラスの静的メソッドと、そこからチェーンメソッドで条件を繋げていきます。

```sql
SELECT * FROM `table` WHERE `column` = 1 ORDER BY `id` DESC;
```

例えば、上記の様なクエリ文を構築する場合は、下記のように記述します。

```php
DB::select()->from('table')->where( 'column', 1 )->order_by( 'id', 'desc' );
```

系統の違うチェーンメソッドの順番は入れ替えても、構築される結果は変わりません。  
 つまり、上記と下記の記述は同じクエリ分が生成されます。

```php
DB::select()->order_by( 'id', 'desc' )->from('table')->where( 'column', 1 );
```

こういった順番を気にしなくても良いところや、変数型によって自動的にエスケープしてくれる所が個人的に好みなので、フレームワークを利用する際は頻繁に活用しています。

FuelPHPのクエリビルダをまとめてくれているページがありましたので、ご紹介しておきます。  
 参考：[FuelPHPのクエリビルダを表にまとめた – BTT's blog](http://btt.hatenablog.com/entry/2012/08/20/190737)


## order by fieldを実現するときの問題と解決

### 問題

上記例でちょろっと記述しましたが、order byのクエリを構築するには、「`order_by()`」メソッドを利用します。 
`order_by()`の第一引数が並び替えの基準キー、第二引数は昇順(asc)か降順(desc)のどちらかの指定となります。

なので、下記のように記述すると何となく動きそうな気がします。

```php
DB::select()->from('table')->order_by( 'FIELD( `column`, 3, 1, 2 )' )
```

しかし、実際に組み立てられるSQL文は下記の様になります。

```sql
SELECT * FROM ORDER BY `FIELD( `column`, 3, 1, 2 )`
```

「FIELD( \`column\`, 3, 1, 2 )」を文字列として認識してエスケープしてくれますので、狙った通りの動きをしてくれません。

### 解決

そこで「DB::expr()」を利用すると、エスケープせずにそのまま組み込んでくれますので、下記のように記述することが出来ます。

```php
DB::select()->from('table')->order_by( DB::expr( 'FIELD( `column`, 3, 1, 2 )' ) )
```

組み立てた結果は下記の通りです。

```sql
SELECT * FROM `table` ORDER BY FIELD( `column`, 3, 1, 2 );
```

これでクエリビルダを使ってorder by fieldを利用することが出来ます。


## 注意点

DB::expr()を利用する場合自動的にエスケープしない仕様なので、内容が不明確な変数を差し込んだり、変数型を固めずに利用するとセキュリティホールになりうる可能性がありますので、注意して使う必要があります。


## 参考

- [MySQL :: MySQL 5.1 リファレンスマニュアル (オンラインヘルプ) :: 7.4 文字列関数](http://dev.mysql.com/doc/refman/5.1-olh/ja/string-functions.html#function_field)
- [FuelPHPのクエリビルダを表にまとめた – BTT's blog](http://btt.hatenablog.com/entry/2012/08/20/190737)
- [DB::expr()万能すぎワロタ – Dazing days](http://d.hatena.ne.jp/ts_asano/20121114/1352899282)