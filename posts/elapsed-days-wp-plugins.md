---
title: "投稿してから何日経ったのか表示するWordPressプラグイン"
date: 2012-01-22T22:53:27.000Z
updated: 2016-04-03T14:49:01.000Z
tags:
  - PHP
  - Plugins
  - WordPress
---

たまに投稿してから何日経ちました、と表示してもらえるブログを見かけることがあったので、作ってみました。

↑のタイトルの下に出ている表示がそうです。

[ダウンロード（GitHub）](https://github.com/sushat4692/Elapsed-Days)

いつもの如くとりあえずダウンロード先だけ･･･ちなみに表示のさせ方は、表示させたい箇所に、

```php
<?php the_elapsedDays() ?>
```

を記述します。投稿IDを利用しているのでループ中のみの表示です。


## 追記 2012年1月23日

何だか上手く動いていないですね･･･。修正してきます。


## さらに追記 2012年1月23日

WordPressの仕様でdate()とtime()が強制的にUTCになってしまうのが原因でした。

参考：[WordPress利用のphpでdateのTimezoneが強制UTCになっちゃう件 | public class Everyday extends Image](http://emylo0.com/wordpress%E5%88%A9%E7%94%A8%E3%81%AEphp%E3%81%A7date%E3%81%AEtimezone%E3%81%8C%E5%BC%B7%E5%88%B6utc%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A1%E3%82%83%E3%81%86%E4%BB%B6/)

date_i18n()を利用すればよいとの事なので、修正してアップしてあります。