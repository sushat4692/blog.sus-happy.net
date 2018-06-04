title: "サーバの構成をCentOS7+H2O+php-fpm(PHP7)にしてみた"
date: 2015-06-30T22:01:30.000Z
updated: 2016-04-03T10:27:04.000Z
tags: 
  - CentOS
  - H2O
  - HTTP/2
  - PHP
---


最近[H2O](https://h2o.examp1e.net/)という[nginx](http://nginx.org/en/)よりも早いと言われているらしいWebサーバを知ったので、取り敢えず入れてみました。

またコレを機に、[HHVM](http://hhvm.com/)よりも早くなったらしいPHP7も気になっていたので、そちらも入れてみました。今のところWordPressは動いているみたいです。

ちなみにCentOS7です。


## 目次

- [H2Oの用意](#h2o-ready)
  - [H2Oのインストール](#h2o-install)
  - [H2Oの設定](#h2o-configuration)
  - [H2Oの起動・停止](#h2o-boot)
- [PHP7をphpenv+php-buildでインストール](#php7-ready)
  - [phpenvのインストール](#phpenv-install)
  - [php-buildのインストール](#php-build-install)
  - [php-buildでPHP7をインストール](#php7-install)
  - [PHP7でphp-fpmを設定・起動](#php7-boot)


## H2Oの用意

### H2Oのインストール

「Development Tools」をインストールしておけば、わりとサクッとインストール出来るようです。後は依存パッケージをインストール。

```shell
yum groupinstall "Development Tools"
yum install cmake
yum --enablerepo=rpmforge install libyaml-devel
```

H2OのソースはGitHubに公開されているので、Gitで取得。cmake, make, make installでインストールします。

```shell
git clone https://github.com/kazuho/h2o.git
cd h2o
git submodule update --init --recursive
cmake .
make h2o
make install
```

まだ、足りないパッケージがありました。

```shell
yum install libssl-dev
yum install openssl-devel
```

make installで完了です。

```shell
make install
```

### H2Oの設定

適当な場所にH2Oの設定ファイルを記述します。

```shell
vi /path/to/h2o.conf
```

WordPress向けに書いた記述はこんな感じ。HTTP/2の仕様的にはSSL通信じゃなくなっても良くなったそうなのですが、まだブラウザ側で制限があるようなので、SSL向けの設定になっています。

```yaml
pid-file: /path/to/h2o.pid
user: nobody
error-log: /path/to/error.log

listen: 80
listen:
  port: 443
  ssl:
    certificate-file: /path/to/ssl.pem # SSLのサーバ証明書+中間証明書
    key-file: /path/to/ssl.key # SSLの秘密鍵

# PHPの設定
file.custom-handler:
  extension: .php
  fastcgi.connect:
    host: 127.0.0.1
    port: 9000
    type: tcp

# ディレクトリインデックス
file.index: [ 'index.php', 'index.html' ]

# ドメイン設定
hosts:
  # HTTP/2を使いたかったのでHTTPSにリダイレクトしてSSL通信に統一
  "example.net:80":
    paths:
      /:
        redirect:
          status: 301
          url: https://example.net/

  "example.net:443":
    access-log: /path/to/access.log
    paths:
      /:
        # 公開ディレクトリの指定
        file.dir: /path/to/httpdocs
        file.dirlisting: on
        # file.dirに見つからなければindex.phpで受け取る
        redirect:
          url: /index.php/
          internal: YES
          status: 307
```

結構短く書けてますね。  
 また、SSLは[StartSSL](https://www.startssl.com/)を利用させて頂きました。

### H2Oの起動・停止

[マニュアルに書いてある方法](https://h2o.examp1e.net/configure/quick_start.html)を参照させて頂きました。

```shell
# 起動（-cオプションには設定ファイルのパスを指定する）
h2o -m daemon -c /path/to/h2o.conf
# 停止（設定ファイルに記述したpid-fileのパスを指定する）
kill -TERM `cat /path/to/h2o.pid`
```

取り敢えずこれでH2O+PHPの環境が整いました。また、SSLで接続するとちゃんとHTTP/2で通信してくれます。（このブログもHTTP/2になっている…はず…）


## PHP7をphpenv+php-buildでインストール

どうせなので、phpenvとphp-buildを使ってPHPをインストールしてみました。

### phpenvのインストール

phpenvもGitHubに公開されていますので、Gitで取得します。また、インストール用のシェルスクリプトが用意されていますので、そのまま実行。

```shell
git clone https://github.com/CHH/phpenv.git
cd phpenv/bin/
sh phpenv-install.sh
```

パスを通して完了です。

```shell
export PATH="/root/.phpenv/bin:$PATH"
eval "$(phpenv init -)"
source ~/.bashrc
```

### php-buildのインストール

同様に、php-buildもGitHubで公開され、インストール用のシェルスクリプトが用意されています。便利便利。

```shell
git clone https://github.com/CHH/php-build.git
cd php-build/
sh install.sh
```

### php-buildでPHP7をインストール

php-buildでインストール出来るバージョンの一覧を見てみます。

```shell
php-build --definitions
## 略
5.6.5
5.6.6
5.6.7
5.6.8
5.6.9
5.6snapshot
7.0.0alpha1
7.0.0alpha2
master
```

7.0.0alphaがあるので利用させて頂きました。

```shell
php-build 7.0.0alpha2 ~/.phpenv/versions/7.0.0alpha2
```

が、依存パッケージがことごとく入っていないので頑張ります。

取り敢えず必要らしいパッケージを一気にインストール。

```shell
yum install libxml2-devel bison bison-devel openssl-devel curl-devel libjpeg-devel libpng-devel libmcrypt-devel readline-devel libtidy-devel libxslt-devel
```

re2cをソースからインストール。

```shell
wget http://sourceforge.net/projects/re2c/files/re2c/0.14.3/re2c-0.14.3.tar.gz
tar zxvf re2c-0.14.3.tar.gz
cd re2c-0.14.3
./configure
make make install
```

libmcryptも足りない。

```shell
yum install --enablerepo=epel libmcrypt libmcrypt-devel
```

libtidyも足りない。

```shell
yum install --enablerepo=epel libtidy libtidy-devel
```

ここまでインストールして入りました。

```shell
php-build 7.0.0alpha2 ~/.phpenv/versions/7.0.0alpha2
```

### PHP7でphp-fpmを設定・起動

php-buildでインストールしたPHPの設定ファイルをいじって、実行します。（既にphp-fpmを起動している場合は停止する必要があります）

```shell
# php.iniを更新
vi ~/.phpenv/versions/7.0.0alpha2/etc/php.ini
# php-fpm.confを更新
cp ~/.phpenv/versions/7.0.0alpha2/etc/php-fpm.conf.default ~/.phpenv/versions/7.0.0alpha2/etc/php-fpm.conf
vi ~/.phpenv/versions/7.0.0alpha2/etc/php-fpm.conf
# php-fpm.d/www.confも更新
vi ~/.phpenv/versions/7.0.0alpha2/etc/php-fpm.d/www.conf
# php-fpmを実行
~/.phpenv/versions/7.0.0alpha2/sbin/php-fpm &
```


## 雑感

思っていたよりも設定内容は少なくかけることにビックリました。なにもチューニングしていなくても、それなりの速度が出るそうです。

Apacheやnginxと繋げて、リバースプロキシ部分だけをH2Oを使う、と言った方法を取っても良いそうなのですが、そこまでの知識は無いので、取り敢えずH2O単体で、リバースプロキシも無しです。（なしですよね？）

HTTP/2も名前だけ知っており、簡単には使えないんだろうなぁ、と思っていたらサクッと動いたのでビックリしました。HTTP/2らしさはあんまりまだありませんが、環境が整っただけでも取り敢えず良しとしておきます。

<del>あと、SSLにしたので、はてブのAPI取得出来なくなりました。SSL対応してくれないかなぁ…。</del>


## 参考

- [高速なWebサーバーという噂のh2oをCentOS 6.6に入れてみたメモ | GUiLZ.ORG](http://www.guilz.org/2015/04/26/%E9%AB%98%E9%80%9F%E3%81%AAweb%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A8%E3%81%84%E3%81%86%E5%99%82%E3%81%AEh2o%E3%82%92centos-6-6%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%9F%E3%83%A1%E3%83%A2/)
- [新、PHPとH2OをfastCGIでつなぐ話、解決編 – uzullaがブログ](http://uzulla.hateblo.jp/entry/2015/06/22/014853)
- [モダンなPHP開発環境を構築する – phpenv + php-build で 複数のPHPバージョンを管理する | Creator Life](http://creator-life.net/modern-php-env/)
- [virtualbox(centos)でphp-buildでコンパイルしたphp-fpmをnginxで使う為の設定メモ(virturalhostの設定まで) – Qiita](http://qiita.com/ryurock/items/b51b7ec9d7c378f60237)
