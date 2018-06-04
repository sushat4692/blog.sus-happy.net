title: "PHPのPDOでLIMIT句でエラーが発生した時の対処"
date: 2012-07-28T17:45:20.000Z
updated: 2016-04-03T14:08:23.000Z
tags: 
  - MySQL
  - PHP
---

[PHPのPDO](http://php.net/manual/ja/book.pdo.php)を使ってMySQLにアクセスしている時に、LIMIT句でエラーが発生してしまったので、その解決方法を残しておきます。


## PDOとは

PHPでデータベースを扱う際に、mysql_queryでクエリ文を受け渡していると、セキュリティの関係上行わないといけないエスケープ等が面倒です。

そこで、PHP5より実装されたPDOを使うことで、プリペアドステートメントによってデータベースに安全且つ簡単にアクセスすることが出来ます。

その他、PEARで提供されている[PEAR MDB2](http://pear.php.net/manual/ja/package.database.mdb2.php)でもプレペアドステートメントを用いることが出来ます。


## PDOによるプリペアドステートメント

PDOを用いたプレペアドステートメントについては下記の通り記述します。

```php
// $dbh = new PDO();

// 疑問符を用いた例
$query = 'SELECT * FROM `table` WHERE `id` < ? AND `title` = ?';
$sth = $dbh->prepare( $query );
$sth->bindParam( 1, $id );
$sth->bindParam( 2, $title );
$sth->execute();

// 名前付きパラメータを用いた例
$query = 'SELECT * FROM `table` WHERE `id` < :id AND `title` = :title';
$sth = $dbh->prepare($query);
$sth->bindParam( ':id', $id );
$sth->bindParam( ':title', $title );
$sth->execute();
```

それぞれ最終的に構築されるSQL分は同じモノが出来上がります。


## LIMIT句でのエラーとその対処

上記の例の通り記述すると、LIMIT句でエラーが発生してしまいます。  
 例えば下記の例では正常に動作しません。

```php
// エラーが発生する例
// $dbh = new PDO();
$limit = 10;
$query = 'SELECT * FROM `table` LIMIT ?';
$sth = $dbh->prepare( $query );
$sth->bindParam( 1, $limit );
$sth->execute();
```

原因としては、LIMIT句に渡す値が文字列として扱われ、最終的に下記のクエリ文となってしまうためです。

```sql
SELECT * FROM `table` LIMIT '10'
```

LIMIT句には数値を渡す必要があるため、bindParamでPDO::PARAM_***という定義済み変数を用いて形式を指定することで解消することが出来ます。

```php
// 正常に動作する例
// $dbh = new PDO();
$limit = 10;
$query = 'SELECT * FROM `table` LIMIT ?';
$sth = $dbh->prepare( $query );
$sth->bindParam( 1, $limit, PDO::PARAM_INT );
$sth->execute();
```

今回の様な例に限らず、上手く実行できないからここだけはプリペアドステートメントを使わない、という様な状態は避けていきたいですね。


## 参考

- [PDO MYSQLの組み合わせでLIMITを使う場合の注意点 » とりあえず9JP](http://9jp.info/archives/89)