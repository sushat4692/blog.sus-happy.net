title: "Middlemanを試してみた"
date: 2014-07-23T21:05:34.000Z
updated: 2016-04-03T10:59:09.000Z
tags: 
  - Middleman
  - Ruby
---

静的サイトジェネレータの一つである[Middleman](http://middlemanapp.com/jp/)を使う機会があったのでメモ。

[Jekyll](http://jekyllrb.com/)やら、[Octpress](http://octopress.org/)やら、黒い画面を使わない（らしい）[Phest](https://github.com/chatwork/Phest)やら色々ありますが、今回は<del datetime="2014-07-23T03:49:04+00:00">なんとなく</del>Middlemanにしました。

Rubyの記法も何となく覚えられるので一石二鳥…なのだろうか。


## Middlemanについて

RubyのフレームワークのSinatoraベースで作られていて、ERBだけじゃなくてHAMLやらSlimやらStylusやらSASSやらCofeescriptやら色々対応しているみたいです。  
 この辺りは他の静的ジェネレータでも恐らく一緒でしょうか？（使ったこと無いので分かりませんが…）

YAMLベースでテンプレート側に変数を渡す事が出来るので、プログラマブルに構築する際は結構便利な気がします。

ちなみに、インストールから初期設定については日本語ドキュメントが充実していて、[公式サイトでかなり丁寧にかかれています](http://middlemanapp.com/jp/basics/getting-started/)ので、そこで事足りると思います。

後は個人的に詰まった所。


## 相対パスにする

特に設定をしない場合は、ページリンクや読込のパスが絶対パスになりますが、最終的に公開する際にサブディレクトリにアップロードしたい時には面倒なことになるので、相対パスにしたい時があるかと思います。

そんな時もconfig.rbに二行加えるだけ。

```ruby
# リンクを相対化
set :relative_links, true
# ファイル読込を相対化
activate :relative_assets
```

参考サイト：[Middlemanで全部相対パスにする | Border/memo](http://brdr-mmrndm.tumblr.com/post/80869594552/middleman)


## ブロックリンクを作成する

テキストリンクを作成する際は、

```ruby
<%= link_to 'Link Text', '/path/to.html' %>
```

のように記述しますが、aタグ内に色々詰め込みたい時には不便です。  
 だからといって直にHTMLタグでパスを書いてしまってはジェネレータを使う利点が損なわれてしまうので、調べてみたところ下記のような記法がるようです。

```ruby
<% link_to '/path/to.html' do %>
aタグ内に入れたい要素
<% end %>
```

参考サイト：[Railsのlink_toでブロックごと囲む方法 – リア充爆発日記](http://d.hatena.ne.jp/ria10/20120215/1329297459)


## パーシャルに変数を渡す

同じような構造のHTMLを作る時に便利なパーシャルですが、PHPのrequireみたいに変数を引き継ぐわけではありません。むしろ、コチラの挙動が普通でしょうか？  
 ということで、partialに追記することで渡せます。

下記のように記述すると、 source/path/_to.erb に、foo という変数名で、 bar の値を引き継ぎます

```ruby
<%= partial "path/to", :locals => { :foo => bar } %>
```

しかし、[公式サイトにしっかり記載がありました](http://middlemanapp.com/jp/basics/templates/#%83p%81%5B%83V%83%83%83%8B)。<del datetime="2014-07-23T11:47:53+00:00">ちゃんとよく読みましょう。</del>


## 参考

- [Middleman: 効率的な作業を可能にする Ruby 製の静的サイト生成ツール](http://middlemanapp.com/jp/)
- [Middlemanで全部相対パスにする | Border/memo](http://brdr-mmrndm.tumblr.com/post/80869594552/middleman)
- [Railsのlink_toでブロックごと囲む方法 – リア充爆発日記](http://d.hatena.ne.jp/ria10/20120215/1329297459)