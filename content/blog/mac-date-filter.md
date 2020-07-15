---
title: "Macで特定日時以降に編集したファイルを抽出してみた"
date: 2013-01-05T03:25:15.000Z
updated: 2016-04-03T13:38:36.000Z
tags:
  - Mac
---

「数あるファイルの中から触ったファイルだけを抽出してコピーする」という事をWindowsでは[Fire File Copy](http://www.k3.dion.ne.jp/~kitt/pc/sw/ffc/)を使って実現していたのですが、Macに移ってから出来なくなっていました。

ファイルの更新日時からフィルタリングが出来れば良いので、そういったことが出来そうなアプリを探してみたのですがイマイチピンと来るものもなく、どうしようかと悩んでいる時に[この記事](http://havelog.ayumusato.com/develop/others/e148-find-xargs-cp.html/keyword/updated/)を見て、Mac用に変換して使えるのではないかと思ったので試行錯誤してみました。


## とりあえずコピペ

まずそのまま使えるとベターなのでコピペしてみたのですが、「Mac OS Xに入っている`cp`は、`-parents`とか`-t`オプション等が無かったりするようなので、GNU系の話ということで適当に」と書いてある通り動きませんでした。

結構重要な`-parents`が動作しないままでは難しそうなのでちょっと工夫してみます。


## 「古い」データを削除してみる

ということで、「一旦全てコピー」→「指定日時より古いファイルを削除」という流れに変えてみました。

```shell
#!/bin/bash

if [ -n "$3" ]
then
    cp -r -p $1 $3

    cd $3
    touch -t `date +$2.00` $2.start

    find . -type f -not -newer $2.start -print

    find . -type f -not -newer $2.start -print0 | xargs -0 rm -fr
    echo '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    find . -type f
fi

cd ../
find $3 -type d -empty -delete

echo 'completed!'
```

最初に`cp -r -p`で全てコピーをし、`find`の条件式の所を反対にして、`xargs`の`cp`を`rm`にした感じです。
後は空っぽのフォルダが出てきてしまうので、`find -type d -empty -delete`で削除しています。

正直な所、無駄なコマンドがあるんじゃないかと思うのですが、動いているので触っていません…。


## 使い方

こんな感じです。

```shell
. path/to/updated.sh from YYYYMMDDHHII to
```

例えば、コピー元「hoge」ディレクトリを「fuga」ディレクトリに2013年1月1日9時15分以降のファイルをコピーしようとすると、

```shell
. path/to/updated.sh hoge 201301010915 fuga
```

という感じになります。


## その他

最初に全てコピーしているので、大量のファイルとかには向かないのでは無いかと思うのですが、今のところ500〜600ファイルの場合は気にならないレベルだと感じています。

個人的にはコマンドラインにあんまり慣れていない<del>（一度日時設定間違ってがっつり消してしまったりした）</del>ので、GUIのアプリとか見つかるといいのですが…。

念のため、探している間に見つけた他の方法も参考サイトに挙げておきますが、もし良さげなモノが見つかればまた紹介するようにします。


## 参考サイト

- [指定日時以降に更新されたファイルを表示orコピー ::ハブろぐ](http://havelog.ayumusato.com/develop/others/e148-find-xargs-cp.html/keyword/updated/)
- [[mac] Automatorで差分納品データを作成 | Labrid WP](http://labrid.jp/wp/archives/1119/)


## 追記 13/05/14

MacでもGUIのアプリが見つかりましたので、紹介記事を書きました。
 こちらもご確認下さい。

[Win/Mac両対応の更新ファイルを抽出して書き出すAIRアプリ「Cowsee」が便利](http://blog.sus-happy.net/updated-file-cowsee/)
