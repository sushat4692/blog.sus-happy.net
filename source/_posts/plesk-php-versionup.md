title: "Pleskが入ってるサーバのPHPのバージョンがアップできなかった→できた"
date: 2012-12-22T17:49:30.000Z
updated: 2016-04-03T13:40:05.000Z
tags: 
  - CentOS
  - PHP
  - Plesk
---

とあるPleskが入っているサーバがまだPHPのバージョンが5.1.xだったのですが、諸事情で5.2以上したかったのでバージョンアップしようかと思ったところ、エラーが発生してしまったのでちょっと調べてみました。

ちなみにOSはCentOS5でした。


## エラー内容について

とりあえず、何もせずにremiレポジトリからyum updateをしようとしてみると、下記のようなエラーが発生しました。

```shell
yum --enablerepo=remi update php
（…省略…）
Error: Missing Dependency: any-php-sqlite2 is needed by package sb-publish-3.0.1-********.noarch (installed)
```

PHPをバージョンアップすると「php-sqlite2」が失くなるけど、「sb-publish」には必要なのでアップデート出来ませんよ、ということなのですが、そもそも「sb-publish」って何さ、ということで調べてみました。


## sb-publishとは

ちょっと調べてみたところ、Pleskを開発しているParallels社の別製品である「[Parallels Plesk SiteBuilder](http://www.parallels.com/jp/products/plesk/sitebuilder/)」というウェブ・アプリケーションのことを指しているコトがわかりました。

どんなアプリか見てみると…

> Parallels Plesk SiteBuilder は、使いやすく拡張性に富んだウェブサイト作成・管理用ウェブアプリケーションです。

ということなので、削除しました。

```shell
yum remove sb-publish
```

これでyumでPHPをバージョンアップすることが出来ます。

```shell
yum --enablerepo=remi update php
```

Pleskをインストールされていると管理画面で色々出来るので便利なのですが、制約がかかってしまうのも考えものですね。