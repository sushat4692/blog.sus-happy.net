---
title: "Facebookページのタブ追加ブックマークレット"
date: 2012-01-11T00:56:02.000Z
updated: 2016-04-03T14:50:41.000Z
tags: 
  - Facebook
  - ブックマークレット
---

Facebookページを作成する際に、新規タブページを作る場合、アプリケーションを作成してページに読み込む操作を行うのですが、少し前からページに読み込む際に利用していた「アプリのプロフィールページ」が表示されなくなってしまいました。

調べてみると、[別の方法でタブページを追加する方法](http://dollsent.jp/wordpress/?p=10225)は分かったのですが、毎回URLとAppIDをコピペするのが面倒臭い、という事でブックマークレットを作成しました。

百聞は一見に如かず、という事で最初にブックマークレットを置いておきます。

<a href="javascript:(function(){function e(a,b){return a.getElementsByTagName(b)}function d(a,b){for(i=0;i<a.length;i++){var c=a[i].className.split(' ');for(var d=0;d<c.length;d++){if(c[d]==b){return a[i]}}}return false}var a=document.getElementById('developerAppDashboardContainer');var b=d(e(a,'td'),'contentPane');var c=d(e(b,'div'),'fcb');window.open('http://www.facebook.com/add.php?api_key='+c.innerHTML+'&pages=1')})()">このリンクをブックマーク</a>


## 使い方

Facebook Developersのアプリ一覧ページを開き、Facebookページに登録したいアプリをクリックし、右カラムに詳細情報が表示されている状態にします。

その状態でブックマークレットをクリックすると、新しいタブかウィンドウが表示されますので、アプリケーションの追加先を該当のFacebookページを選択、「追加する」ボタンをクリックすると完了です。


## 動作確認環境

- Google Chrome 16
- Firefox 3.6、8、9
- Internet Explorer 9
- Opera 11
- Win Safari 5

WindowsのSafariやChromeが動いているので多分MacSafariも動くんじゃないのかな？と思います。

ただ、現状プロフィールページが無くなってしまっただけで、別の方法が生まれたり、DOMの構造が変わったりしてしまうとこのブックマークレットも使えなくなってしまうので、一時的な利用になりそうな気がします。


## 参考サイト

- [Facebookページ作成中に「アプリのプロフィールページを見る」が表示されない時の対処法 – バス釣りブログ バス釣りとWordPress](http://dollsent.jp/wordpress/?p=10225)