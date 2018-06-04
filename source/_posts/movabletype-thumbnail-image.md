title: "MovableTypeのサムネイル画像が上手く生成出来ない"
date: 2010-06-30T00:50:23.000Z
updated: 2016-04-03T16:09:35.000Z
tags: 
  - MovableType
  - Perl
---

ある案件でMovableTypeでサイト構築を行っている際に、サムネイル画像の生成が上手く出来ませんでした。

今後もあるかもしれないので、実際に解決まで至った方法を残しておきます。


## 原因

よくよく見て見ると、管理画面のダッシュボードにImageMagickが使えない旨が書いてありました。

デフォルトではImageMagickが設定されており、利用できない状態だとサムネイル等、画像の編集に関わる事ができないみたいです。


## 使用する画像ライブラリの変更

そこで、他の画像ライブラリを使用する方法を探してみると、mt-config.cgiに以下の様に追記することで変更が可能とのこと。

GDの場合

```perl
ImageDriver GD
```

NetPBMの場合

```perl
ImageDriver NetPBM
```

しかし、設定をGDに変更しても、まだダッシュボードから警告が取れていませんでした。

そもそもGDが入っているのか？と`mt-check.cgi`を確認すると、ImageMagickどころか、GD、NetPBMもインストールされていませんでした。


## GDのインストール

まずはGDのインストールを試みて見ました。

色々なサイトを見て回ったところ、必要な手順は下記のコマンドだけでいいみたいです。[参考サイト様](http://d.hatena.ne.jp/BigFatCat/20080226/1204014196)

```shell
cpan install GD
```

が、利用しているサーバでは「libgd」がインストールされていないためインストール出来ないとの事。

libgdのインストール方法を調べて見ると次は以下の様にコマンドを入力していけばいいのですが…。[参考サイト様](http://kralis.dip.jp/wiki/index.php?libgd-%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)

```shell
/usr/local/src
wget http://www.libgd.org/releases/gd-2.0.35.tar.gz
tar -zxvf gd-2.0.35.tar.gz
cd gd-2.0.35
./configure
make
su
make install
```

そもそもコンパイルに必要な「`gcc`」が入っていない旨のエラーコードが返されました。うーむ。


## NetPBMのインストール

gccのインストールも上手くいかなかったので、NetPBMのインストールを試してみました。

入力するコマンドはこれだけ。

```shell
cpan install IPC::Run
```

ログがずらずらっと並んだあとインストール完了、`mt-config.cgi`をNetPBMを利用する記述に変更すると、ダッシュボードの警告も消え、さっそく再構築をするとサムネイル画像の生成が成功。

なかなか遭遇した事のない環境だったので勉強になりました。