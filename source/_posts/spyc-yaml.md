title: "spycを使ってYAMLを利用してみた"
date: 2011-04-02T18:26:20.000Z
updated: 2016-04-03T15:17:05.000Z
tags: 
  - PHP
  - YAML
---

XMLやJSON等のデータ形式の一つにYAMLと呼ばれるものがあるのですが、YAML形式のデータをPHPで扱う事の出来るspycというライブラリがあるようなので、少し試してみました。


## YAMLの構造

まずは簡単にYAMLの記入方法について。簡単なサンプルを作ってみました。

```yaml
## テスト
- foo
- bar
- hoge
  - fuga

## 社員
employees:
  - id: 1
    name: 田中
    mail: tanaka@example.com
  - id: 2
    name: 佐藤
    mail: sato@example.com
```

実行結果は以下の通りです。

```php
Array
(
    [0] => foo
    [1] => bar
    [2] => Array
        (
            [0] => fuga
        )
    [employees] => Array
        (
            [0] => Array
                (
                    [id] => 1
                    [name] => 田中
                    [mail] => tanaka@example.com
                )
            [1] => Array
                (
                    [id] => 2
                    [name] => 佐藤
                    [mail] => sato@example.com
                )
        )
)
```

簡単に説明すると、基本的には行頭に「-」をつけ並べることで配列となり、「id: 1」の様に記入する事で、idをkey、1をvalueの連想配列と認識されます。

他にもポインタやエイリアス等の機能もあります。詳細は[プログラマーのための YAML 入門 (初級編)](http://jp.rubyist.net/magazine/?0009-YAML#l10)をご覧ください。


## spycの入手

まずは[こちらのサイト](http://code.google.com/p/spyc/)からspycを入手します。

後は下記の様にPHPでinclude、もしくはrequireで読み込むだけです。

```php
<?php include( "spyc.php" );

$ydata = Spyc::YAMLLoad('yamlfile.yaml');
print_r($ydata);
```

iniファイル等で読み込みもしてみたこともありますが、YAML形式の読み込みの方が便利そうです。ちょっとまた色々実験してみます。