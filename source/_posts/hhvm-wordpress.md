---
title: "Amazon EC2（t1.micro）のPHP実行環境をHHVMにしてみた"
date: 2014-05-16T00:54:26.000Z
updated: 2016-04-03T11:03:35.000Z
tags: 
  - HHVM
  - nginx
  - PHP
---


Facebookが開発しているPHPを高速に実行するHHVMが気になっていたので、試しにこのブログを動かしているサーバにインストールさせてみました。

HHVM単体でサーバもたてれるようですが、今回はCentOS6 + Nginx + HHVM（Fastcgi）で動かしています。


## HHVMをインストール

まずはHHVMをインストールします。RPMが配布されていますので、yumでサクッと（いきませんでした）。

```shell
$ wget http://www.hop5.in/yum/el6/hop5.repo
$ yum install hhvm
// libwarf が無いよって怒られる
 
$ yum install libdwarf --enablerepo=epel
$ yum install hhvm
 
$ hhvm
// liblcms2.so.2が無いよって怒られる
 
$ wget http://pkgrepo.linuxtech.net/el6/release/x86_64/liblcms2-2.4-1.el6.x86_64.rpm
$ yum install liblcms2-2.4-1.el6.x86_64.rpm
 
$ hhvm
// -> OK（メモリー不足エラーが出る）
```


## t1.microでHHVMを動かす

デフォルトの設定ではt1.microインスタンスではメモリが足らず動きません。

探してみたところ、[t1.microインスタンスで動かす](https://github.com/facebook/hhvm/issues/1129) [試行錯誤がなされた形跡](http://www.6tech.org/2014/01/wordpress-nginx-hhvm/)がありましたので、その内容をconfig.hdfに追記します。

```shell
Eval {
  Jit = true
  JitASize = 67108864
  JitAStubsSize = 67108864
  JitGlobalDataSize = 22554432
}
```

これでt1.microで動くようになりました。（php-fpmと同時実行は出来ませんでした）

Fastcgiモードで実行する場合は下記のようなコマンドを実行します。

```shell
// ポートを指定する場合
$ hhvm --mode daemon -vServer.Type=fastcgi -vServer.Port=9000
// socketを指定する場合（自環境の場合は上手く動きませんでした）
$ hhvm --mode daemon -vServer.Type=fastcgi -vServer.FileSocket=/var/run/hhvm/sock
```

今回はポートを指定して実行しています。


## NginxのFastcgiをHHVMに変更する

最後にNginxのFastcgiをHHVMに変更します。  
[以前にメモっておいた設定ファイル](http://blog.sus-happy.net/201211/aws-ec2-nginx/ "サーバをAWS EC2+nginx+PHP+MySQLに乗り換えてみた")の一部分だけ変更しました。

```shell
# ...
 
    upstream php-backend {
        # server unix:/path/to/php-fpm.socket; php-fpmの場合
        # server unix:/var/run/hhvm/sock; socket経由だと何故か動かず…
        server 127.0.0.1:9000;
    }
 
# ...
```


## 上手く動いたように見えましたが

HHVMも実行でき、Nginxも起動できましたが、ページは真っ白に…。エラーログを見てみると、

HipHop Fatal error: unexpected St13runtime_error: locale::facet::_S_create_c_locale name not valid

と怒られてしまいました。

調べてみたところ、ロケールを指定しないと上手く動かないことがあるみたいです。

```shell
$ export LC_ALL=C
$ hhvm --mode daemon -vServer.Type=fastcgi -vServer.Port=9000
```

これで良さそうな感じです。


## 雑感

この記事を公開している時点では実際にHHVMで実行していますが、正常に見えていますでしょうか？

正直な所パフォーマンスは見ていないので、実際に良くなったのかは不明です。  
 試した人の記事を見ていると実際に利用するのはまだまだ、という声が多そうですね。

何気にインストールしないと行けないライブラリも多かったので、簡単に実装！というわけにはいきませんが、色々とチューニングをするよりは簡単に試せるので覚えておいても良さそうな気がします。  
 虚弱なサーバに無理矢理、という所もあるかと思いますが…

そういえば[HerokuのPHPもHHVM](http://www.publickey1.jp/blog/14/herokuphpfacebookhiphop_vm.html)みたいですね。そちらも気になります。


## 参考

- CentOSにHHVMをインストール  
[CentOS6.xでHHVMを動かす＆今度出版される書籍の宣伝 – uzullaがブログ](http://uzulla.hateblo.jp/entry/2014/02/23/221757)
- HHVMでWordPressを動かす  
[WordPress on HHVM | dogmap.jp](http://dogmap.jp/2013/01/23/wordpress-on-hhvm/)
- 同上  
[【PHP】Hip-Hop vm を試してみた – たんたんめん日記](http://dnond.hatenablog.com/entry/2013/10/14/002012)
- liblcms2がないよ！  
[CentOS6.5にHHVMを入れる時のTips](http://syossan.hateblo.jp/entry/2014/04/22/163340)
- Nginx+HHVM Fastcgi  
[Nginx仮想ホスト+fastcgiのHHVM+Ubuntu13.10](http://kore1server.com/256/Nginx%E4%BB%AE%E6%83%B3%E3%83%9B%E3%82%B9%E3%83%88%2Bfastcgi%E3%81%AEHHVM%2BUbuntu13.10)
- HHVM Fastcgiの詳細  
[FastCGI · facebook/hhvm Wiki · GitHub](https://github.com/facebook/hhvm/wiki/fastcgi)
- Amazon EC2 t1.microでHHVMを動かす  
[Amazon EC2 t1.micro can't run HHVM · Issue #1129 · facebook/hhvm · GitHub](https://github.com/facebook/hhvm/issues/1129)
- Amazon EC2 t1.micro + HHVM + Nginxで WordPressを動かす  
[WordPress on Nginx with HHVM | 6tech.org](http://www.6tech.org/2014/01/wordpress-nginx-hhvm/)
- 画面が真っ白なんだけど…  
[clonekoさん用, HipHop Fatal error: unexpected St13runtime_error: locale::facet::_S_create_c_locale name not valid](http://cloneko.com/post/58220263525/hiphop-fatal-error-unexpected-st13runtime-error)
- HerokuがHHVMを採用  
[HerokuがPHPサポート発表、FacebookのHipHop VM採用で高パフォーマンスを実現 － Publickey](http://www.publickey1.jp/blog/14/herokuphpfacebookhiphop_vm.html)