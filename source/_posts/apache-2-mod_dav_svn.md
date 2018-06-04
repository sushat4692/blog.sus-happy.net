title: "Apache 2 + mod_dav_svnでSubversionを試してみた"
date: 2011-02-11T14:32:41.000Z
updated: 2016-04-03T15:19:39.000Z
tags: 
  - Apache
  - DreamWeaver
  - Subversion
  - サーバ
---

一人で完結する作業が多いので、どれが最新だったとか、どのくらいの時期に使っていたとかはある程度把握できるのですが、やはり限界があったり、結局のところ自分ひとりだけではないことがあるので、バージョン管理について調べてみることにしました。

今回はCentOS5でApache2が構築済みのサーバにSubversionをインストールし、Ｗｅｂ経由でバージョン管理を行う方法です。


## Subversionのインストール

yumコマンドでSubversionとmod_dav_svnをインストールします。

```shell
yum install subversion mod_dav_svn
```


## Subversion設定

設定方法については、[バージョン管理システム構築(Subversion) – CentOSで自宅サーバー構築](http://centossrv.com/subversion.shtml)、またサブドメインで運用をしたかったので、[Apache 2 + mod_dav_svnでsvnレポジトリをサブドメインで運用する – Post-itみたいな](http://d.hatena.ne.jp/from_kyushu/20080813/1218592587)を参考にさせていただきました。

```
<VirtualHost *:80>
   ServerName svn.example.com
   <Location />
      DAV svn
      SVNListParentPath on
      SVNParentPath /var/www/svn/repos
      # Limit write permission to list of valid users.
      <LimitExcept GET PROPFIND OPTIONS REPORT>
         # Require SSL connection for password protection.
         # SSLRequireSSL

         AuthType Basic
         AuthName "Authorization Realm"
         AuthUserFile /var/www/pass/.htpasswd
         Require valid-user
      </LimitExcept>
   </Location>
</VirtualHost>
```


## .htpasswdを設定

AuthUserFileで指定した.htpasswdにBASIC認証用ユーザを登録します。追加方法はこんな感じ。

```shell
htpasswd .htpasswd new_user
```


## Apacheの再起動

最後にApacheを再起動すれば完了です。

```shell
/etc/init.d/httpd restart
```


## 管理方法

後はTortoiseSVNや、DreamWeaver、Eclipse等でバージョン管理を行うことが出来ます。

例えば上記の設定で、「project1」というディレクトリを作り、DreamWeaver CS5で管理する場合、バージョン管理を行うサイトの設定内の「バージョンコントロール」に、以下のように設定します。

<dl><dt>アクセス</dt><dd>Subversion</dd><dt>プロトコル</dt><dd>HTTP</dd><dt>サーバアドレス</dt><dd>svn.example.com</dd><dt>リポジトリパス</dt><dd>/repos/project1</dd><dt>サーバーポート</dt><dd>80</dd><dt>ユーザ名</dt><dd>BASIC認証で設定したユーザ名</dd><dt>パスワード</dt><dd>BASIC認証で設定したパスワード</dd></dl>自動的に差分ファイルの作成、復元も出来るので、かなりファイル管理が楽になりそうですが、まだ使いこなせなさそう…。もうちょっと試してみます。