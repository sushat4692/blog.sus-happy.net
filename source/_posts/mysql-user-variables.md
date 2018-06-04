title: "MySQLのユーザ定義変数を使って色々やってみた"
date: 2012-03-09T00:11:55.000Z
updated: 2016-04-03T14:37:44.000Z
tags: 
  - MySQL
---

MySQLのクエリを組み立てている時に、やりたかった事を実現するために、ユーザ定義変数を利用したので、また使うときに忘れていても良いようにメモしておきます。


## ユーザ定義変数の記述方法

ユーザ定義変数の記述方法は、こんな感じ。

```sql
SET @foo:="bar";
# SETの時は @foo="bar"; でもOK
```

一度定義しておくと、その接続の間利用することが出来ます。

```sql
SELECT * FROM `hoge` WHERE `fuga` = @foo;
```


## ユーザ定義変数を使って行番号を追加する

簡単な例として、変数を使って行番号のカラムを追加してみます。

```sql
SET @row:=0;
SELECT
  *,
  ( @row:=@row+1 ) AS `row`
FROM
  `hoge`
WHERE
  `foo` = 'bar';
```

ただ、この書き方だと、クエリが2つになってしまうのが少し気になりますね。


## SELECT文内でユーザ定義変数を定義する

やはりクエリを1つにしたかったので、調べてみたところ[こんな方法](http://m97087yh.seesaa.net/article/109049904.html)がありました。

上記の例で参考サイトの方法を利用すると、こんな感じ。

```sql
SELECT
  *,
  ( @row:=@row+1 ) AS `row`
FROM
  ( SELECT @row:=0 ) AS `dummy`,
  `hoge`
WHERE
  `foo` = 'bar';
```

これなら一回の呼び出しで行けるのでスッキリしますね。  
 ただし、参考サイトにも書かれているように、ユーザ定義変数をorder byする場合に意図した結果にならない可能性があるので注意してください。


## やりたかったこと

最後に応用例として、自分がやりたかった事をメモしておきます。

<table><thead><tr><th>カラム名</th><th>データ型</th><th>備考</th></tr></thead><tbody><tr><td>entry_id</td><td>int</td><td>auto_increment</td></tr><tr><td>date</td><td>datetime</td><td></td></tr><tr><td>flag</td><td>tinyint</td><td>0 or 1</td></tr><tr><td colspan="3">その他色々</td></tr></tbody></table>こんな感じのテーブルがあった時に、下記条件で引っ張り出そうとしました。

- 日付降順
- 5件取得
- flagが0
- flagが1の場合、最新のモノから3件分は除外

上3つは問題ありませんが、最後の一つを実現するためにユーザ定義変数を使っています。  
 実装したクエリ文はこんな感じ。

```sql
SELECT
  *
FROM
  `entry` AS `a`
    INNER JOIN (
      SELECT
        `entry_id`,
        CASE `flag`
          WHEN 1 THEN @flag_num:=@flag_num+1
          ELSE -1
        END `flag_num`
      FROM
        ( SELECT @flag_num:=0 ) AS `dummy`,
        `entry`
      ORDER BY
        `date` DESC
    ) AS `unite` USING( `entry_id` )
WHERE
  `flag_num` > 3 AND `flag_num` < 0
ORDER BY
  `date` DESC
LIMIT
  0,5
```

サブクエリ上でflagが0の時は-1、flagが1の時は該当した行数のカラムを追加し、Where句で判別しています。

このくらいだったら単純に8件取得して、PHP側で取捨選択してもよかったかもしれませんね…。


## 参考サイト

- [MySQLで行番号: Ma note](http://m97087yh.seesaa.net/article/109049904.html)