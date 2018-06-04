title: "ねんがんの Macをてにいれたぞ！ということで、設定をしたことをメモ"
date: 2012-08-29T09:27:59.000Z
updated: 2012-08-29T09:27:59.000Z
tags: 
  - Mac
---


何度か買おうかと迷っていたMacですが、この度購入を決意して手に入れました。  
 簡単なことしかしていないので、新鮮な情報はないと思いますが触ってみたことを残しておきます。


## 環境設定

### トラックパッドのスクロールの向き

Macのトラックパッドは2本指でスクロールさせることが出来るのですが、Lionから？スクロールの向きが逆になりました。  
 今から使う人には良いのかもしれませんが、自分には気持ち悪かったので、変更。

[システム環境設定]->[トラックパッド]->[スクロールとズーム]->[スクロールの方向：ナチュラル]のチェックを外す

- [Mac OS X Lionの逆スクロールを従来の方向に戻す方法。 | 和洋風KAI](http://wayohoo.com/mac/beginners/mac-os-x-lion-backward-scrolling-undo.html)

### トラックパッドで進む・戻る

初期設定では、2本指を左右にスワイプすることで進む・戻るが出来るのですが、前述の通りスクロールも2本指です。

横スクロールバーが出たページを見ているときに、勢い余って次のページや前のページに行ってしまうことがあったので、3本指で進む・戻るを動作するように変更しました。  
 また、この設定を行うと同時に、「フルスクリーンアプリケーション間をスワイプ」が4本指に自動的に変更されます。

[システム環境設定]->[トラックパッド]->[その他のジェスチャ]->[ページ間をスワイプ]の[2本指でスワイプ]を[3本指でスワイプ]に変更

- [Lionで3本指スワイプでの進む・戻るを使えるようにする – Macの手書き説明書](http://veadardiary.blog29.fc2.com/blog-entry-3378.html)

### ファイアウォールを起動

初期設定ではファイアウォールが起動していないようなので、起動させました。

[システム環境設定]->[セキュリティとプライバシー]->[ファイアウォール]->[ファイアウォールを入にする]をクリック

### 通知センターにTwitterのTLを表示

Mountain Lionから追加された通知センターにTwitterのTLを表示できるようになので試してみました。

[システム環境設定]->[メール/連絡先/カレンダー]->[Twitter]をクリック->ログイン情報を入力

今後はFacebookも読み込めるようなので楽しみですね。

- [MacにTwitterのアカウントを設定する方法｜Mountain Lion Tips – Banguardサイト](http://banguard.hatenablog.com/entry/2012/07/31/Mac%E3%81%ABTwitter%E3%81%AE%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95%EF%BD%9CMountain_Lion_Tips)

### Googleカレンダーと連動

こちらはLionの時に追加されたのですが、Googleアカウントと連動しカレンダーを引き込む事が出来るようになりました。  
 今まではiCal形式で読み込んでいたので、だいぶ楽になりましたね。

[システム環境設定]->[メール/連絡先/カレンダー]->[Gmail]をクリック->ログイン情報を入力

本当はこれでGmailも引き込みたかったのですが、何故か出来ませんでした…。

- [OS X LionでGmailアカウント登録を行うと、Google カレンダーとGoogle チャットも同時登録可能に(MAC お宝鑑定団 blog（羅針盤）) – エキサイトニュース](http://www.excite.co.jp/News/apple_blog/20110725/Macotakara_13522.html)


## ソフトをインストール

### KeyRemap4MacBook

調子に乗ってUSキーにしてもらったので、英数キーとかなキーがありません。

command+スペースキーで、英字かなの切り替えは出来るのですが、どっちになっているのか気にせずに押せるボタンが欲しかったので、「[KeyRemap4MacBook](http://pqrs.org/macosx/keyremap4macbook/index.html.ja)」をインストールしてスペースキーの左右にあるcommandキーを英数キーとかなキーに割り当てました。

- [MacのUSキーボードで「英数キー」と「かなキー」を使いたーい！　～KeyRemap4MacBookでカスタマイズ（リマッピング） : もっと知りたいリンゴあれこれ](http://yucomac.blog96.fc2.com/blog-entry-576.html)

まぁこんな設定するくらいなら最初からJISキー買っとけって話ですが…。

### Alfred

Dockも優秀だと思うのですが、ズラズラと並んでいる中から選ぶ、というのは性に合わないので、ランチャーソフトをインストール。

Macのランチャーといえば[Quicksilver](http://qsapp.com/)とよく聞くような気がしますが、設定が面倒とかいう話も聞いたので、別のランチャーを探し、「[Alfred](http://www.alfredapp.com/)」を使うことに決めました。

option+スペースキーで入力欄が表示され、ソフトの名前を入力してエンターで起動できます。  
 他にも色々と出来るのでしょうが、とりあえず自分にはこの程度で十分です。

今回は手を付けませんでしたが、「[LaunchBar](http://www.obdev.at/products/launchbar/index.html)」も気になります。

- [Macのランチャーアプリ「Alfred」の便利さに、今さらながら気がついた。 / 旧:あなたのスイッチを押すブログ](http://kazoo1837.blog23.fc2.com/blog-entry-272.html)

### Growl

Macを買ったら入れてみたかったソフトの一つである「[Growl](http://growl.info/)」。あらゆるソフトの通知をしてくれるソフトで、通知センターがMacに搭載されたのでどうかなーと思いましたがインストールしてみました。

少し使ってみて判断をしてみようと思います。

### Sparrow

ついこの前Googleに買収されたMac向けのメールクライアントソフト「[Sparrow](http://sprw.me/)」。

Windows機では、Chromeのアプリケーションから新規ウィンドウを立ち上げて使っているのですが、Mac版Chromeではアプリを新規ウィンドウとして開けないので、クライアントソフトを使うことにしました。  
 UIが綺麗で思わずインストール。ラベルを常時表示できないかなぁと思いますが、必須ではないので目を瞑っています。

- [GmailでMacなユーザー必携の｢Sparrow｣を正式版に切り替えました | [M] mbdb](http://mbdb.jp/macintosh/sparrow_majorversion.html)
- [Google、MacとiPhone向けメールアプリのSparrowを買収 – ITmedia ニュース](http://www.itmedia.co.jp/news/articles/1207/23/news026.html)

### Sublime Text 2

少し前に名前を見かけて使い始めた「[Sublime Text 2](http://www.sublimetext.com/2)」。

Win機にもインストールしているのですが、共通した開発環境があると行ったり来たりが簡単になりそうだったので、Macにもインストールしました。

ココでは詳しく説明しませんが、インストール直後でも十分な機能を持っていますが、そこからのカスタマイズ性も高く、Vim/Emacsが使えない自分にとってはこの拡張性が気に入っています。

- [Tender Surrender: Sublime Text 2 のススメ](http://blog.agektmr.com/2012/05/sublime-text-2.html)

### その他インストールしたソフト

<dl><dt>[Transmit](http://panic.com/jp/transmit/)</dt><dd>FTPに。</dd><dt>[Xcode](https://developer.apple.com/xcode/)</dt><dd>アプリ開発に。</dd><dt>[CotEditor](http://sourceforge.jp/projects/coteditor/)</dt><dd>テキストエディタに。</dd><dt>[Caffeine](http://itunes.apple.com/us/app/caffeine/id411246225)</dt><dd>スリープ防止に。</dd><dt>[YoruFukurou](https://sites.google.com/site/yorufukurou/)</dt><dd>Twitterクライアントに。</dd><dt>[OnyX](http://www.titanium.free.fr/download.php)</dt><dd>使いきれてる気がしませんが…最適化に。</dd><dt>[Google Chrome](https://www.google.com/intl/ja/chrome/browser/)</dt><dd>Windowsで慣れてしまったので。</dd><dt>[Google日本語入力](http://www.google.co.jp/ime/)</dt><dd>個人的にことえりってあんまり好きじゃないんですよね。</dd><dt>[The Unarchiver](http://itunes.apple.com/app/the-unarchiver/id425424353)</dt><dd>良いという記事を見かけたのですが、良く分かってません…。</dd><dt>[Evernote](http://evernote.com/intl/jp/)</dt><dd>各デバイス間でのメモを共有するために。定番ですね。</dd><dt>[Dropbox](http://www.dropbox.com/)</dt><dd>各デバイス間で…（略）。設定データとかも共有し始めると手放せなくなってきました。</dd><dt>[Skype](http://www.skype.com/intl/ja/home)</dt><dd>一応入れました。</dd></dl>- - - - - -

とりあえずババっとインストールした感じなので、まだ足りなかったり、入れ過ぎていたりするかもしれません。

もうちょっと使い込んでみてから改めてまとめて比較してみようかと思います。


