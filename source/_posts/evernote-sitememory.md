title: "EvernoteのSiteMemoryを設置してみた"
date: 2010-09-10T03:12:29.000Z
updated: 2016-04-03T15:40:57.000Z
tags: 
  - EverNote
  - WordPress
---

何故か前のテンプレートで表示がおかしくなってしまったので、Twenty Tenにしています。

本題は、Evernoteの新機能で、SiteMemoryと呼ばれるものが実装されたそうなので、早速記事毎に表示するように設定してみました。

最近良く見かける、TwitterやFacebookのボタンのように、クリックで各サービスの機能を実行するもののようです。

こちらの[SiteMemoryの設定ページ](http://www.evernote.com/about/developer/sitememory/)でタグの発行を行うことが出来るのですが、そのままでは固定ページのみになってしまうので、以下のように記述しました。

```php
<script type="text/javascript" src="http://static.evernote.com/noteit.js"></script>
<a href="#" onclick="Evernote.doClip({providerName:'<?php the_title(); ?>',contentId:'post-<?php the_ID() ?>'}); return false;"><img src="http://static.evernote.com/article-clipper.png" alt="Clip to Evernote" /></a>
```

最適ではないかもしれませんが、こちらで、タイトルと記事内容の取得が可能です。  
 また、タグについても記事についているタグを入れることも大丈夫そうなので、またもう少し実験しようと思います。