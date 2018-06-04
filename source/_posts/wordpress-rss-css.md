---
title: "WordPressのRSSの見た目をCSSで変更してみる"
date: 2012-04-08T21:56:36.000Z
updated: 2016-04-03T14:30:40.000Z
tags: 
  - CSS
  - RSS
  - WordPress
---

折角ブログの見た目を変更したので、RSSもいじってみようと思い、CSSでのデザイン変更を行ってみました。

CSSを書いて、読み込ませるだけ･･･ではあったのですが、RSS用のテンプレートの適用方法が若干特殊だったので残しておきます。


## RSSのテンプレートを変更する

WordPressにはRSS用のテンプレートは用意されていないため、ソースファイルを触るしかないのかな？なんて思っていましたが、アップデートする度に元に戻ってしまうのがイヤなので、調べてみるとこんな方法で[各種フィード用のテンプレートを実現できる](http://dogmap.jp/2009/04/30/switching-feed-template/)ようです。

上記記事は”functions.php”を書き換える方法ですが、[プラグインも作成されている](http://dogmap.jp/2011/06/28/feed-template-customize/)ようなので、そちらを使ってみても良いかもしれません。


## RSSにCSSを読み込ませる

RSSのテンプレートが作成できるようになったら、CSSを読み込ませるように書き換えます。

HTMLとは少しだけ記述が違い、こんな感じになります。

```xml
<?xml-stylesheet href="rss.css" type="text/css" media="screen"?>
```

WordPressのテーマ用に書くとこんな感じでしょうか。

```php
<?php echo '<?xml-stylesheet href="'.get_bloginfo("template_directory").'/rss.css" type="text/css" media="screen"?>'; ?>
```


## RSS向けのCSSを書く

最後にRSS向けのCSSを書きます。

HTMLと同様にXMLが基礎となっているので、階層で指定してやれば問題ありませんが、全てインライン要素扱いになっているので、必要なものには`display:block`を指定すると良さそうです。

また、通常のHTMLでは存在しない、`<dc:creator>`のようなタグは、セミコロンの後ろ、今回で言う所の`creator`として認識されるようです。


## 他の方法

他にXSLTを利用すると、XML内のデータをHTMLに変換することが出来るので、もっと自由にレイアウトや、リンクを貼ったりすることも出来るので、面白そうですね。

またこちらの方法も試してみたいと思います。


## 参考

- [各種フィード用テンプレートの変更 : dogmap.jp](http://dogmap.jp/2009/04/30/switching-feed-template/)
- [Feed Template Customize : dogmap.jp](http://dogmap.jp/2011/06/28/feed-template-customize/)
- [RSSにもCSSを ～CSSテクニック～](http://www.stylish-style.com/csstec/hi-level/rsscss.html)
- [RSS を XSLT で html に変換して見栄え良く表示する](http://sonic64.com/2005-03-16.html)