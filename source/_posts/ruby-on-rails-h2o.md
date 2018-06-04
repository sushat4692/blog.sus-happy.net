---
title: "Ruby on RailsをH2O上で動くようにしてみた"
date: 2015-10-04T21:27:12.000Z
updated: 2016-04-03T10:03:06.000Z
tags: 
  - H2O
  - Ruby on Rails
---


[その２ Unicorn+Nginx編](https://blog.sus-happy.net/201509/ruby-drunk-list-2/)ではNginx上で動かしていましたが、もしかしたらH2O上でも動くんじゃないかと思い試し見たところ動いたのでメモを残しておきます。

ちなみに、Unicornの設定については以前の方法から変更はありませんので、今回のメモには残していません。


## H2Oをインストール

[H2Oのインストールの手順はほぼ変わりません](https://blog.sus-happy.net/201506/h2o_php7/#h2o-ready)が、一部だけ手順が変わっています。

以前の方法では、`cmake`をyumでインストールしていましたが、バージョンが足りなくなったのでソースからインストールする必要があります。

```shell
cd /usr/local/src/
wget http://www.cmake.org/files/v2.8/cmake-2.8.12.tar.gz
tar xvfz cmake-2.8.12.tar.gz
cd cmake-2.8.12
./configure
make
make install
# cmakeで実行できるようにシンボリックリンクを貼っておく
ln -s /usr/local/bin/cmake /bin/cmake
```


## H2Oの設定

簡単に考えれば、H2OからUnicornのsocketを叩ければOKなので、`proxy.reverse.url`で設定を行います。  
 「url」ですが、unix socketも渡せるみたいです。便利便利。

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

# ディレクトリインデックス
file.index: [ 'index.html' ]

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
        file.dir: /path/to/application/public
        file.dirlisting: on
        # file.dirに見つからなければunicornに渡す
        proxy.reverse.url: http://[unix:/path/to/unicorn.sock]/
```

`/path/to/unicorn.sock`は、`unicorn.rb`で設定した、`listen`の値を指定します。

これで、現在動いている（はず）です。  
[呑んだくれリスト](https://drunk.sus-happy.net/)もhttp/2になりました！


## 参考

- [CentOS6.x – CentOS6.3でMySQL5.6.14をソースからインストール – Qiita](http://qiita.com/nobu_blast/items/dfe92a7c14136d1dafe9#3-2)  
（の中の「cmakeソースファイルのダウンロード&インストール」）
- [connect to application server via unix-domain socket by kazuho · Pull Request #383 · h2o/h2o](https://github.com/h2o/h2o/pull/383)