---
title: "スマホ用の下からニュッとGoogleマップを表示するJavaScriptライブラリ"
date: 2012-10-10T23:31:08.000Z
updated: 2012-10-10T23:31:08.000Z
tags:
  - JavaScript
  - スマートフォン
---


[以前jQueryライブラリとして公開](http://blog.sus-happy.net/201112/sp-google-maps-jquery/)していましたが、そもそもスマホサイトでjQueryを読み込むこと自体が重荷のように感じたので、ネイティブのライブラリを作ってみました。

ただ、ちょっと実機の実験がiOS6の純正ブラウザのみしか出来ていないので、他のデバイスで動くか心配です。


## 変更点

変換する時に1KB程度増加しましたが、jQueryそのものが要らなくなるので、90KB程度削減できたと考えられます。

実行時の関数が少し変わっています。詳細はGitHubをご覧ください。


## デモ

[デモページ（スマートフォンでご覧ください）](http://demo.sus-happy.net/javascript/SPGMaps2/)はこちらから

[ダウンロード（GitHub）](https://github.com/sushat4692/SPGMaps.js)


