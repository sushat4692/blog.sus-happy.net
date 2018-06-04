---
title: "記事内のコードをGistにしようと思ってSublime TextにGistプラグインを入れてみた"
date: 2014-02-08T15:17:17.000Z
updated: 2016-04-03T11:09:47.000Z
tags: 
  - Sublime Text
---

記事内に表示するコードを今までは[Google Code Prettify](https://code.google.com/p/google-code-prettify/)を使っていたのですが、サーバのリソースを少しでも減らそうと思い、Gistを利用してコードを表示する方法に変えてみることにしました。

加えてGistサイト内でも追加は出来るのですが、Sublime Textにもプラグインがある様なので、せっかくなので使ってみることにしました。


## Sublime Text Gistプラグイン

まずはPackage Controlをインストールしておきます。インストール方法は[コチラ](https://sublime.wbond.net/installation)が参考になると思います。

Package Controlがインストールできたら、Gistプラグインを探します。他のプラグインと同様に、「**Cmd+Shift+P（Winの場合はCtrl+Shift+P）**」で開き、「**Gist**」と入力すると見つかると思いますのでインストールします。

インストール後に設定ファイルを編集します。設定ファイルは、「**Preferences -> Package Settings -> Gist -> Settings User**」をクリックすると編集できます。

入力する内容は下記のような感じ。（ついでにGist埋め込みの実験）

```javascript
{
    "token": "**********"
}
```

tokenの発行については、GitHubにログイン後、「**Account Settings -> Applications**」のページ内の、「**Personal Access Tokens**」がそれにあたります。  
 「**Create new token**」をクリックして、自分が分かるように適当な名前を付けて作成すると、**登録時のみ表示**されます。ページ遷移すると表示されなくなりますので注意。

設定完了後にSublimeText上からGistにアクセス出来るようになります。Package Controlから「**Gist**」と入力すると、メニューが並ぶはずです。


## WordPressにGistのコードを貼る

Gistのコードを貼る場合、発行されているScriptタグを貼ればOKなのですが、WordPressの記事内ではショートコードを利用する方法もあります。  
 今回は「[Embed GitHub Gist](http://wordpress.org/plugins/embed-github-gist/)」のプラグインを利用させていただきました。

このプラグインを利用した場合、下記のような記述が可能となります。

```shell
// ID指定
[gist id=8877382]
// URL指定
[gist]http://gist.github.com/8877382[/gist]
```

自動的にScriptタグに変換してくれるので便利ですね。


## 参考

- [Sublime Text 2からGithub:Gistへ投稿できるプラグインの使い方 | offsidenowの日常を綴ったブログ](http://offsidenow.phpapps.jp/archives/898)

## 追記

Gist側から発行されるHTMLタグが変化したのでやめました。