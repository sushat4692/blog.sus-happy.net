title: "jQueryのCDNについて色々"
date: 2012-08-08T09:24:59.000Z
updated: 2016-04-03T14:06:18.000Z
tags: 
  - CDN
  - jQuery
---

テスト開発に便利だったり、単純に負荷を減らしたり高速化の目的で使われているCDNですが、自分で使う事も度々あるので、jQuery本体やプラグインを、CDNで使えるものが無いか調べてみました。


## CDNとは

CDNとは、コンテンツデリバリネットワーク（Content Delivery Network）の略で、データを配信する際に、一か所に固めずに分散することで負荷を抑えて安定してやり取りを行う手法、という感じでしょうか。  
[Wikipedia](http://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%83%87%E3%83%AA%E3%83%90%E3%83%AA%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF)先生によると、こんな感じみたいです。

> 90年代以降ネットが一般に普及するにつれ、大手サイトからのリンクやテレビといった他メディアからのリンクにより、通常想定されていない大量のユーザーがサイトへ集中し、反応が遅くなったり、まったく応答不能になること（フラッシュクラウド効果）が多くなってきた。このような現象に対処する場合、サーバを一ヶ所だけに置くのではなく、地理的・バックボーン的に分散させるのが効果的である。同一のコンテンツを多くのサーバでミラーする手段としては、単純なDNSラウンドロビンから、P2P、地理情報を加味した複雑な配信技術までさまざまなものがあり、研究、実用化がなされている。

Wikipediaを見るまでそうだと思っていなかったのですが、BitTorrentの様なネットワークもCDNの一種なんですね。


## jQueryのCDN

jQuery本体のCDNは現在(2012.8.8現在)3つ存在しています。

<dl>
<dt>Google Ajax API CDN</dt>
<dd><a href="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js</a></dd>
<dt>Microsoft CDN</dt>
<dd><a href="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js">http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js</a></dd>
<dt>jQuery CDN</dt>
<dd><a href="http://code.jquery.com/jquery-1.7.2.min.js">http://code.jquery.com/jquery-1.7.2.min.js</a></dd>
</dl>

それぞれ各バージョンの番号を変更する事でその時点のコードを取得することが出来ます。

また、GoogleとjQuery CDNでは下記の様に書くことで最新バージョンを取得することが出来るようです。

<dl>
<dt>Google Ajax API CDN</dt>
<dd><a href="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js">https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js</a></dd>
<dt>jQuery CDN</dt>
<dd><a href="http://code.jquery.com/jquery.min.js">http://code.jquery.com/jquery.min.js</a></dd>
</dl>

Microsoftはこういった機能はあるのでしょうか？とは言っても勝手にバージョン上がってても困るわけですが…。


## プラグインのCDN

その他各種プラグインのCDNも存在しています。  
 jQuery UIについてはGoogleとMicrosoftに存在していますが、その他はMicrosoftからのみの様です。

### jQuery UI

<dl>
<dt>Google Ajax API CDN</dt>
<dd>
<ul>
<li><a href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js">https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js</a></li>
<li><a href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/base/jquery-ui.css">http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/base/jquery-ui.css</a></li>
</ul>
</dd>
<dt>Microsoft CDN</dt>
<dd>
<ul>
<li><a href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.21/jquery-ui.js">http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.21/jquery-ui.js</a></li>
<li><a href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.21/themes/base/jquery-ui.css">http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.21/themes/base/jquery-ui.css</a></li>
</ul>
</dd>
</dl>

### その他Microsoftで配信しているプラグイン

- jQuery Mobile
- jQuery Validation
- jQuery Templates
- jQuery Cycle
- jQuery DataTables


## その他

今回はjQuery関連のみの紹介でしたが、その他にもAngularJSやDojo、Ext、prototype.jsなど、色々とCDNで配信していますので、一度使い勝手を試してみる、という使い方も出来そうな気がしますね。

GoogleやMicrosoftのCDNで何が配信されているかは、参考のリンク先をご覧ください。


## 参考

- [コンテンツデリバリネットワーク – Wikipedia](http://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%83%87%E3%83%AA%E3%83%90%E3%83%AA%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF)
- [ふじこのプログラミング奮闘記](http://blog.neo.jp/dnblog/index.php?module=Blog&action=Entry&blog=pg&entry=2776&rand=5e0cc)
- [Downloading jQuery – jQuery JavaScript Library](http://docs.jquery.com/Downloading_jQuery)
- [Google Libraries API – Developer's Guide – Make the Web Faster — Google Developers](https://developers.google.com/speed/libraries/devguide)
- [Microsoft Ajax Content Delivery Network – ASP.NET Ajax Library](http://www.asp.net/ajaxlibrary/cdn.ashx)