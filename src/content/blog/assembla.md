---
title: "無料で非公開のリポジトリサービスを使える「assembla」を使いはじめてみた"
date: 2012-07-10T22:07:50.000Z
updated: 2016-04-03T14:10:32.000Z
tags: 
  - Git
  - SVN
---

個人的に作っているモノについては基本的にはオープンにしようとしているのですが、色々な事情でどうしても外に出せない、でもリポジトリサービスを使いたい、しかし自分で環境を作るのが<del>面倒</del>大変。

そんなことがあったので、調べてみました。


## サービス比較

上記に加えて、「無料」という条件を加えて調べてみました。

<table class="alignright"><thead><tr><td> </td><th>[Backlog](http://www.backlog.jp/)</th><th>[unfuddle](https://unfuddle.com/)</th><th>[assembla](http://www.assembla.com/)</th></tr></thead><tbody><tr><th>容量</th><td>100MB</td><td>200MB</td><td>1GB</td></tr><tr><th>ユーザ数</th><td>10人</td><td>3人</td><td>無制限</td></tr><tr><th>プロジェクト数</th><td>4つ</td><td>2つ</td><td>無制限</td></tr><tr><th>リポジトリ</th><td>svn/Git</td><td>svn/Git</td><td>svn/Git</td></tr><tr><th>その他特徴</th><td>その他サービスが充実</td><td>AWSへの  
バックアップ機能</td><td>無料プランは  
リポジトリのみ</td></tr></tbody></table>ざっくりと試した感じだったので、間違っている所があるかもしれませんが、こんな感じです。


## 雑感

個人的にはGitでリポジトリサービスを使えればよかったので、容量が大きく、プロジェクトも増やすことが出来る「assembla」を選択しました。

「Backlog」だとUIも見やすくWikiやバグトラッキング等のツールが用意されていたので、複数人でプロジェクトを管理する場合は有効な感じがします。

「unfuddle」については容量もそこそこあるのでとりあえずプロジェクト管理を試してみたい、て方に良さそうな気がしました。  
 AWSへのバックアップがあったりするのも強みですね。


## 参考

- [suz-lab – blog: AssemblaでプライベートSVN](http://blog.suz-lab.com/2010/06/assemblasvn.html)
- [Subversionサービス比較：Backlog・assembla・unfuddle Kawanet Tech Blog/ウェブリブログ](http://kawa.at.webry.info/201002/article_4.html)
- [Git が Backlog にやって来る ヤア！ヤア！ヤア！ | Backlogブログ](http://www.backlog.jp/blog/2012/05/git-backlog.html)


## 追記 12/07/21

[BaclogのGitが追加](http://www.backlog.jp/blog/2012/07/git-release.html)されたようなので表を修正しました。

容量は少なくなりますがUIが分かり易いのでBacklogに移ろうかなぁ…なんて考え中です。