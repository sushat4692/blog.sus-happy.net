---
title: "次世代Zen-coding「Emmet」をSublime Text 2で試してみた"
date: 2012-10-21T11:09:47.000Z
updated: 2016-04-03T13:51:55.000Z
tags: 
  - CSS
  - Emmet
  - HTML
  - Sublime Text 2
  - Zen-Coding
---

HTML/CSSのコーディングを効率化する「Zen-Coding」が次期バージョンで大幅に仕様を変更し「Emmet」と名称を変更するようなので、現在公開中のベータバージョンを試してみました。


## Sublime Text 2にインストール

Sublime Text 2（以下ST2）向けのEmmetはGitHunにて公開されていますので、レポジトリを追加してインストールすることが出来ます。  
 具体的な手順は下記の通り。

1. コマンドパレット（Win:Ctrl+Shift+p、Mac:Command+Shift+p）から「Package Control: Add Repository」を選択
2. 「https://github.com/sergeche/emmet-sublime」を入力
3. コマンドパレットの今度は「Package Control: Install Package」を選択
4. 「emmet-sublime」が追加されているので選択
5. ST2を再起動


## Zen-Codingとの違い

基本の使い方はZen-Codingと変わりませんが、階層構造に対しての考え方に変更が加えられました。

Zen-Codingで複数階層を混ぜたコーディングを行う場合、「()」を駆使する必要がありましたが、Emmetでは「^」で「一階層上に戻る」という機能が設けられました。地味ですがかなり嬉しい機能です。

例えば、下記のようなコーディングを行いたい場合、

```html
<div id="head">
	<p id="siteName"></p>
</div>
<div id="main">
</div>
```

Zen-Codingでは、「()」を使う必要があるので、最初に書き忘れてしまうとカーソルを戻さないといけません。

```html
(div#head>#siteName)+div#main
```

Emmetでは、「^」を記述すれば一階層上に戻れるので、そのまま書き続けることが出来ます。

```html
div#head>#siteName^div#main
```


## その他変更点

CSSの記述方法にも変更点があるそうなのですが、CSSはあんまり使っていなかったので違いに関しては良く分かりませんでした。

こちらのページで詳しい説明がありましたので、ご紹介しておきます。  
 » [Zen-Codingの次期バージョン、Emmet について｜Web Design KOJIKA17](http://kojika17.com/2012/09/zen-coding-next-emmet.html)

こちらの紹介記事を見る限りCSSでもかなり効率化できそうですね･･･。勉強してきます。


## 注意点

現状ですが、まだ開発版ということもあり、不具合が発生してしまう恐れがあります。  
 自分の場合は、日本語変換確定のエンターキーを押すと、入力していた文字列が消える、という現象が起きました。

これがEmmetが原因なのか、他のプラグインとの衝突が原因なのかの検証は行っていませんが、バックアップを取った状態でインストールすることをオススメします。


## 参考

- [Zen-Codingの次期バージョン、Emmet について｜Web Design KOJIKA17](http://kojika17.com/2012/09/zen-coding-next-emmet.html)
- [Sublime Text 2をMacで使う | Kitchen Garden Blog – I'll cook and hack new one.](http://blog.hifumi.info/mac/sublime-text-2-for-mac/#emmet)
- [CSSの記述を高速化する、Emmet (Zen-Coding)｜Web Design KOJIKA17](http://kojika17.com/2012/10/css-speedstar-for-emmet.html)