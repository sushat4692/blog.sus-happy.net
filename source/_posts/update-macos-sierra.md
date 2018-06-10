---
title: "やっとこさmacOS Sierraにバージョンアップしてみた"
date: 2017-01-08T15:52:54.000Z
updated: 2017-06-10T13:26:19.000Z
tags:
  - Mac
---

* **2018/06/10**
  * Karabiner-Elementsが色々対応してくれていましたので、内容を修正しました。

明けましておめでとうございます。いつの間にやら2017年になっていました。今年もよろしくお願いいたします。

さて本題について、macOS Sierraが発表されてから3ヶ月位経ちましたが、随分バージョンアップ出来ずにいました。バージョンアップを渋っていたのは主に下記の理由からです。

* VPN接続で**PPTP非サポート**になった
  * *会社のVPNがPPTP…！致命的…！*
* **Karabinerが対応していない**
  * `左右⌘`による"かな/英数"切り替えがしたい
  * `Cmd+Q`のショートカット一発でアプリ閉じないようにしたい
     * ~~押さないように気をつけることは出来ない~~
  * 環境設定で設定できるキーリピートより早くしたい

ということで、macOS Sierraにしつつ、色々と環境・設定の変更を行ってみました。

## 目次

* [VPN接続方式を変更](#change-vpn)
* [Karabinerの代替ソフト](#change-karabiner)
  * ~~[⌘英かなを利用する](#cmd-eikana)~~ （Karabiner-Elementsが対応しました）
  * ~~[QBlockerを利用する](#qblocker)~~ （Karabiner-Elementsが対応しました）
  * [キーリピートを早くしたい](#key-repeat)
* [Karabiner-Elementsについて](#karabiner-elements)
* [macOS Sierraについて](#macos-sierra)
* [参考](#reference)

## <a name="change-vpn">VPN接続方式を変更</a>

自分も含めて、オフィス外から社内ファイルサーバにアクセスしてデータをやりとりする、といったことをしている背景もあり、VPNが接続出来ない状態になるのは致命的な問題でした。

macOS Sierraだけでなく、iOS10でもPPTP接続は非サポートになっている事もあり、変更すべきタイミングだったのかもしれませんね。

さて、今回の対処としては、VPNの環境についてはYAMAHAのルーターを利用していたので、**PPTP**から**L2TP/IPsec**に接続方式を変更しました。

設定方法については[公式のドキュメントに詳しい流れが書いてあります](http://jp.yamaha.com/products/network/solution/vpn/smartphone/)ので、そちらに設定を行えば大丈夫だと思います。

強いて注意点を挙げるとすると、**一度PPTPの設定内容を全て削除してからでないとL2TP/IPsecの設定を登録することが出来ない**ので、VPN経由で設定を変更することが出来ない、という所かなぁと思います。（当たり前かもしれませんが）

## <a name="change-karabiner">Karabinerの代替ソフト</a>

自分がUSキーボードを愛用していることもあり、特にかな変換キーを`⌘`キーに割り当てたい、という点についてKarabinerを利用していました。

### ~~<a name="cmd-eikana">⌘英かなを利用する</a>~~ （Karabiner-Elementsが対応しました）

[Karabner-Elementsが対応しました。](https://pqrs.org/osx/karabiner/complex_modifications/#japanese)

上記ページから「Import」ボタンを押すと、Karabiner-Elementsに遷移して英/かな切り替えの設定項目が追加されます。

~~まずはかな変換キーのリマップには**[⌘英かな](https://ei-kana.appspot.com/)**を利用することにしました。~~

~~初期設定時に自動的に、`左⌘`で英数、`右⌘`でかなに切り替える設定がされますので、基本的にはインストールして起動するだけで大丈夫です。~~

~~また、他のキーについてもリマップを設定することが出来るので、Karabinerで色々リマップの設定を行っていた人は、このソフトで代替出来ると思います。~~

~~インストール方法については、公式サイトからダウンロードするか、`brew cask`を利用している場合は、そちらからでもインストールが可能です。~~

```shell
brew cask install cmd-eikana
```

~~かな変換対応はコチラで問題ありませんでした。~~

### <a name="qblocker">QBlockerを利用する</a> （Karabiner-Elementsが対応しました）

[Karabner-Elementsが対応しました。](https://pqrs.org/osx/karabiner/complex_modifications/#command_q)

上記ページから「Import」ボタンを押すと、Karabiner-Elementsに遷移して`Cmd+Q`関連の設定項目が追加されます。

~~もう一つ、`Cmd+Q`によるアプリケーションを終了するショートカットを二回叩くことで実行する様にKarabinerで設定していました。~~

~~`Cmd+W`を押そうとして間違って`Cmd+Q`押してしまう、みたいな悲しい事がたまによくあるため、コチラもどうにか実現しておきたかったので色々探してみた所、`Cmd+Q`を長押しに変更する事が出来る**[QBlocker](https://qblocker.com/)**というソフトを見つけました。~~

~~インストール方法は、コチラも公式サイトからダウンロードするか、`brew cask`にも対応しています。~~

```shell
brew cask install qblocker
```

~~若干操作が変わってしまいましたが、防ぎたい事象を防ぐことは出来るので、コチラもOKとしました。~~

~~ただし、メニューバーに表示されているQBlockerのアイコンをクリックするとアプリケーションが落ちてしまう、という不具合があるっぽいので要注意です。（基本的には触らないので不要といえば不要ですが）~~

### <a name="key-repeat">キーリピートを早くしたい</a>

その他、Karabinerにあった設定でよくある使い方として、キーリピートの間隔を通常では出来ない設定より早くするようにしている人を良く見かける様に思います。

コチラについては、macOSの設定をターミナルから直接変更してやる事で設定変更が可能です。

```shell
# 入力開始までの時間
defaults write NSGlobalDomain KeyRepeat -int 0.02
# リピートの間隔
defaults write NSGlobalDomain InitialKeyRepeat -int 12
```

元に戻す時は下記コマンドを実行します。

```shell
defaults delete NSGlobalDomain KeyRepeat
defaults delete NSGlobalDomain InitialKeyRepeat
```

ただし、**設定後にログアウトをしないと反映しない**様子…面倒くさい…。（だからKarabiner使ってたのだと思いますが）

## <a name="karabiner-elements">Karabiner-Elementsについて</a>

現在macOS Sierraの対応も含めて、後継ソフトの**[Karabiner-Elements](https://github.com/tekezo/Karabiner-Elements)**というソフトを開発している様です。

個人的に必要な機能は出揃いましたので、Karabiner-Elementsを再度使用し始めました。

~~しかし、コチラのソフトの問題点としては、~~

* ~~複合キーのリマップが出来ない~~
* ~~リマップしか出来ない~~
  * ~~旧Karabinerでは複合キーとして利用した場合は通常の`⌘`としても利用できた~~

~~といった点が挙げられると思います。左右のどちらかを`⌘`キーとして残しておく、といった対処を行っている方もいらっしゃるようですが、個人的にはちょっとNGでした。~~


## <a name="macos-sierra">macOS Sierraについて</a>

肝心のmacOS Sierraについてですが、まだ利用し始めたばかりで良く分かりません。~~目玉のSiriもiOSですら利用してないですし…。~~

ただ、SafariのPIP（ピクチャインピクチャ）は個人的に便利です。便利というか、動画見ながら作業出来るというか…。一人で黙々と作業してる時は、BGV流しながら作業してる事が多いので、便利なのです（繰り返し）

ちなみにPIPに対応してるサービスは確認できたものでは、

* YouTube
* ニコニコ動画
* AbemaTV（オンデマンドのみ？）
* Vimeo
* Amazon Prime Video

くらいでした。他にも[Netfilixとかも利用できるらしい？](http://www.redmondpie.com/enable-picture-in-picture-pip-for-netflix-in-macos-sierra-heres-how/)です。（登録してないので実際に試してはいませんが）
他の動画サービスでも利用できるようになると嬉しいですねぇ。


## <a name="reference">参考</a>

* [macOS Sierra で Karabiner が使えない問題にどう対処したか](http://qiita.com/naoya@github/items/56a34be85710f4ed5531)
* [Key repeat broken in macOS Sierra · Issue #687 · mathiasbynens/dotfiles](https://github.com/mathiasbynens/dotfiles/issues/687)
* [macOS SierraでKarabinerの代わりに⌘英かなとdefaultsでキーボードの設定を行う](http://qiita.com/saboyutaka/items/33c82ef1414867d9ef6d)
* [Enable Picture-In-Picture (PiP) For Netflix In macOS Sierra, Here’s How](http://www.redmondpie.com/enable-picture-in-picture-pip-for-netflix-in-macos-sierra-heres-how/)
