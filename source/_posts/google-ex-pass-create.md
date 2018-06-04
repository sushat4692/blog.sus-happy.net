title: "Google拡張機能の作り方を調べるついでにパスワードを自動生成する拡張機能を作ってみた"
date: 2012-03-22T01:09:07.000Z
updated: 2016-04-03T14:33:32.000Z
tags: 
  - Google
---

社内向けにGoogle拡張機能を使ってツールを作ってみようかと思い立って調べてみたところ、簡単なモノであればサクッと作れそうなので、テストも兼ねて自分用にパスワード自動生成の拡張機能を作ってみました。


## Google拡張機能の作り方

[APIリファレンス](http://code.google.com/chrome/extensions/docs.html)はこちらですが、英語は読めないので、[意訳されているページ](http://dev.screw-axis.com/doc/chrome_extensions/)を参考にさせていただきました。

その中の[Getting Started](http://code.google.com/chrome/extensions/getstarted.html)（[意訳](http://dev.screw-axis.com/doc/chrome_extensions/tutorials/getting_started/)）で、ある程度の作りが分かるかと思います。

早期リリースバージョンが必要、と書かれていますが、現状では拡張機能画面の右上、”デベロッパーモード”のチェックを入れるだけで大丈夫です。

“manifest.json”で、各ファイルの関連付けを行って、HTMLファイルとJavaScriptファイルで動作させるみたいですね。  
 そういえばMovableTypeのバックアップデータもJSON形式のファイルで関連付けを行っていたような気がします。


## パスワード自動生成拡張

![](/content/images/2016/04/image.jpg)

先程のチュートリアルのデータをちょいちょいいじって、こんな感じのものを作りました。

完全に私用です。パスワードを考えるのが面倒な時に使っていたJavaScriptのプログラムをサーバに置いて使っていたのですが、そちらをChrome拡張にしてみました。

パッケージ化をしてみたのですが、自分のPCでは上手くインストールできませんでした。他PCでも同様かもしれませんが、一応置いておきます。

[ダウンロード](http://demo.sus-happy.net/chrome/makepass.crx)


## 参考サイト

- [Chrome Extensions API リファレンス](http://dev.screw-axis.com/doc/chrome_extensions/)
- [Hello There! – Google Chrome Extensions – Google Code](http://code.google.com/chrome/extensions/docs.html)


## 追記 12/03/23

やっぱり”パッケージが無効です。詳細: Could not unzip extension.”とか出てインストールできないですね。

うーん…。もう少し調べてみます。
