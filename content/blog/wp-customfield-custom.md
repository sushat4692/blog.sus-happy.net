---
title: "WordPressのカスタムフィールドをカスタムしてみた"
date: 2014-11-15T16:38:47.000Z
updated: 2016-04-03T10:43:18.000Z
tags:
  - PHP
  - WordPress
---

WordPressをブログではなくもう少し大掛かりなCMSとして利用する際には、どうしても必要になってくるカスタムフィールドですが、ただのinput, textarea, selectでは<del datetime="2014-11-15T02:22:31+00:00">面白くないので</del>使い勝手が悪いので、色々とカスタマイズした内容を残しておきます。


## 目次

今回カスタマイズしてみた内容は下記の通りです。

- [プラグイン無しでカスタムフィールドの入力欄を追加する](#add-customfield)
- [通常の本文と同じTinyMCEを使う](#tinymce)
- [メディアアップロードボタンを使う](#media)
- [雑感](#other)
- [参考](#reference)


## <a name="add-customfield">プラグイン無しでカスタムフィールドの入力欄を追加する</a>

まずはカスタムフィールドの入力欄の追加方法からです。

カスタムフィールドの管理を行うプラグインは様々ありますが、管理側の使い勝手を向上させるためにどうしても入力欄は一定のレイアウトで、もうちょっと違う表示をさせたいんだけどな…という所が出てきてしまいます。

なので、そんな時にはプラグイン無しで入力欄を追加してしまいます。

```php
<?php

function _add_custom_field()
{
    // 入力パネルのキー, パネル表示タイトル, コールバック関数名, 投稿タイプ名, 表示位置, 優先度, コールバック関数に渡す変数
    add_meta_box( 'field-name', 'フィールド名', '_add_meta_box', 'post', 'advanced', 'default', NULL );
}
add_action( 'add_meta_boxes', '_add_custom_field' );

function _add_meta_box( $post )
{
    $value = get_post_meta( $post->ID, 'field', TRUE );
    echo '<input type="text" name="field" value="'.esc_attr( $value ).'">';
}

?>
```

add_meta_boxに渡す引数の詳細は[公式リファレンスを参照ください](https://developer.wordpress.org/reference/functions/add_meta_box/)。

また、追加したカスタムフィールドは保存しないといけませんので、保存する処理を追記します。

```php
<?php

function _save_custom_field( $post_id )
{
    // 投稿ID, カスタムフィールド名, 値
    update_post_meta( $post_id, 'field', $_POST&#91; 'field' &#93; );

    return $post_id;
}
add_action( 'save_post', '_save_custom_field' );

?>
```

これで保存はされますが、何でもかんでも保存してしまうとマズイので、WPのnonceを使って投稿元のチェックをします。
 先ほどの追加の処理も少し書き換えて…。

```php
<?php

function _add_custom_field()
{
    // 入力パネルのキー, パネル表示タイトル, コールバック関数名, 投稿タイプ名, 表示位置, 優先度, コールバック関数に渡す変数
    add_meta_box( 'field-name', 'フィールド名', '_add_meta_box', 'post', 'advanced', 'default', NULL );
}
add_action( 'add_meta_boxes', '_add_custom_field' );

function _add_meta_box( $post )
{
    $value = get_post_meta( $post->ID, 'field', TRUE );
    echo '<input type="text" name="field" value="'.esc_attr( $value ).'">';

    wp_nonce_field( 'custom_key', 'custom_nonce' );
}

function _save_custom_field( $post_id )
{
        // ワンタイムチケットと権限の確認
        if ( ! isset( $_POST[ 'custom_nonce' ] )
          || ! check_admin_referer( 'custom_key', 'custom_nonce' )
          || ! current_user_can( 'edit_post', $post_id ) ) {
            return $post_id;
        }

    // 投稿ID, カスタムフィールド名, 値
    update_post_meta( $post_id, 'field', $_POST[ 'field' ] );

    return $post_id;
}
add_action( 'save_post', '_save_custom_field' );

?>
```

_add_meta_boxに[wp_nonce_field](https://developer.wordpress.org/reference/functions/wp_nonce_field/)を追加し、_save_custom_fieldで[check_admin_referer](https://developer.wordpress.org/reference/functions/check_admin_referer/)を使って検証しています。
 これで、安心、のはず。

さて、カスタムフィールドの追加方法は分かったので、ここから入力欄をカスタマイズしていきます。


## <a name="tinymce">通常の本文と同じTinyMCEを使う</a>

カスタムフィールドにもWYSIWYGを使いたい事があるので、いっその事用意されている通常の本文と同じ機能を持ってきたいと思います。

リファレンスをあさっていると、**wp_editor**という素敵な関数がありましたので、そちらを利用します。
<small>_WP_Editors::editorを先に見つけて、あとでwp_editorの存在に気づいたなんて気のせいです。</small>

```php
<?php

// カスタムフィールドを追加する処理を色々

function _add_meta_box( $post )
{
    $value = get_post_meta( $post->ID, 'field', TRUE );
    // 初期値, フィールド名, 設定情報
    wp_editor( $value, 'field' );

    wp_nonce_field( 'custom_key', 'custom_nonce' );
}

?>
```

**wp_editor**を呼ぶだけで本文同様のTinyMCEを引っ張ってくることが出来ます。便利！
 また、第三引数に配列で値を渡すことでエディターの設定をいじることも出来るようです。（コチラは試していません）

設定できるパラメータは[コチラに記載されていました](http://codex.wordpress.org/Function_Reference/wp_editor)。


## <a name="media">メディアアップロードボタンを使う</a>

続いて、WYSIWYGを配置するまでもないけど、画像を選択させたい、という入力欄も時にはあると思います。
 アイキャッチ画像の設定みたいな感じですね。

そんな時に、WPのメディアアップロード画面を再利用できたら、と思って調べていたら[詳しく説明しているページを見つけました](http://www.sitepoint.com/adding-a-media-button-to-the-content-editor/)ので読んでいくと、**wp.media**というメソッドが用意されているようですね。

ということで、自分用に画像をアップロードするカスタムフィールド用のJSを作ってみました。
 ちょっと長いので、[コチラはGistにアップしました](https://gist.github.com/sushat4692/33df8a65474798fca0c6)。


## <a name="other">雑感</a>

カスタムフィールドをカスタマイズするためのフックやフィルターも結構揃ってますので、頑張れば管理画面もかなり自由に操作できることがわかってきました。

また、完全にオリジナルではなく、良いものは使いまわすことが出来るので、そのあたりも嬉しいですね。

TinyMCE回りのフックやフィルターも結構揃っているようなので、またそのあたりも触っていけると良いなぁ何て思っていたりしますが、もし手を出した時には残すようにします。


## <a name="reference">参考</a>

- [WordPress › add_meta_box() | Function | WordPress Developer Resources](https://developer.wordpress.org/reference/functions/add_meta_box/)
- [WordPress › wp_nonce_field() | Function | WordPress Developer Resources](https://developer.wordpress.org/reference/functions/wp_nonce_field/)
- [WordPress › check_admin_referer() | Function | WordPress Developer Resources](https://developer.wordpress.org/reference/functions/check_admin_referer/)
- [Function Reference/wp editor « WordPress Codex](http://codex.wordpress.org/Function_Reference/wp_editor)
- [Adding a Media Button to the WordPress Content Editor](http://www.sitepoint.com/adding-a-media-button-to-the-content-editor/)