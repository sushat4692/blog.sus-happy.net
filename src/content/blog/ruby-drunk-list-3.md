---
title: "Ruby on Railsの勉強がてらに呑んだくれリストを作ってみた（その３ Railsアプリ構築編）"
date: 2015-10-01T00:55:20.000Z
updated: 2016-04-08T13:21:05.000Z
tags:
    - Ruby
    - Ruby on Rails
thumbnail: "../../assets/images/2016/04/drunk-list-ss.jpg"
---

[その１](https://blog.sus-happy.net/ruby-drunk-list/)、[その２](https://blog.sus-happy.net/ruby-drunk-list-2/)に引き続き、Ruby on Railsのメモです。（ちなみに~~呑んだくれリストとはこんな感じのモノ~~です。）

今回は、Ruby on Railsのアプリ構築時に調べた・躓いた点についてのメモです。

## 目次

-   [改行コードをbrに変換したい](#nl2br)
-   [JavaScriptが正常に動作しない](#turbolinks)
-   [雑記](#other)
-   [参考](#reference)
-   [シリーズ](#series)

## <a name="nl2br">改行コードをbrに変換したい</a>

いわゆるPHPで言うところの`nl2br`をRailsで行うためには、自分で関数を用意する必要があります。

利用するシーンはそれなりにあると思うので、`application_helper.rb`に記述しておくと、何処でも使えて便利です。

```ruby
def hbr(str)
    str = html_escape(str)
    str.gsub(/\r\n|\r|\n/, "<br />").html_safe
end
```

後はViewのERBファイルで呼ぶ際に下記のとおりに書くだけです。

```ruby
<%= hbr @foo.bar %>
```

## <a name="turbolinks">JavaScriptが正常に動作しない</a>

Rails4からTurbolinksというライブラリが追加されており、ページ間遷移を非同期的に処理するようになっています。そのため、コンテンツの中身だけ入れ替えるようになり、特に何も考えなくても通信量が抑えられるようになっています。

しかし、その仕組みがあるために、いつもどおりにJSの記述をしていると正常に動作しないコトがあるため注意です。

### jQueryの$(document).readyに注意

jQueryを利用する際の常套句である、`$(document).ready`を利用する場合、最初にページを開いた時にしか発火しないため、ページ遷移をした後のページで上手く処理が実行されないコトがあります。

Turbolinksには、次のページを読み完了時に`page:load`というイベントが発火されるので、そちらを利用することで解消するコトが出来ます。

```javascript
// $( function() {} ); を下記のように書き換える
$(document).on("ready page:load", function () {
    // ほげほげ
});
```

CoffeeScriptの場合はこんな感じ。

```coffee
$(document).on 'ready page:load', ->
    // ほげほげ
    return
```

### 最終手段

最終手段として、Turbolinksを切ってしまうという手もあります。
アプリケーションを生成する際に、`--skip-turbolinks`オプションを追加します。

```bash
rails new app_name --skip-turbolinks
```

また、既に作成済みのアプリから除外する際には、[コチラの参考サイトの方法](http://qiita.com/kazz187/items/12737363d62b9c91993c)で対応できるかと思います。

とは言え、元々はパフォーマンスを高めるライブラリなので、使える時は使っていきたいですね。

## <a name="other">雑記</a>

ひとまずは、環境構築からアプリ制作までの一通りを試してみました。

PHPのFWでも同様にコマンドから開発の補助をしてくれるモノはたくさんありますが、一際補助される範囲が広いように感じました。
特にscaffoldは一通りの画面まで揃えてくれるので、簡易的なものであればサクッと用意できると感じます。

Rubyならではのシンプルな記法も、慣れるまでは大変ですが慣れてしまえば簡易的に記述できるのは面白いですね。

また、引き続きRubyについても試していきたいと思うので、気づいたことがあれば残していこうと思います。

## <a name="reference">参考</a>

-   [すずやん::blog: railsで改行コードをに置き換える](http://suzuyan.blogspot.jp/2013/09/rails.html)
-   [Ruby – Turbolinksさんと上手く付き合う10の方法 – Qiita](http://qiita.com/seri_k/items/164accd9ef8ddb4a942e)
-   [Rails – Turbolinksをオフしないためにやった事 – Qiita](http://qiita.com/saboyutaka/items/bcc0966313c6f7399a6e)
-   [Ruby – Rails 4 で turbolinks をオフにする方法 – Qiita](http://qiita.com/kazz187/items/12737363d62b9c91993c)

## <a name="series">シリーズ</a>

-   [その１ 「Rails環境構築編」](https://blog.sus-happy.net/ruby-drunk-list/)
-   [その２ 「Unicorn+Nginx編」](https://blog.sus-happy.net/ruby-drunk-list-2/)
