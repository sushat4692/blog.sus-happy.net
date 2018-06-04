title: "spl_autoload_registerを試してみる"
date: 2014-03-04T00:49:10.000Z
updated: 2016-04-03T11:07:58.000Z
tags: 
  - PHP
---

requireをダラダラと書くのが嫌になってきたので、spl_autoload_registerについて調べてみました。


## __autoloadは？

__autoloadを使えば同様にrequireを記述せずとも宣言されていないクラスが呼ばれた時に特定の処理を実行させることが出来るのですが、**メソッドを一つしか登録出来ない**、という制約が存在します。

コレにより、二回宣言してしまって上手く動かない、みたいな事になる危険性があります。


## spl_autoload_registerは？

そこで登場したのが、「spl_autoload_register」。__autoloadを呼び出すための関数をスタックしてくれます。

複数関数を追加しても全て実行してくれるので安心です。場合によっては何度も実行される可能性もあるので、なるべく少なくした方が良いのでしょうが。


## 実装例

例えば下記のようなクラスを読み込むクラスを用意しておくと、「Hoge_controller」を呼び出した時に自動的に「path/to/controller/Hoge.class.php」を読み込んだり、「Fuga_model」を呼び出した時に「path/to/model/Fuga.class.php」を読んだりすることが出来ます。

```php
<?php

// abstract class Object { /* ... */ }

class Loader extends Object {

    /**
     * Class_action という命名規則と仮定
     * action -> model, controller それ以外は汎用クラスと解釈
     * ex) Post_controller, Category_model
     */
    public static function load_class( $class ) {
        if( preg_match( '/(.*)_(.*)$/', $class, $matches ) ) {
            $class_name  = $matches[1];
            $action_name = $matches[2];

            switch( $action_name ) {
                case 'model':
                    self::get_model( $class_name );
                    break;
                case 'controller':
                    self::get_controller( $class_name );
                    break;
                default:
                    self::get_class( $class );
                    break;
            }
        } else {
            self::get_class( $class );
        }
    }

    public static function get_model( $class_name ) {
        // Model Classをrequireする処理をゴニョゴニョする
    }
    public static function get_controller( $class_name ) {
        // Controller Classをrequireする処理をゴニョゴニョする
    }
    public static function get_class( $class ) {
        // 汎用Classをrequireする処理をゴニョゴニョする
    }

}

spl_autoload_register( array( 'Loader', 'load_class' ) );
```


## 注意点

- 利用できるのは**5.1.2**からです。「__autoload」であればPHP5から利用できます。
- 具体的なバージョンを検証できていませんが、**5.1系ではstaticメソッドを実行しただけでは呼ばれない気がします**  
 （new Class()じゃないと呼ばれない？）
- **spl_autoload_registerを登録すると「__autoload」が呼ばれなくなる**

### __autoloadが呼ばれなくなる件の対策

__autoload自体をspl_autoload_registerに登録しておけば良いそうです。

```php
spl_autoload_register( '__autoload' );
```


## Composer

PHP5.3.2以上からはComposerという、上記の様な自作クラスは必要なくautoloadを補助してくれるライブラリを利用することが出来るみたいです。

ComposerだとJsonファイルで設定をするみたいですね。また使ってみたいと思います。  
 参考サイトにComposerを紹介しているページも載せましたので詳しくはそちらをご確認下さい。


## 参考

- [PHP で、spl_autoload_register を使って、require_once 地獄を脱出しよう – Qiita](http://qiita.com/misogi@github/items/8d02f2eac9a91b4e6215)
- [PHPのオートロード | kudox.jp](http://kudox.jp/php/autoload)
- [composerでPHPのプロジェクトを簡単に始める – ぷぎがぽぎ](http://d.hatena.ne.jp/brtRiver/20120610/1339350390)
- [PHPの外部ライブラリの管理にComposerを使う](http://www.ryuzee.com/contents/blog/5681)