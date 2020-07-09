---
title: "サーバをAWS EC2+nginx+PHP+MySQLに乗り換えてみた"
date: 2012-11-20T02:09:20.000Z
updated: 2016-04-03T13:49:37.000Z
tags:
  - a-blog cms
  - AWS
  - MySQL
  - nginx
  - PHP
  - WordPress
---

これまでは、[さくらのVPS](http://vps.sakura.ad.jp/)を利用させていただいていたのですが、最近の流行りに乗っかろうかと思いまして[AWSのEC2](http://aws.amazon.com/jp/ec2/)でサーバを立ちあげて移管してみました。

単純にnginxに慣れていない事もあって色々と躓いてしまいましたが、なんとか表示できています。
 不具合がまだチョコチョコ出ちゃってますが、メインコンテンツが見れてるのでとりあえず保留中です。

また何かの時に新しく作るかもしれないので、参考サイトとメモを残しておきます。


## AWS EC2の設定

まずAWSのアカウントを作ってEC2のインスタンスを作ります。

使い慣れているので、CentOSを選びましたが全部同じのはなぁ…と思ってCentOS6 64bitを選択しました。

また、nginxやPHP、MySQL、WordPressまでプリインストールされているモノもあるのですが、設定方法を勉強するためにも今回はOSのみのイメージを選択しています。

WordPressを利用するだけなのであれば、[こちらの記事](http://8bitodyssey.com/archives/3344)が参考になるかと思います。

### 参考サイト

- [civic site » EC2のMicroインスタンス + nginx + fastcgi + wordpressで複数サイトの運用！しかも新規は1年無料！](http://civic.xrea.jp/2012/01/08/ec2-micro-nginx-wordpress/)
- [AWS + 網元で、超高速 WordPress を手に入れよう、そうしよう | 8bitodyssey.com](http://8bitodyssey.com/archives/3344)


## CentOSの初期設定

ほとんど何も入っていないので、色々とインストールします。

まずは、CentOSのパッケージだとPHPとMySQLのバージョンが微妙なのと、nginxが含まれていないので、yumレポジトリを追加します。

```shell
rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-7.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
rpm -Uvh http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.2-2.el6.rf.x86_64.rpm
```

epelとremiは最初から「enabled」が「1」、「rpmforge」は「0」になっています。
 どちらにするかは自由かと思いますが、個人的には選べるようにしたかったので、全て「0」にしています。

ちなみに設定情報は、「/etc/yum.repos.d/****.repo」に書かれています。

最後にPHPとMySQL、nginxをインストールします。

```shell
yum install --enablerepo=remi php-cli php-mysql php-mbstring php-gd php-fpm
yum install --enablerepo=remi mysql-server
yum install --enablerepo=epel nginx
```

PHPはnginx上でfastcgiとして動かすので、「php-fpm」も一緒にインストールしました。

### 参考サイト

- [majin.jp » 録画サーバ移設完了](http://www.majin.jp/archives/287)


## MySQLの初期設定

基本的に初期設定のままですが、文字コードをUTF-8で利用できるようにちょこっとだけ編集しました。

```shell
[mysqld]
character-set-server = utf8
skip-character-set-client-handshake

[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqldump]
default-character-set=utf8
```

あとは、起動して「mysql_secure_installation」で初期設定をしておきます。

```shell
/etc/rc.d/init.d/mysqld start
chkconfig mysqld on
mysql_secure_installation
```

### 参考サイト

- [さくらの VPS に nginx を入れてリバースプロキシ設定するまでの作業メモ（検証用） | ウェブル](http://weble.org/2012/05/22/nginx-work-log)
- [データベースサーバー構築(MySQL) – CentOSで自宅サーバー構築](http://centossrv.com/mysql.shtml)


## PHPの初期設定

「php.ini」を色々といじって設定を行います。
 いまいち何が最適なのかわからないので正直適当に触っていますが、参考サイトを参照いただければと思います。

```shell
vi /etc/php.ini
```

あとは、fastcgiのためにphp-fpmの設定を行います。

```shell
vi /etc/php-fpm.d/www.conf
; 内部ポートを利用する例が多いですが、ソケットにしました
listen = /path/to/php-fpm.socket
; userとgroupをnginxで設定する名前にします
user = nginx
group = nginx
; pm.**** は勉強不足です。
; 予め設定した領域内で動かすか、変動させるか？って感じでしょうか
```

最後にphp-fpmを起動させます。

```shell
/etc/init.d/php-fpm start
chkconfig php-fpm on
```

### 参考サイト

- [PHP/tips/推奨php.ini設定 – yohgaki's wiki](http://wiki.ohgaki.net/index.php?PHP%2Ftips%2F%E6%8E%A8%E5%A5%A8php.ini%E8%A8%AD%E5%AE%9A)
- [PHP5.3 php.iniの必須設定サンプル – ほめお日記](http://d.hatena.ne.jp/home0/20111112/1321062630)
- [日本語利用の為の設定(mbstring) – php.iniの設定 – PHPインストールと初期設定](http://www.phpbook.jp/install/phpini/index5.html)
- [さくらの VPS に nginx を入れてリバースプロキシ設定するまでの作業メモ（検証用） | ウェブル](http://weble.org/2012/05/22/nginx-work-log)


## nginxの初期設定

最後にnginxを設定します。かなり手探り状態なので合ってるかどうか怪しいですが…。

ほぼ[参考サイト](http://weble.org/2012/05/22/nginx-work-log)のコピペですが、ソケットでfastcgiを動作させ、リバースプロキシを行なっているつもりの設定です。

```shell
vi /etc/nginx/nginx.conf
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    # gzip圧縮
    gzip  on;
    gzip_http_version 1.0;
    gzip_vary         on;
    gzip_comp_level   6;
    gzip_types        text/xml text/css application/xhtml+xml application/xml application/rss+xml application/atom_xml application/x-javascript application/x-httpd-php;
    gzip_disable      "MSIE [1-6]\.";

    # リバースプロキシの設定
    proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=czone:4m max_size=50m inactive=120m;
    proxy_temp_path   /var/tmp/nginx;
    proxy_cache_key   "$scheme://$host$request_uri";
    proxy_set_header  Host               $host;
    proxy_set_header  X-Real-IP          $remote_addr;
    proxy_set_header  X-Forwarded-Host   $host;
    proxy_set_header  X-Forwarded-Server $host;
    proxy_set_header  X-Forwarded-For    $proxy_add_x_forwarded_for;

    upstream backend {
        ip_hash;
        server 127.0.0.1:8080;
    }
    upstream php-backend {
        server unix:/path/to/php-fpm.socket;
    }

    # Load config files from the /etc/nginx/conf.d directory
    # The default server is in conf.d/default.conf
    include /etc/nginx/conf.d/*.conf;
}
```

基本的には「virtual.conf」を編集するそうなのですが、サブドメインを色々と使っているので、サブドメインごとに「example.com.conf」の様に用意しています。

こちらもほぼコピペですが、WordPress向け＋（要らないと思いますが）PATH_INFOも取得できるようにしています。

```shell
vi /etc/nginx/conf.d/example.com.conf
server {

    listen      80;
    server_name example.com;
    root        /path/to/document/root;
    access_log  /var/log/nginx/example.com/access.log   main;
    error_log   /var/log/nginx/example.com/error.log;
    client_max_body_size 36M;

    location /wp-admin { proxy_pass http://backend; }
    location ~ .*\.php { proxy_pass http://backend; }
    location / {
        set $mobile "";
        if ($http_user_agent ~* '(DoCoMo|J-PHONE|Vodafone|MOT-|UP\.Browser|DDIPOCKET|ASTEL|PDXGW|Palmscape|Xiino|sharp pda browser|Windows CE|L-mode|WILLCOM|SoftBank|Semulator|Vemulator|J-EMULATOR|emobile|mixi-mobile-converter)') {
            set $mobile "@ktai";
        }
        if ($http_user_agent ~* '(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry)') {
            set $mobile "@mobile";
        }
        if ($http_cookie ~* "comment_author_|wordpress_(?!test_cookie)|wp-postpass_" ) {
            set $do_not_cache 1;
        }

        proxy_no_cache     $do_not_cache;
        proxy_cache_bypass $do_not_cache;
        proxy_cache czone;
        proxy_cache_key "$scheme://$host$request_uri$is_args$args$mobile";
        proxy_cache_valid  200 301 302 60m;
        proxy_cache_valid  404 5m;
        proxy_cache_use_stale  error timeout invalid_header updating
                               http_500 http_502 http_503 http_504;
        proxy_pass http://backend;
        proxy_redirect http://example.com:8080/ /;
    }
}

server {

    listen      8080;
    server_name example.com;
    root        /path/to/document/root;
    access_log  /var/log/nginx/example.com/access.log   main;
    error_log   /var/log/nginx/example.com/error.log;
    client_max_body_size 36M;

    location / {
        index  index.php index.html index.htm;
        # static files
        if (-f $request_filename) {
            expires 14d;
            break;
        }
        # request to index.php
        if (!-e $request_filename) {
            rewrite ^(.+)$  /index.php?q=$1 last;
        }
    }

    # pass the PHP scripts to FastCGI server listening on socket
    location ~ \.php$ {
        set $script $uri;
        set $path_info "";
        if ($uri ~ "^(.+\.php)(/.+)") {
            set $script $1;
            set $path_info $2;
        }
        # fastcgi_pass   127.0.0.1:9000;
        fastcgi_pass   php-backend;
        include        fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  /path/to/document/root$fastcgi_script_name;
        fastcgi_param  DOCUMENT_ROOT    /path/to/document/root;
        fastcgi_param  PATH_INFO        $path_info;
        fastcgi_param  SCRIPT_NAME      $script;
        fastcgi_intercept_errors on;
    }
}
```

最後に起動して、エラーが出なければ動く…はずです。

```shell
/etc/init.d/nginx start
chkconfig nginx on
```

### a-blog cms向けの設定

ちなみに[a-blog cms](http://www.a-blogcms.jp/)向けの設定は下記の通り、のはずです。

```shell
vi /etc/nginx/conf.d/acms.example.com.conf
server {
    listen      80;
    server_name acms.example.com;
    root        /path/to/document/vhosts/acms;
    access_log  /var/log/nginx/acms.example.com/access.log   main;
    error_log   /var/log/nginx/acms.example.com/error.log;
    client_max_body_size 36M;

    location /wp-admin { proxy_pass http://backend; }
    location ~ .*\.php { proxy_pass http://backend; }
    location / {
        set $mobile "";
        if ($http_user_agent ~* '(DoCoMo|J-PHONE|Vodafone|MOT-|UP\.Browser|DDIPOCKET|ASTEL|PDXGW|Palmscape|Xiino|sharp pda browser|Windows CE|L-mode|WILLCOM|SoftBank|Semulator|Vemulator|J-EMULATOR|emobile|mixi-mobile-converter)') {
            set $mobile "@ktai";
        }
        if ($http_user_agent ~* '(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry)') {
            set $mobile "@mobile";
        }
        if ($http_cookie ~* "comment_author_|wordpress_(?!test_cookie)|wp-postpass_" ) {
            set $do_not_cache 1;
        }

        proxy_no_cache     $do_not_cache;
        proxy_cache_bypass $do_not_cache;
        proxy_cache czone;
        proxy_cache_key "$scheme://$host$request_uri$is_args$args$mobile";
        proxy_cache_valid  200 301 302 60m;
        proxy_cache_valid  404 5m;
        proxy_cache_use_stale  error timeout invalid_header updating
                               http_500 http_502 http_503 http_504;
        proxy_pass http://backend;
        proxy_redirect http://acms.example.com:8080/ /;
    }
}

server {

    listen      8080;
    server_name acms.example.com;
    root        /path/to/document/vhosts/acms;
    access_log  /var/log/nginx/acms.example.com/access.log   main;
    error_log   /var/log/nginx/acms.example.com/error.log;
    client_max_body_size 36M;

    location / {
        index  index.php index.html index.htm;
        if (-e $request_filename) { break; }
        rewrite (.*(^|/)[^\./]+)$ $1/ permanent;
        rewrite ((\.(html|htm|php|xml|txt|js|json|css|yaml|csv))|/)$ /index.php last;
    }

    # pass the PHP scripts to FastCGI server listening on socket
    location ~ \.php$ {
        set $script $uri;
        set $path_info "";
        if ($uri ~ "^(.+\.php)(/.+)") {
            set $script $1;
            set $path_info $2;
        }
        # fastcgi_pass   127.0.0.1:9000;
        fastcgi_pass   php-backend;
        include        fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  /path/to/document/vhosts/acms$fastcgi_script_name;
        fastcgi_param  DOCUMENT_ROOT    /path/to/document/vhosts/acms;
        fastcgi_param  PATH_INFO        $path_info;
        fastcgi_param  SCRIPT_NAME      $script;
        fastcgi_intercept_errors on;
    }
}
```

### 参考サイト

- [さくらの VPS に nginx を入れてリバースプロキシ設定するまでの作業メモ（検証用） | ウェブル](http://weble.org/2012/05/22/nginx-work-log)
- [Oneライセンスと合わせて完全無料! a-blog cmsをdotCloudで動かしてみた – エンジニアブログ – スカイアーク](http://www.skyarc.co.jp/engineerblog/entry/ablogcms_dotcloud.html)


## 発生中の不具合

現状発生中の不具合は下記の通り、時間見つけて随時修正していきます。

### Perl CGIが動かない

Perlの設定を全くしていないので、現状では動きません。

恐らく[ここの内容](http://abeerforyou.com/?p=429)を参考にすれば良いかと思うのですが、試した時はうまく動作しませんでした。

たぶんちょっとしたミスだと思うので、ちょこちょこ試してみます。

### スニペット集でエラーが発生中

以前、[カスタム投稿タイプを使ってスニペット集を作った](http://blog.sus-happy.net/jquery-pjax-wordpress/)のですが、エラーが発生するようになってしまいました。

リダイレクトの設定なのか、移管した時にミスしているのか、ちょっと原因は不明ですが修正予定です。


## その他AWS利用中の注意点

また、今回の設定の中で、AWSを利用する上で気をつけないといけないなぁ、と感じたことを挙げておきます。

### ローカル時間の設定について

インスタンスを用意した直後では、東京リビジョンで作ったとしても世界標準時になっています。

こちらはAWSに限ったことではないのですが、仮想サーバの特性上ntpをインストールしても時刻設定が出来ないので、AWS側で用意してあるファイルをコピーします。

```shell
cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
```

### ポートの開閉について

基本的には「iptables」を利用してポートの開閉を行うかと思うのですが、AWSではサーバ上ではポートの操作を行わず、セキュリティグループと呼ばれる機能で管理します。

利用方法については[こちらのページでわかりやすくまとめられています](http://www.ipentec.com/document/document.aspx?page=amazon-ec2-add-rule-to-security-group&culture=ja-jp)ので、ご参考にしてださい。

自分の場合、iptablesをインストールしてしまい、設定変更しても変わらないなーと思ってSSHポートを何を思ったのかOFFに設定変更した後リブートしてしまう、という行動を取ったことによって、AWSのセキュリティグループは通ってもOS上で弾かれる、というどうしようもない状態になってしまいました。


## まとめ

AWS EC2を初めて利用させてもらいましたが、結構快適です。

好きな時に好きな分だけ、というのはかなり実感出来ました。
 （特に一個インスタンスをどうしようもない状態にしてしまった時に、新しくもう一つインスタンスを立ち上げた時）

AMIとか言うイメージデータを作ったりすると、もっと便利になりそうですが、もうちょっと調査が必要なので、またボチボチ触っていこうかと思います。


## 追記 12/11/30

スニペット集のエラーについては、pjaxの判定に「getallheaders」を利用していたことが原因でした。

PHP5.4からはCGI版でも利用できるのですが、それ以前ではモジュール版のみの機能だったので、そこでエラーが発生していました。

スニペット集では「[jquery-pjax](https://github.com/defunkt/jquery-pjax)」ライブラリを利用しているのですが、こちらではGET値「_pjax=true」も付与されているので、そちらで判定するように変更しています。
