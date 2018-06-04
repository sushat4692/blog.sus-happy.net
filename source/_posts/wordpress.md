---
title: "WordPressのプラグインを使わずにカスタマイズする小技"
date: 2010-10-28T02:11:07.000Z
updated: 2016-04-03T15:36:16.000Z
tags: 
  - PHP
  - WordPress
---

WordPressを使ったサイトを作る際に、プラグインを使うほどでもない処理をちょこちょこ行なったので、後から見直せるように残しておきます。

WordPressはプログラムコードがテーマファイルに直接かけるのが好きなんですが、怖い所でも便利な所でもある気がしました。


## 記事の抜粋を表示したい

タイトルと、少し記事の内容を見せたい時に、記事本文内のテキストを丸めこんで表示したい時に使えます。

```php
<?php the_excerpt(); ?>
```

記事内の抜粋が入力されているのであれば抜粋を、入力されていないのであれば本文を丸めこんだテキストを表示します。


## カテゴリーを列挙したい

ウィジェットで用意されてはいますが、テーマファイルの中で記述したい時には、以下の様にget_terms()を利用する事で実現可能です。

```php
<ul>
<?php $cat_all = get_terms( "category", "fields=all&get=all" );
if( $cat_all ) :
	foreach($cat_all as $c): ?>
	<li><?php echo $c->name; ?></li>
<?php endforeach;
endif; ?>
</ul>
```


## 登録されているユーザを一覧表示させたい

個人でブログを書いてる方には使い道が無いかもしれませんが、ブログに登録されているユーザの一覧を表示させたい場合には、get_users_of_blog()を用いて実現する事が可能です。

```php
<ul>
<?php $users = get_users_of_blog();
if( $users ) :
	foreach( $users as $u ) : ?>
	<li><?php echo $u->nickname ?></li>
<?php endforeach;
endif; ?>
</ul>
```


## ユーザプロフィールの入力内容をカスタマイズしたい

プラグインを入れることで事足りるかもしれませんが、functions.phpに記述を加えることで、ユーザプロフィールの内容を変更させる事が可能です。

中々AIM、Yahoo IM、Jabber / Google Talk等は入力しない可能性が高いため、表示させたくない場合には以下の様な記述が必要です。

```php
function update_profile_fields( $contactmethods ) {
	unset($contactmethods['aim']);
	unset($contactmethods['jabber']);
	unset($contactmethods['yim']);
	unset($contactmethods['url']);

	return $contactmethods;
}
add_filter('user_contactmethods','update_profile_fields',10,1);
```

また入力エリアを追加させる方法もありますが、  
[WordPressのユーザーページ(author.php)テンプレートをカスタマイズする | webOpixel](http://www.webopixel.net/wordpress/136.html)  
 で丁寧にまとめられていますので、こちらをご確認ください。