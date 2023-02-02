---
title: "React.jsの勉強も兼ねて某RPG風レベルアップカウンターを作ってみた"
date: 2015-09-08T23:24:37.000Z
updated: 2016-04-08T13:24:04.000Z
tags:
  - JavaScript
  - React
thumbnail: "/content/images/2016/04/counter-image.jpg"
---


Facebookが開発を行っているReact.jsを勉強しておきたいなぁと思っていながら大分経ってしまいましたが、ちょっと先週末に簡単なカウンターを必要だったので、土曜日にReact.jsを使って作ってみました。


## 作る

今回はFluxまでには手を付けず、[コチラのスライドのデモ](http://azu.github.io/slide/react-meetup/flux.html)を参考にさせていただきました。（Fluxっぽい作りにはなっていますが、Dispatcherの代わりに簡易的なEventEmitterを噛ませているようです。）

後は、キーボードのイベント追加したり、効果音を鳴らしたりする処理を加えたりと、大きな機能変更はしていなかったりするので、実はそこまで書くことが無かったりします…。

~~ということで、出来上がったものがコチラ。~~  
 （アクセス時に名前の入力が求められます。）

[8×8 ドットのフリーフォント「美咲フォント」](http://www.geocities.jp/littlimi/misaki.htm)をインストールしているPCで閲覧していただくと、さらに某RPGっぽい雰囲気が感じられると思います。


## 雑感

JavaScriptの中にHTML書くのはちょっと気持ち悪いですが、JSX楽しいです。

ただ、まだ参考にしたデモから追記をした程度なので、詳しい部分が理解できておらず具体的な説明などやポイントまでは書くことが出来ませんが、次回は1から書いてみて、Fluxにも手を出してみたいなぁと思います。

またちなみにですが、実際に使った現場ではまさにそのまんま某RPGっぽい画像とSEを集めてきましたが、版権的にやはりちょっと怖いので、今回のデモは差し替えています。


## 参考サイト

- [10分で実装するFlux](http://azu.github.io/slide/react-meetup/flux.html)


## 素材利用

- [零式マテリアル 様](http://www.zero-matter.com/) （レベルアップSE）
- [魔王魂 様](http://maoudamashii.jokersounds.com/) （文字送り、ステータス開閉SE）
- [するめを食べながら 様](http://blog.livedoor.jp/ata_rime/archives/39001614.html) （背景素材）
- [Little Limit 様](http://www.geocities.jp/littlimi/) （8×8 ドット日本語フォント「美咲フォント」）


