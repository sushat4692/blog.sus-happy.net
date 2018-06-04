title: "カスタム投稿タイプに独自の権限を与えてみた"
date: 2011-05-18T23:59:04.000Z
updated: 2016-04-03T15:04:22.000Z
tags: 
  - PHP
  - WordPress
  - カスタム投稿タイプ
---

少し特殊な利用方法となりますが、カスタム投稿タイプで追加した項目の追加・編集・削除権限を持つ独自の権限グループを作る方法について、残しておきます。


## 実装内容

カスタム投稿タイプの追加については「`register_post_type`」、権限グループの追加については「`add_role`」、また、そのグループに対して独自のルールを持たせるのが「`add_cap`」となります。

最終的に以下の内容をfunctions.phpに入力することで、「`ptname`」というidのカスタム投稿タイプの追加・編集・削除の権限を持つ「`authid`」というidの権限グループを追加できます。

```php
<?php
function my_custom_post_type() {
	register_post_type(
		'ptname',
		array(
			'label' => 'カスタム投稿タイプ名',
			'public' => true,
			'capability_type' => 'ptauth',
			'has_archive' => true,
			'menu_position' => 5,
			'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields' ,'comments' )
		)
	);
	$rm = new WP_Roles();
	$rm->add_role("authid", "権限名" );
	foreach( array( "authid",  "administrator" ) as $rid ) {
		$role = $rm->get_role($rid);
		$role->add_cap("read");
		$role->add_cap("add_ptauth");
		$role->add_cap("add_ptauths");
		$role->add_cap("edit_ptauth");
		$role->add_cap("edit_ptauths");
		$role->add_cap("delete_ptauth");
		$role->add_cap("delete_ptauths");
		$role->add_cap("publish_ptauths");
	}
	$role->add_cap("delete_others_ptauths");
	$role->add_cap("edit_others_ptauths");
}
add_action( 'init', 'my_custom_post_type', 0 );
```

各関数の説明に関しては、以下のリンクを見ていただくと分かりやすいかと思います。


## register_post_type

- [関数リファレンス/register post type – WordPress Codex 日本語版](http://wpdocs.sourceforge.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/register_post_type)
- [WordPress3.0のカスタム投稿タイプを、実案件を想定して実践してみる | カテゴリー: WordPress | 作業メモ](http://vinypara.s236.xrea.com/archives/79)


## WP_Roles

- [独自の Role を定義する](http://www.miyoshitakayuki.com/archives/243)
- [権限グループの権限を変更する | WordPress の部屋](http://komodo.arrow.jp/wp-cms/cms/%E6%A8%A9%E9%99%90%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E3%81%AE%E6%A8%A9%E9%99%90%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B/)