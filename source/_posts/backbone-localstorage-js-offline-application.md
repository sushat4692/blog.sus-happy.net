---
title: "Backbone.localStorage.jsを使ってオフラインWebアプリケーションを作ってみた"
date: 2014-01-26T01:26:26.000Z
updated: 2016-04-03T11:18:37.000Z
tags: 
  - Backbone.js
  - JavaScript
---

ネイティブアプリとして作るにしてはコストや、制限がかかりすぎてしまう件を考慮して、Webアプリをの方が良いと判断し、Backbone.localStorage.jsを使ってオフラインWebアプリケーションを構築した時のメモを残しておきます。


## Backbone.localStorage.js

Backbone.jsのModel、CollectionのSave、CreateのメソッドをOverrideし、HTML5のlocalStorage機能を利用してクライアント側に保存するライブラリです。  
 DLはこちらから：[jeromegn/Backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage)

通常であればAjaxで通信する所をlocalStorageに保存する流れになりますので、通信したい場合はjQueryやZeptoを利用して手動で行う必要があります。

例えばCollectionでBackbone.localStorage.jsを利用する場合はこんな感じに記述します。

```javascript
( function( $ ) {

    /**
     * FugaModel
     */
    FugaModel = Backbone.Model.extend( {
        'initialize': function() {
            // Collection側からremoveされた時にdestroyを呼ぶ
            this.bind( 'remove', function() {
                this.destroy();
            } );
        },

        'defaults': {
            'foo': null,
            'bar': null
        }
    } );

    /**
     * FugaModelのCollection
     */
    FugaCollection = Backbone.Collection.extend( {
        'model': FugaModel,
        // Backbone.LocalStorageの引数はlocalStorageに保存される際のキーです
        'localStorage': new Backbone.LocalStorage("fuga_collection-backbone")
    } );

} )( jQuery );
```


## オフライン対応

このままでは扱うデータはクライアント側に保存されますが、アクセスする際に通信が発生してしまいます。

そこで、アプリケーションキャッシュを利用することで通常より強力なキャッシュをクライアントに保存することが出来、動作に必要なファイルをキャッシュさせることでオフラインでも操作可能なアプリケーションを構築することが出来ます。

### cache manifestの生成

cache manifestにより、どのファイルをキャッシュさせ、どのファイルはサーバから取得させるのか指定を行います。

ファイル名は具体的な決まりは無いようですが、「*.manifest」や「*.appcache」という名称が多いようです。  
 本記事では「cache.manifest」とします。

記述方法としてはこんな感じです。

```shell
CACHE MANIFEST
# ver. 0.0.1
# キャッシュファイル更新の発火用に、バージョン番号を入れておくと便利

# キャッシュさせるファイル
CACHE:
/img/logo.png
/img/blank.png
/js/jquery.js
/js/underscore-min.js
/js/backbone-min.js
/js/backbone.localStorage-min.js

# サーバから取得するファイル
# 逆に指定しないとサーバから取得しなくなるので「*」を指定するのが無難
NETWORK:
*

# サーバにアクセス出来なかった場合の代替指定
FALLBACK:
/img/*.png /img/blank.png
```

また、アプリケーションキャッシュを有効化するには、HTMLタグに下記のように指定します。

```html
<!doctype html>
<html lang="ja" manifest="cache.manifest">
<head>
    <meta charset="UTF-8">
    ...
</head>
<body>
    ...
</body>
</html>
```

ここで注意していただきたいのが、**後述するキャッシュファイルを更新する機能を組み込む前にアプリケーションキャッシュを保存しないようにする**ことです。

アプリケーションキャッシュは更新やブラウザの再起動だけでは削除することが出来ないため、更新する機能を組み込まないまま保存してしまうと、キャッシュとして保存してしまったファイルの更新を行うことが非常に困難になってしまいます。

### キャッシュファイルを更新する

アプリケーションキャッシュは非常に強力で、特別な操作をしない限りはクライアントから削除されることはなく、サーバから取得することはありません。  
 ブラウザのキャッシュファイルを削除することで再度サーバから取得することが出来ますが、ユーザにその操作をお願いすることは微妙です。

そこで利用されるのが、JavaScriptを利用することでアプリケーションキャッシュの再読み込みを促す方法です。  
[詳細はこちらのページでご紹介されています](http://www.html5rocks.com/ja/tutorials/appcache/beginner/)ので、ここでは再読み込みを行う処理のみメモしておきます。

```javascript
( function() {
    // アプリケーションキャッシュが更新完了したら実行
    // cache manifestに変更がなければキャッシュファイルの更新も行われず、このイベントも実行されない
    window.applicationCache.addEventListener('updateready', function( e ) {
        alert( '更新完了' );
    } , false);

    // インターネットに接続されているか？
    if(! navigator.onLine )
        return false;

    // アプリケーションキャッシュが保存されているか？
    if( window.applicationCache.status > 0 )
        window.applicationCache.update();
} )();
```

例のコメントに記載したとおり、cache manifestに変更がなければサーバから再度取得されません。  
 そこで活躍するのがバージョン番号です。キャッシュさせるファイルの一部変更を行った場合は、cache manifestも変更する必要があるため、バージョン番号を変更して対応させることが出来ます。  
 これは日付（YYYY-mm-dd）等でも良いかもしれません。

### アプリケーションキャッシュの消し方

もし、<del>更新する関数も作ったし大丈夫とか思いながらクリックイベントから関数を呼び忘れていた自分のように</del>更新する機能を実装する前にアプリケーションキャッシュを保存してしまった場合、ブラウザから直接削除する事が出来ます。

#### Google Chromeの場合

アドレスバーに「chrome://appcache-internals/」と入力すると、現在保存されて言うキャッシュの一覧が表示されますので、「Remove」をクリックすることで消去することが出来ます。

#### Firefoxの場合

開発ツールを開き、コンソールに「appcache clear」と入力すると消去することが出来ます。  
 また、「appcache list」と入力すると一覧を確認できます。

#### PC版Safariの場合

通常のキャッシュと同様に「キャッシュを空にする」を実行することで一緒に消えるようです。

#### iOS版Safariの場合

PC版と同様に、通常のキャッシュを消す方法と同じ、「設定」→「Safari」→「Cookieとデータを消去」で一緒に消えるようです。

#### Android版Chrome

「設定」→「アプリ」→「Chrome」→「データを消去」で削除することが出来ます。  
 ただし、設定情報なども全て消えてしまうようなので、実行するときには注意が必要です。


## 雑感

ネイティブアプリを利用するにはちょっと勿体無い…という場合には充分有用な機能ではないかと思います。JavaScriptが主体となるので、ネイティブアプリのパフォーマンスには劣りますが、簡単な操作で気になる点はありませんでした。

iOS限定ですが、よりアプリっぽくする場合には「Webアプリモード」というモノもあります。

```html
<meta name="apple-mobile-web-app-capable" content="yes">
```

URLバーやナビゲーションバーが表示されず、画面目いっぱい利用することが出来る所は嬉しいですね。ただし、通常のページ遷移を行うとSafariに飛ばされてしまうので、ページ切り替えもJavaScriptで用意する必要がある点に注意です。


## 参考

- [アプリケーション キャッシュ初心者ガイド – HTML5 Rocks](http://www.html5rocks.com/ja/tutorials/appcache/beginner/)
- [#3 「あまりApplication cache（cache manifest）のことを甘く見ない方がいい」 Advent Calendar 2012 | tech.kayac.com – KAYAC engineers' blog](http://tech.kayac.com/archive/application-cache-cache-manifest-advent-calendar-2012.html)