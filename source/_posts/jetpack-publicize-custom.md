title: "Jetpack for WordPressのパブリサイズ共有を色々カスタマイズしてみた"
date: 2014-10-17T22:16:43.000Z
updated: 2016-04-03T10:52:41.000Z
tags: 
  - JetPack
  - PHP
  - WordPress
---

様々な追加機能を用意してくれる[Jetpack for WordPress](http://jetpack.me/)ですが、その中のTwitterやFacebook等のSNSに投稿時に自動的に共有をしてくれるパブリサイズ共有で色々とカスタマイズしたい所があったので、調べたことのメモを残しておきます。


## Jetpack

インストール方法や設定方法は、丁寧に説明されているページがありますので割愛させていただきます。

### パブリサイズ共有

ソースを追ってみたところ、デフォルトでは「title url」で共有され、投稿内容と共有するサービスをwordpress.comに送信してそこから発信しているようなので、各サービス毎に内容を変更する、と言ったことは難しそうです。

ちなみに今回調べてみた内容は下記の通り。

- [カスタム投稿タイプでも適用させる](#h-custom-post)
- [共有する文言を変更する](#h-default-message)
- [強制的に文言を変更する](#h-force-change)
- [共有するURLを変更する](#h-change-url)
- [雑感](#other)


## <a name="h-custom-post">カスタム投稿タイプでも適用させる</a>

単純にインストール→有効化しただけでは、通常の「投稿」だけしかパブリサイズ共有は行えません。

管理画面上でも追加する欄はありませんので、functions.phpに追記する必要があります。

```php
/** カスタム投稿タイプにもパブリサイズ共有を対応 */
function add_jetpack_custom_post_publicize()
{
    add_post_type_support( 'report', 'publicize' );
    add_post_type_support( 'topics', 'publicize' );
}
add_action( 'init', 'add_jetpack_custom_post_publicize' );
```

### 参考

- [【Jetpack】カスタム投稿タイプにもパブリサイズ共有を適応させる方法](http://o3-web.com/jetpack-customize-publicize/)


## <a name="h-default-message">共有する文言を変更する</a>

前述のとおりカスタムメッセージを入力しなかった場合は「title url」で共有されますが、「ブログを更新：title url」とかにしたい、という時もあるかと思います。

その場合は、メッセージ全体の`wpas_default_message`、接頭語`wpas_default_prefix`、接尾語`wpas_default_suffix`、それぞれをフィルタリングするフックが用意されています。

しかし、このフックが処理されるのが`__construct`内なので、functions.phpに記載しても適用されません。  
 何か方法は無いかと調べていると、必須プラグインディレクトリに作ってしまえば通常のプラグインより実行されるので、ココで`add_filter`をすることで何とかなりました。

「wp-content/mu-plugins/」ディレクトリを作成し、下記のPHPを格納すると、「ブログ更新：『title』ぜひ見てね」という文言に変わります、が、パブリサイズ共有の「編集」を押した時に「カスタムメッセージ」に自動的に入る文言しか変わりませんでした。ぐぬぬ…。

```php
<?php
/**
 * JetPackFilters
 * JetPack向けフィルター
 *
 * @package WordPress
 */

class JetPackFilters
{
    public function __construct()
    {
        add_filter( 'wpas_default_message', array( $this, 'wpas_custom_message' ), 10, 1 );
        add_filter( 'wpas_default_prefix',  array( $this, 'wpas_custom_prefix'  ), 10, 1 );
        add_filter( 'wpas_default_suffix',  array( $this, 'wpas_custom_suffix'  ), 10, 1 );
    }

    /**
     * messageの変更
     *
     * @param  string $message
     * @return string
     */
    function wpas_custom_message( $message ) {
        return '『'.$message.'』';
    }

    /**
     * prefixの変更
     *
     * @param  string $prefix
     * @return string
     */
    function wpas_custom_prefix( $prefix ) {
        return 'ブログ更新：';
    }

    /**
     * suffixの変更
     *
     * @param  string $suffix
     * @return string
     */
    function wpas_custom_suffix( $suffix ) {
        return 'ぜひ見てね';
    }
}

new JetPackFilters();
```

### 参考

- [WordPress で１番最初に実行したい処理は must use plugins を使用 | セルティスラボ](http://celtislab.net/archives/20140609/wordpress-must-use-plugins/)
- [初期化に関連するアクションのおさらい:WordPress私的マニュアル](http://elearn.jp/wpman/column/c20120807_01.html)
- [Create a 'Must Use' Plugin for WordPress – Greg Rickaby](http://gregrickaby.com/create-mu-plugin-for-wordpress/)


## <a name="h-force-change">強制的に文言を変更する</a>

### 注意

どのタイミングかわからないのですが、仕様が変更になったようで、以前に公開していたコードでは文言の変更が出来ない状態になっていました。（2015年9月10日時点）

現状の下記コードでは修正を行っていますので、強制的に変更が出来るようになっているはずです。

具体的には、下記のような変更がなされていました。

```php
if ( ( $from_web || defined( 'POST_BY_EMAIL' ) ) && !empty( $_POST['wpas_title'] ) )
	update_post_meta( $post_id, $this->POST_MESS, trim( stripslashes( $_POST['wpas_title'] ) ) );
```

前までは上のように、登録だけするはずだったのですが、

```php
if ( ( $from_web || defined( 'POST_BY_EMAIL' ) ) && isset( $_POST['wpas_title'] ) ) {
	if ( empty( $_POST['wpas_title'] ) ) {
		delete_post_meta( $post_id, $this->POST_MESS );
	} else {
		update_post_meta( $post_id, $this->POST_MESS, trim( stripslashes( $_POST['wpas_title'] ) ) );
	}
}
```

という感じに、`$_POST['wpas_title']`が空だった場合は、`post_meta`を削除する処理が追加されていました。

前述の方法だと「編集」を押さないと反映されないので、うっかり忘れてしまうコトを考慮するとやはり自動的に変更できた方が良いかと思います。

処理を追ってみると「`_wpas_mess`」というカスタムフィールドに入力しておくと、カスタムメッセージを入力した状態と同様になるようなので、公開時の処理にフックすることで対応できますので、強制的にカスタムメッセージを入力させたことにして対応してみました。

[既に同様のコトを考えていらっしゃる方](http://blog.makotokw.com/2013/07/25/wordpress-jetpack%E3%81%AE%E3%83%91%E3%83%96%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%BA%E5%85%B1%E6%9C%89%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%AD%E5%AE%9A/)もいらっしゃいましたが、記事内に記載の通り、

> `publicize_save_meta`は共有しているサービスxアカウントの数だけ呼ばれるので若干無駄な気もした

という処理だったので、ちょっと強引ですが、JetPackの`save_post`より優先度の高い位置で処理をする方法を取ってみました。

```php
/** パブリサイズ共有の文言を変更 */
function change_jetpack_publicize_content( $post_id, $post )
{
    $POST_MESS = '_wpas_mess';

    /** 投稿,下書き,スケジュール待ちのみ */
    if ( !in_array( $post->post_status, array( 'publish', 'future' ) ) ) {
        return;
    }

    /** カスタムメッセージのPOSTがあったら無視 */
    if ( !empty( $_POST['wpas_title'] ) ) {
        return;
    }

    /** カスタムメッセージがある場合は無視 */
    if( get_post_meta( $post_id, $POST_MESS, TRUE ) ) {
        return;
    }

    /** 共有する文言の成形 */
    $publicize_custom_message = sprintf( 'ブログ投稿：『%s』ぜひ見てね %s', $post->post_title, wp_get_shortlink( $post->ID ) );
    
    /** カスタムメッセージとして登録 */
    update_post_meta( $post_id, $POST_MESS, $publicize_custom_message );
    
    /** postmetaが削除されないように$_POSTにも代入 */
    $_POST['wpas_title'] = $publicize_custom_message;
}
/** JetPackのパブリサイズ共有のsave_postに対する処理の優先度は「20」 */
add_action( 'save_post', 'change_jetpack_publicize_content', 19, 2 );
```

ちなみにこの時点では$postが取得できるので、投稿タイプやカテゴリーによって内容を変えたりすることも可能です。


## <a name="h-change-url">共有するURLを変更する</a>

あまり需要は無いと思いますが、共有するURLを変更すること出来なくはありません。  
 例えば邪道な方法ですが、WordPressを管理画面としてだけ利用し、詳細ページはWPの外から投稿内容だけ読み取っている、といった場合はパーマリンクのURLとは別のアドレスになると思います。

というよりも、結論から申すとパーマリンクの向き先を該当のURLに切り替える事で共有するURLも切り替わります。

まずはパーマリンクのURLを変更する場合は、`post_type_link`にフィルタリングします。

```php
function change_post_type_link( $link, $post )
{
    // 投稿だけ変更
    if ( 'post' === $post->post_type ) {
    	/* $linkを変更する処理 */
    }
    return esc_url( $link );
}
add_filter( 'post_type_link', array( $this, 'change_post_type_link' ), 1, 2 );
```

また、投稿内容に利用されるURLはショートリンク（http://example.net/?p=***）なので、そちらも変更します。

```php
function change_short_link( $dummy, $post_id, $context )
{
    if ( 'post' == $context ) {
        $post = get_post( $post_id );
        // 投稿だけ変更
        if( $post->post_type === 'post' ) {
            /* $urlを変更する処理 */
            return esc_url( $url );
        }
    }
    return FALSE;
}
add_filter( 'pre_get_shortlink', 'change_short_link', 10, 3 );
```

`the_permalink`で指定のURLにリンクするようにもなるので、一石二鳥じゃないでしょうか？


## <a name="other">雑感</a>

流石AutomatticのプラグインだけあってWordPressの機能をコレでもかという位使ってあって追うのが大変、ですがフィルターやフックもいたるところに用意されていてかなり親切な作りです。

パブリサイズ共有だけでなく、他の処理でもちょっとココだけ何とかしたい…！といったことも意外と何とかなるかもしれません。