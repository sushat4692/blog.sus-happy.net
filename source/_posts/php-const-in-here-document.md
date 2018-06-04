title: "PHPのヒアドキュメント内で定数を利用してみた"
date: 2011-05-24T22:28:04.000Z
updated: 2016-04-03T15:03:05.000Z
tags: 
  - PHP
---


PHPで定数を設定し、その内容を表示する際に、ヒアドキュメント内ではどうしたら良いのか分からなかったので調べてみました。


## ヒアドキュメントとは

そもそもヒアドキュメントとは、プラグラム中に長文を表示させたい時に、開始と終了を指定し、その間を文字列とみなす構文です。

```php
echo <<< EOF
この間は文字列とみなされます。 改行を入れても問題ありません。
EOF;
```

## 実践

それでは実装方法ですが、[PHPの公式リファレンスの「define」の項](http://www.php.net/manual/ja/function.define.php)のフォーラム内に載っていました。

```php
<?php
define('MY_CONSTANT','foo bar');
$cst = 'cst';
function cst($constant){
    return $constant;
}

$string = <<<EOF
My constante MY_CONSTANT : {$cst(MY_CONSTANT)} ...
EOF;
echo $string;
```

上記のように、関数名を変数に代入し、ヒアドキュメント内で「{}」で実行することで、MY_CONSTANTに設定した「foo bar」がヒアドキュメント内でも表示されます。

そこまで需要があるとは思いませんが、急に必要になりそうなのでメモしておきました。

## 追記 2014/09/24

サンプルコードに間違いがありましたので修正しました。
