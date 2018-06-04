title: "WordPressのコメントをFacebookコメントに変更してみた"
date: 2011-04-26T04:11:03.000Z
updated: 2016-04-03T15:12:06.000Z
tags: 
  - Facebook
  - WordPress
---

最近ちらほらとブログへのコメントがFacebookを介したコメントが利用されているのを見かけたので、自分も殆どFacebookを活用していませんでしたがちょっと使ってみることにしました。

なお、ここに例としてあげているコードにはappidが入力されていませんのでコピペして使わないようにしてください。


## コードの入手

まずはFacebookコメントを表示するためのコードを入手します。

[Comments – Facebook開発者](http://developers.facebook.com/docs/reference/plugins/comments/)で公開されているので、そこで自分の好きなカスタマイズを行うと、以下の様なコードが取得できます。

```html
<div id="fb-root"></div><script src="http://connect.facebook.net/en_US/all.js#appId=##appidが出力されます##&amp;xfbml=1"></script><fb:comments href="##ここに記事のURLを入力##" num_posts="3" width="900" colorscheme="dark"></fb:comments>
```

「URL to comment on」については後ほど変更を行うので見失わないような適当なテキストを入力しておくと良いと思います。  
 上の例で言うと「`##ここに記事のURLを入力##`」という箇所です。


## テンプレートに挿入

コメントの入力欄を表示させたい箇所に上記で取得したコードを挿入します。同じ場所に表示させたい方でTwentyTenを利用の場合は「comments.php」を丸々変更しちゃっても良いかもしれません。  
 （`<div id="comments">`は残したほうが良いかも？）

また、先ほど「URL to comment on」に入力した内容、今回で言うと「`##ここに記事のURLを入力##`」を「`<?php the_permalink(); ?>`
」に書き換えて、以下のようなコードにします。

```php
<div id="fb-root"></div><script src="http://connect.facebook.net/en_US/all.js#appId=##appidが出力されます##&amp;xfbml=1"></script><fb:comments href="<?php the_permalink(); ?>" num_posts="3" width="900" colorscheme="dark"></fb:comments>
```

今回のようにブログだけで終わらせずにFacebook等の別のソーシャルネットワークを活用することで、また別の繋がりへと発展させることが出来そうですね。 
自分ももう少しFacebookを活用するようにすることと、使い方の見直しをしようかと思います。


## 追記　2011/05/07

少し動作に気になる点があることと、別に説明をされている方の投稿と比べると違う点があったので、もう少し修正をしてみました。

### コメント表示部に挿入するタグの修正

コメント表示部分に挿入するタグを一部修正しました。

```php
<div id="fb-root"></div><script src="http://connect.facebook.net/ja_JP/all.js#xfbml=1"></script><fb:comments href="<?php the_permalink(); ?>" num_posts="5" width="900" colorscheme="dark"></fb:comments>
```

変更点は以下のとおりです。

- 何故か言語が英語「`en_US`」になっていたので、「`ja_JP`」に変更
- 記事を書いた後では「`appid`」の項目が出なくなったので削除
- 5件出したくなったので、「`num_posts`」の値を5に変更（私情）

また[開発者ブログのこのエントリー（英語）](http://developers.facebook.com/blog/post/472)を確認したところ以下のタグを埋め込んでおくとよさそう（英語が読めないので怪しい）だったので、headタグ内に埋め込んでみました。

```html
<meta property="fb:app_id" content="{YOUR_APPLICATION_ID}" />
<meta property="fb:admins" content="{YOUR_USER_ID}" />
```

[アプリケーションIDについてはこちらのページから確認](http://www.facebook.com/developers/apps.php)、[自分のユーザIDについてはこちらのアプリケーションを使うことで確認](http://www.ideaxidea.com/archives/2011/05/facebook_user_id.html)することが出来ました。

Facebookにログインした状態で見てみるとモデレータも見れるようになったので、少し改善されたのではないかと思います。

またちょっと様子を見ることにします。
