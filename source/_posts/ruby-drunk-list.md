title: "Ruby on Railsの勉強がてらに呑んだくれリストを作ってみた（その１ Rails環境構築編）"
date: 2015-09-23T00:43:47.000Z
updated: 2016-04-08T13:23:12.000Z
tags: 
  - Ruby
  - Ruby on Rails
---


Ruby on Railsを少し勉強しておこうと思っていたところで、友人にビールの飲み歩きをしてる話をしていたら、リスト作っておかないと忘れるんじゃない？と言われ、確かにそうだと思ったのでRailsの勉強がてらに呑んだくれリストを作ってみました。

今回の環境は、CentOS7 + Nginx + Unicorn + Ruby on Railsです。

途中まで記事を書いていたら長くなってきたので、分割して更新をしていきます。


## とりあえず出来上がったもの

まずは必要最低限だと思われる情報を登録し、一覧で確認できる所まで作ってみました。

[とりあえず出来たものはこんな感じのモノです（スマホ推奨）](http://drunk.sus-happy.net/)。だれでも適当に登録できてしまうとアレなので、一応データの登録・削除は認証が必要になっています。


## 雑談（読み飛ばしOK）

最初は[Heroku](https://www.heroku.com/)で作ろうかと思ったのですが、よくよく調べてみると無料で利用できる時間の制限があるそうなので、それであれば環境から構築しようと[DigitalOcean](https://www.digitalocean.com/)を契約してみました。

DigitalOceanの契約については、[ココの記事で詳しく書いてありました](http://yutapon.hatenablog.com/entry/2014/04/15/102832)が、画面自体が簡単だったのでジロジロと見ながら登録はしなくても大丈夫でした。

OSについてはいつも使っているCentOSにしました。CoreOSも選択出来るようなので、Dockerを利用する構成もありかもしれませんね。勉強しないと…。

また、<del>面倒なので</del>Railsサーバを使おうかと思っていたのですが、80ポートにあてがうためには権限が足りなかったので、<del>仕方なく</del>Unicorn + Nginxを利用することにしました。

ちなみに、Rails + Passenger + Nginx(Apache)という構成の方がシンプルなのですが、メモリが1GB以上無いとPassengerのインストールが出来なかったので断念しています。

### 雑談のおまけ

一応Heroku構築時の参考ページを残しておきます。

- [Rails x Herokuでアプリを作成 [完全初心者向けチュートリアル] – 酒と泪とRubyとRailsと](http://morizyun.github.io/blog/beginner-rails-heroku-tutorial/)

以下はRails + Passenger + Nginxを試していた時のメモ。

- [rbenv+nginx+passenger+rails環境構築メモ(CentOS) – Qiita](http://qiita.com/FumihiroSaito/items/4a50e12a769fb7014df6)

「passenger-install-nginx-module」が実行できず断念しました…。


## Railsの準備

まず、rbenvを利用してRubyを用意します。  
 （rvmとドチラが良いのだろう？と調べた所、rvmはシェルを上書きしてしまうそうなので、rbenvの方が最近は流行ってるんだと思います。）

```shell
# rbenvを用意
cd /usr/local/
git clone https://github.com/sstephenson/rbenv.git
cd rbenv
# 環境変数の設定
echo 'export RBENV_ROOT="/usr/local/rbenv"' >> /etc/profile
echo 'export PATH="${RBENV_ROOT}/bin:${PATH}"' >> /etc/profile
echo 'eval "$(rbenv init -)"' >> /etc/profile
# ruby-buildを用意
git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build
# インストール
rbenv install -v 2.2.3
rbenv global 2.2.3
rbenv rehash
# rubyの動作確認
ruby -v
```

Railsはgemでインストールします。簡単ですね。

```shell
gem install --no-ri --no-rdoc rails
gem install bundler
```

ちなみに、参考サイトに書いてあったのでそのまま利用していたのですが、「–no-ri –no-rdoc」のオプションはドキュメントをインストールしないようにするオプションなんだそうです。

### Railsの基本コマンド

Railsには便利なコマンドが沢山揃えられていますので、その中でも基本的なコマンドだけ残しておきます。

プロジェクトを作成する

```shell
rails new projectname
```

プロジェクトのベースのファイルを一気に作成します。まずはこのコマンドを実行してRailsプロジェクトの作成を開始する感じになります。

登録・編集・削除の一通りの処理を追加する

```shell
rails g scaffold modelname column_foo:string column_bar:integer
```

登録・編集・削除の一通りの処理に必要なModel、View、Controllerを作成してくれます。リレーションをしないような簡単な処理であればScaffoldと見た目の体裁を整えるだけで作れるのではないかと思うくらい便利です。

ちなみに、「g」は「generate」の省略形です。

作成したscaffoldを削除する

```shell
rails destroy scaffold modelname
```

scaffoldで作成する時に、カラムを一つ忘れてしまった、という様な、migrationをわざわざ作成する位なら削除したほうが早い、といった時に利用すると便利な操作です。

Modelを追加する

```shell
rails g model modelname column_foo:string column_bar:integer
```

ControllerとViewを追加する

```shell
rails g controller controllername index show
# index show はControllerに追加するメソッド
```

Model、Controller（、View）それぞれを作成するコマンドです。

Modelにカラムを追加する

```shell
rails g migration AddColumnBazToModelname column_baz:string
```

一度作ったModelにカラムを追加したい時に。正確にはmigrationを作成する処理です。  
 「AddColumnBazToModelname」の部分は、「Add(追加するカラム名のキャメルケース)To（追加するモデル名のキャメルケース）」というような指定になります。

migrationを実行する

```shell
rake db:migrate
```

scaffoldやmodelを作成しただけではデータベースには反映されず、migrationを作成するだけですので、このコマンドを実行してデータベースに反映させる必要があります。

Railsサーバを起動する

```shell
rails s
```

Railsサーバを起動します。上記コマンドだと、127.0.0.1:3000（localhost）でしかつながらないので、ポートを変更したり外部からでもアクセスさせるためには以下のように実行します。

外部向けにRailsサーバを起動する

```shell
rails s -b 0.0.0.0 -p 8080 -d
```

ちなみに「-d」はデーモンとして起動させるオプションです。

また、これら以外にもrailsのコマンド・オプションは存在しています。有効に利用していくとかなり効率的に開発を進められそうですね。


## 参考サイト

- [rails環境構築（CentOS + ruby on rails） – Qiita](http://qiita.com/shinyashikis@github/items/3501c5f7f71a8e345c3d)
- [ruby – RVM と RBEnvの違いは？ – スタック・オーバーフロー](http://ja.stackoverflow.com/questions/2955/rvm-%E3%81%A8-rbenv%E3%81%AE%E9%81%95%E3%81%84%E3%81%AF)
- [いつも忘れる「Railsのgenerateコマンド」の備忘録 – maeharin log](http://maeharin.hatenablog.com/entry/20130212/rails_generate)


## シリーズ

- [その２ 「Unicorn+Nginx編」](https://blog.sus-happy.net/201509/ruby-drunk-list-2/)
- [その３ 「Railsアプリ構築編」](https://blog.sus-happy.net/201510/ruby-drunk-list-3/)