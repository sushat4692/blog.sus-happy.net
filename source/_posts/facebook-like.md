---
title: "記事毎にFacebookのLikeボタンを追加する方法"
date: 2010-08-24T02:22:29.000Z
updated: 2016-04-03T15:44:54.000Z
tags: 
  - Facebook
  - WordPress
---


Twitterのボタンを追加していましたが、世界的なソーシャルネットワークであるFacebookのボタンも追加していみました。

ちょっと導入まで手間取ったので、メモを残しておきます。


## プラグインとして設置

こちらの[プラグインの設置方法を紹介しているページ](http://www.lastday.jp/2010/05/11/how-to-set-up-facebook-like-button-into-wordpress)にあるように、プラグインとしてLikeボタンを追加することができるようなのですが、AppIDの発行時にエラーが発生してしまったので他の方法を探すことにしてみました。


## テンプレートを直接編集して設置

今回はプラグインではなく、直接テンプレートを編集して行うこちらの方法で実装しました。

参考にさせていただいたのは、こちらの[Likeボタンの設置方法について書かれたページ](http://blog.verygoodtown.com/2010/05/facebook-like-button-wordpress/)です。

実際に挿入したコードは、

```php
<iframe src="http://www.facebook.com/plugins/like.php?href=<?php echo urlencode(get_permalink($post->ID)); ?>&amp;layout=standard&amp;show_faces=false&amp;width=450&amp;action=like&amp;font=verdana&amp;colorscheme=light&amp;height=25" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:25px;" allowTransparency="true"></iframe>
```

上記のように、表示させたい箇所に挿入しました。