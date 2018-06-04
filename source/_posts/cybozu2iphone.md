title: "サイボウズからiPhoneへの同期をしてみた"
date: 2010-11-12T01:04:09.000Z
updated: 2010-11-12T01:04:09.000Z
tags: 
  - iPhone
  - MobileMe
  - Outlook
  - サイボウズ
---


サイボウズからiPhoneへ同期が出来たら、わざわざSafariで閲覧しなくても良いので便利そうだなぁと思い立って、ちょっと調べて実験を行ってみました。

今回同期の順路としては、サイボウズ＞Outlook＞MobileMe＞iPhoneを経由しています。

[Kunai Lite](http://products.cybozu.co.jp/kunai/iphone/lite/)を利用すればこんな面倒なこともないと思うのですが、リモートサービスに契約しないといけないので、ちょっと面倒ですが上記の方法で試してみました。


## サイボウズからOutlook

まずサイボウズからOutlookへ同期を行いました。今回はシェアウェアですが、お試し版があったので、[AIVY Sync for サイボウズ Office](http://www.aivy.co.jp/download/index.html)を利用しました。

インストール後、サイボウズのURLとユーザID/PASSを入力するだけで同期出来るようになるのでかなり便利なのですが、9,800円。悩みます。

他に自分では試していませんが、[サイボウズからOutlookへ同期するためのマクロ](http://happiese.blog123.fc2.com/blog-entry-268.html)が公開されていますので、こちらを利用すれば無料で同期することが出来ます。


## OutlookからMobileMe

Googleカレンダーを経由して、Google Syncを利用した同期方法もあると思いますが、自分が<del datetime="2010-11-11T15:38:09+00:00">紛失した時に必要性を感じたので、</del>MobileMeに契約していることもあり、MobileMeを経由して同期を図ることにしました。

この間はAppleが提供している[MobileMeコントロールパネル](http://support.apple.com/kb/DL769?viewlocale=ja_JP&locale=ja_JP)をインストールすれば簡単に同期を取ることが出来ます。


## MobileMeからiPhone

この部分については言わずもがなですが、iPhoneのアカウントにMobileMeアカウントを追加し、カレンダーを同期することで、iPhoneのカレンダーをMobileMeのカレンダーと同期させることが可能です。


## まとめ

意外と簡単に実現することが出来ましたが、経由地点が多いのと、途中でPCを介しているのでPCを立ち上げないとサイボウズまで同期を行うことが出来ません。

やっぱりリモートサービスを契約してKunai Liteを使うとか、Safariで直接開いたりしたほうが良いのかもしれません…。

ただ、何気にサイボウズとOutlookを同期すると便利かも、と感じました。


