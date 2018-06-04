title: "ThunderbirdとGoogleカレンダーを同期させてみた"
date: 2011-03-24T01:18:57.000Z
updated: 2011-03-24T01:19:25.000Z
tags: 
  - Google
  - Thunderbird
---


久しぶりな投稿です。お久しぶりです。

Googleカレンダーを扱うように少しずつ遷移しているのですが、クライアントソフトにも同期する方法があったと思ったので、今回はThunderbirdへ同期する方法を調べてみました。


## 必要なアドオンをインストール

まずはThunderbirdにスケジュール管理機能を付加する、[Lightning](https://addons.mozilla.org/ja/thunderbird/addon/lightning/)をインストールします。

これだけでも、iCal形式のカレンダーと同期できるので、可能ではあるのですが、Googleカレンダーとは動作を保証していないので、少し不安な感じがします。

そこで、[Provider for Google Calendar](https://addons.mozilla.org/ja/thunderbird/addon/provider-for-google-calendar/)をインストールすることで、双方向の同期を行うようになります。


## Googleカレンダーと同期させる

インストールが完了したら、Googleカレンダーと同期の設定を行います。

1. Lightningの画面から「新しいカレンダー」を選択、「ネットワークのサーバ」を選択します。
2. 次に現れる画面で、「Googleカレンダー」にチェック、テキストボックスには、Googleカレンダー内の設定ページ内にある、限定公開URLのXMLアドレスを入力します。
3. ポップアップでパスワードを尋ねられるので、Googleアカウントのパスワードを入力し、カレンダーの名前や色を入力していけば完了。

上記の通り、細かな設定は必要なく、クライアントソフトとも同期させることが可能です。

Googleカレンダー自体使い勝手が良いので、あまり必要性はないかもしれませんが、こんな方法もあるとだけ、覚えておきます。


