---
title: "WordPressからGhostに移管してみた"
date: 2016-04-08T16:54:02.000Z
updated: 2016-04-08T16:55:13.000Z
tags: 
  - WordPress
  - Ghost
---

長らくWordPressでこのブログを更新してきましたが、前々から気になっていたGhostに移管をしてみました。

その時に行ったことをメモしておきます。

## 目次

* [Ghostの準備](#prepared)
  * [Node.jsをnvmでインストール](#install-nvm)
  * [Ghostをインストール](#install-ghost)
  * [Node.jsの実行をデーモン化する](#node-daemon)
* [nginxからGhostを実行する](#nginx2ghost)
* [記事データの移管](#transfer)
  * [手直しが必要なモノ](#need-fix)
* [雑感](#other)

## <a name="prepared">Ghostの準備</a>

まずはGhostのインストールを行います。その間にh2oがうまく動かなくなってしまったので、現状の環境としてはCentOS7 + nginx + MySQL + Node.jsという感じです。

### <a name="install-nvm">Node.jsをnvmでインストール</a>

Node.jsはepelリポジトリから`yum`でインストールをすることが可能ですが、今回はnvm経由でインストールします。

```bash
# nvmをインストール
$ git clone git://github.com/creationix/nvm.git ~/.nvm
$ source ~/.nvm/nvm.sh

# ログイン時に有効化されるようにしておく
# 下記を追加
$ vi ~/.bash_profile
if [[ -s ~/.nvm/nvm.sh ]];
 then source ~/.nvm/nvm.sh
fi

# インストールできるバージョンを確認
$ nvm ls-remote

# インストール
$ nvm install v4.4.2

# デフォルトに設定
$ nvm alias default v5.10.1
```

### <a name="install-ghost">Ghostをインストール</a>

次にGhostをインストールします。

```bash
# ソースコードを取得
$ curl -L https://ghost.org/zip/ghost-latest.zip -o ghost.zip
$ unzip -uo ghost.zip -d ghost
$ cd ghost

# 必要ライブラリをインストール
$ npm install sqlite3 --build-from-source
$ npm install --production

# とりあえず動かしてみる
$ npm start
```

`config.js`を書き換えることで、実行するIPアドレスやポート、URLを変更することが出来ます。

### <a name="node-daemon">Node.jsの実行をデーモン化する</a>

`npm start`でも実行はできますが、デーモン化されないので、`forever`をインストールしました。

```bash
$ npm install forever -g
```

これで、実行する際は、

```bash
$ NODE_ENV=production forever start index.js
```

停止する際は、

```bash
$ forever stop index.js
```

を叩けばOKです。


## <a name="nginx2ghost">nginxからGhostを実行する</a>

ドメインから実行できるようにnginxからGhostを実行させます。ココに関しては特に難しくもなく、[公式マニュアルの方法](http://docs.ghost.org/ja/installation/deploy/#ghostを独自ドメイン名で使う)に則って設定しています。

若干違う点としては、SSLで運用していますので、一部記述が増えています。

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate      /path/to/ssl.pem;
    ssl_certificate_key  /path/to/ssl.key;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers   on;

    location / {
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:2368;
    }
}
```

インストールや、初期設定などについては割愛します。

## <a name="transfer">記事データの移管</a>

次に、これまで書いてきた記事データの移管を行います。[WordPressにGhost向けにjson形式変換してエクスポートするプラグイン](https://ja.wordpress.org/plugins/ghost/)が用意されていますので、そちらをインストールしてデータを取得します。

データがダウンロード出来たら、Ghostの管理画面にログインし、`Labs`メニューからアップロードしてインポートします。

基本的なテキストデータはコチラで引き継ぐことが出来ました。

### <a name="need-fix">手直しが必要なモノ</a>

上記プラグインで全て引き継ぐコトが出来る訳ではありません。  
自分の場合は下記の作業を手作業で行いました。

<dl>
<dt>画像の移管</dt>
<dd>参照先のURLが変わらないので、WordPressのサーバが残るのであれば、そのままでもOK</dd>
<dt>WordPressのショートコード<code>[*][/*]</code></dt>
<dd>変換されないので、手で直す必要があります</dd>
<dt>微調整</dt>
<dd>たまに綺麗にMarkdownになっていないコトがあるので、微調整</dd>
</dl>

この作業が一番手間かもしれません…。


## <a name="other">雑感</a>

前々から気になっていたのですが、やっと試すことが出来ました。

以前も一度インストールしてみようかと思っていたのですが、`npm install`がどうにもうまく実行できずに諦めてしまっていました。  
今回はちゃんと動いてくれたので良かったです。

Markdownも最近PCでメモを取るときは利用することが多くなったため、ブログ記事もMarkdownで記入できると楽だなぁと今回思いました。

WordPressの時もJetpackプラグインでMarkdown対応出来たと思いますが、他の記事に影響がありそうで怖くて使っていませんでした…。使い勝手的にはどうなのでしょうね？

しかし、まだまだv1.0にもなっていないので、色々起きるかもしれませんが、ちょこちょこ試してみようかと思います。テーマも取り急ぎ不要なモノを削っただけなので、そちらもいじってみたいですね。