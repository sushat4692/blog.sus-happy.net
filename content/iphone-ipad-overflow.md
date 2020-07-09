---
title: "iPhone、iPadでのoverflow:scroll/autoの動作について"
date: 2011-01-21T02:58:15.000Z
updated: 2016-04-03T15:21:39.000Z
tags: 
  - CSS
  - HTML
  - iPhone
  - スマートフォン
---

ある案件で、divタグにoverflow:autoを指定し、スクロールバーを表示される様な指定をしていたのですが、iPadで確認を取った時に、スクロールバーが表示されていない事を教えてもらい、iPhoneでも同様の状態になっている事に気づきました。

また、通常のスクロールのようになぞってもスクロールされず、中のコンテンツを確認することが出来ませんでした。

何か方法でもあるのかと調べてみたところ、「[メモ: iPad（iPhone）の困った仕様](http://hcondo2000.blogspot.com/2010/06/ipadiphone.html)」で、「二本指」でなぞることでスクロールする事が分かりました。

説明書が無い、また、二本指でのスクロールはあまり使わないことから、中々気づきにくい操作であるような気がするので、iPhone向けのコンテンツなら尚更、ページ内に説明文が必要な感じを受けました。

「直感的」な操作であるタッチパネルであっても、今回であればページ内の一部のコンテンツをスクロールさせるような、複雑な操作についてはどうしても特殊な操作が必要になりますね。

他のスマートフォンではどうなんでしょう？もうちょっと調べる必要がありそうです。

## 追記 2011年10月12日

地味に見られていて、解決策も投じてなかったので少し追記をしておきます。

### Androidの動作について

Andoroidは`overflow:auto;`に対応していないようで、二本指でスクロールしても動かないようです。  
[http://code.google.com/p/android/issues/detail?id=2118](http://code.google.com/p/android/issues/detail?id=2118)

### JavaScriptを使った対策

やはり二本指で操作をさせるのは、感覚的にも操作的にも分かり辛い事を考慮するとCSSのみでの対応は厳しいようで、既にJavaScriptのライブラリが公開されていました。  
その中で目に留まった二つを試しに使ってみました。

<dl><dt>[Skroll.js](http://5509.me/log/skroll)</dt><dd>方向は縦方向のみ対応しており、フリックでスクロールバーが表示されます。  
 注意書きにも記載されていますが、非力なスマホだと動作に不安定な箇所が出る可能性があるようです。</dd><dt>[jQuery.flickable](http://lagoscript.org/jquery/flickable)</dt><dd>縦横に対応していますが、スクロールバーはありません。  
 また、現バージョン（1.0b3）では、jQuery1.6.xに対応していないようです。</dd></dl>[デモはこちら](http://demo.sus-happy.net/sp/overflow/horizontal.html)

どちらにも一長一短があり甲乙付けがたいですが、長所が分かりやすいので場面場面で使い分けていくと良さそうな感じを受けました。

## さらに追記 2011年11月01日

どうもiOS5より、iPhone Safariで一本指でスクロールが出来るようになったみたいです。

参考：[iOS5のMobile Safariから使えるようになったHTML5・CSSを試してみました【前編】 – くらげだらけ（くだくらげのBLOG）](http://d.hatena.ne.jp/kudakurage/20111025/1319475131)

また、「`-webkit-overflow-scrolling:touch;`」を指定すると、CSSだけで惰性スクロールが実装できるみたいで、「iPhoneだけ」ならJavaScriptを実装しなくても良さそうですね。

[デモも用意してみた](http://demo.sus-happy.net/sp/overflow/css-scroll.html)ので、試してみてください。