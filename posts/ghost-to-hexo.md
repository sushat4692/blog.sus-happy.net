---
title: GhostからHexoに乗り換えてGitHub Pagesに移行してみた
date: 2018-06-04 18:12:50
tags:
  - Ghost
  - Hexo
  - GitHub
thumbnail: "/content/images/2018/06/ghost2hexo.png"
---

WordPress -> Ghostとブログを使っていたのですが、それ以外でサーバをあまり使うことがなかったので、GitHub Pagesに乗り換えようと思い、Hexoを使うことにしました。

VuePressやNuxt.jsもちょっと気になったのですが、サッと移行しようと思ったので、ブログ機能を最初から持っているものを選択しています。


## GhostからHexoのデータへ変換

GhostのエクスポートファイルをNodeで無理やりMarkdownファイルに変換をすることで対応しました。そんなに使う人も居ないと思いますが、GitHubのリポジトリに残してあります。

https://github.com/sushat4692/blog.sus-happy.net/tree/master/convert

とりあえず動くように、と書いてるので結構汚いですが…


## GitHub Pagesへのデプロイ

CNAMEは自動で生成されないので、デプロイ処理の間にCNAMEを作成するようにしました。

```json
"scripts": {
  "deploy": "hexo generate && echo 'example.com' > public/CNAME && hexo deploy"
}
```

~~GitHub PagesもSSL対応したはずなのですが、まだ全リポジトリじゃないそうで、まだこのブログは非対応状態です。早くこないかなぁ。~~HTTPS化しましたヽ(=´▽`=)ﾉ


## 備考

ということで、割とサクッとGhostから移行することができました。GhostのエクスポートファイルがJSON形式だったことも大きいですね。

また折を見てテーマもイジっていきたいところ。
