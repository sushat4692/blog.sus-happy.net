---
title: "サーバをLinodeに移管してみた"
date: 2014-09-28T18:43:33.000Z
updated: 2016-04-03T10:55:00.000Z
tags: 
  - CentOS
  - MariaDB
  - MySQL
  - nginx
  - PHP
  - サーバ
---


[何度か](http://blog.sus-happy.net/200911/server-move-2/ "サーバを移転しました。") [移管を](http://blog.sus-happy.net/201010/sakura-vps/ "さくらのVPSに移管完了") [繰り返してきている](http://blog.sus-happy.net/201211/aws-ec2-nginx/ "サーバをAWS EC2+nginx+PHP+MySQLに乗り換えてみた")当サイトですが、今回は[Linode](https://www.linode.com/)に移管をしてみました。

t1.microからt2.microという手もあったのですが、AWSを利用する理由も特にないかなぁということでまたVPSに舞い戻っています。

ついでにCentOSも7にしてみたので、色々変更点をメモメモ。


## Linodeを契約

メンバー登録して、必要情報を入力、プランは「Linode 1024」を選択、デプロイ等ゴニョゴニョしていたら立ち上がりました。

開設あたりまでは、[こちらのページに詳しく記載されていました](http://blog.uklab.jp/web/sign-up-linode/)ので参考にさせていただきました。


## 必要なモノをインストール

AWSとほぼ同じ環境を用意していきますので、PHP（php-fpm）、MySQL、nginxをインストールしていきます…ついでに標準パッケージも気になっていたMariaDBになっていたのでコチラを利用。お初。

という事で、自分はyumしか使えないので、epel、remiのお世話になります。

```shell
rpm -Uvh http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-2.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm
```


自動的にレポジトリ見に行くのは微妙なのでenabledを0にしてから、PHP、MySQL、nginxをインストールします。  
 と、言いたいところでしたが、PHP5.5をインストールする時にlibgd.soが無いよって言われてしまったので、gd-lastもインストールします。

```shell
yum install --enablerepo=remi gd-last
yum install --enablerepo=remi-php55 php-cli php-mysql php-mbstring php-gd php-fpm
yum install --enablerepo=remi mariadb-server
yum install --enablerepo=epel nginx
```


## MariaDBの初期設定

とは言っても事前調査なしなので、MySQLの初期設定と同様です。[前回の記事と変わりません](http://blog.sus-happy.net/201211/aws-ec2-nginx/ "サーバをAWS EC2+nginx+PHP+MySQLに乗り換えてみた")。

MariaDBを実行するコマンドだけ異なります。CentOS7からは「systemctl」が採用されたそうなので、「/etc/rc.d/init.d/***」では無くなりました。  
[systemctlについてはコチラのページで色々詳しく記載がされていました](http://qiita.com/tukiyo3/items/092fc32318bd3d1a0846)ので参考にさせて頂いています。

```shell
systemctl start mariadb
systemctl enable mariadb
```

ちなみにMySQLのダンプデータをそのまま実行しても移すことが出来ました。今のところ不具合は起きていません。


## PHPとnginxの初期設定

コチラは前回の設定と<del datetime="2014-09-28T09:34:23+00:00">変えなくても動きました</del>変えていません。

MariaDBと同様に、systemctlから実行、自動起動設定を行います。


## その他色々

1. 一旦ローカルのhostsをLinodeに向くように書き換えてチェック
2. 問題なさそうだったのでAレコードを書き換え
3. 新規ファイルをアップしてDNSが書き換えられてるかチェック
4. EC2側を（まだちょっと怖いので）stop

EC2を停止してもEBS分が課金されるみたいなので、様子をみてterminateする予定です。

そういえばポート設定してないのでそちらも気が向いたらしておこう。iptablesじゃなくなってるらしいので、試してみたらまたメモします。


## 参考

- [Linodeのアカウント開設からプロモーションコードの適応までを書いてみる – UKLab開発者ブログ](http://blog.uklab.jp/web/sign-up-linode/)
- [systemd – CentOS7で使われているsystemctlについて少しまとめた – Qiita](http://qiita.com/tukiyo3/items/092fc32318bd3d1a0846)