title: "CSSの拡張メタ言語「LESS」についてちょっと調べてみた"
date: 2012-07-02T23:20:22.000Z
updated: 2016-04-03T14:14:06.000Z
tags: 
  - CSS
  - LESS
---

前々から「[LESS](http://lesscss.org/)」という名前や、何となくどんなことが出来るのかについてはある程度知っていたのですが、環境を構築するのが面倒で触っていませんでした。

そんな中ちょっと、LESSのビルド環境を構築することがあったので、ついでに調べて使ってみる事にしました。


## LESSについて

LESSとは、CSSの拡張メタ言語で、簡単に説明するとCSSでこんなことがしたい…！という機能を加えた独自の言語です。

こういった拡張メタ言語については、同じCSSには「[SCSS(Sass)](http://sass-lang.com/)」や、HTMLの「[Haml](http://haml.info/)」という言語が存在します。

また、LESSのコンパイル？はJavaScriptで実行するので、Node.jsを使ってサーバサイドで行うだけではなく、JavaScriptを読み込んでクライアントサイドで行ったり出来るのも強みですね。

LESSとSCSS(Sass)では記述が若干違うのですが、今回はLESSに焦点を当ててメモを残していきます。


## LESSの記法

### 変数

LESSでは変数を利用することで、一度書いたパラメータを複数の要素に与えたり、数値計算によって変化を持たせることが可能です。

```css
@green: #00AA00;
@light-green: @green + #555;

.greenBox {
	background: @green;
}
.lightGreenBox {
	background: @light-green;
}
```

上の様に記述すると、CSSでは下記の様に出力されます。

```css
.greenBox {
	background:#0a0;
}
.lightGreenBox {
	background:#5f5;
}
```

計算できるのは魅力的ですね。  
 ちょっとサイズを変えたいだけなのに、色々な要素のサイズを調整しないといけない、という組み方になった場合に重宝しそうです。

また、下記のように変数名を変数で取得することも出来るみたいです。

```css
@foo: "bar";
@baz: "foo";

.hoge {
	content: @@baz;
}
```

CSSに変換すると･･･。

```css
.hoge {
	content: "bar";
}
```

### ミックスイン

ミックスインとか言われると、オブジェクト指向言語を触っていないのでパッとしませんが、よく使う内容を予め用意しておく、と言うような感じでしょうか。違っていたらゴメンナサイ･･･。

使い方と使い道に関しては以下のような感じです。

```css
.borderRadius {
	border-radius: 5px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}

#main {
	width: 700px;
	float: right;
	.borderRadius;
}
#side {
	width: 200px;
	float: left;
	.borderRadius;
}
```

CSSに変換すると･･･。

```css
#main {
	width: 700px;
	float: right;
	border-radius: 5px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}
#side {
	width: 200px;
	float: left;
	border-radius: 5px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}
```

と言う具合に、毎回ベンダプレフィックスを書くのが面倒、と言う時に使えたりします。  
 上の例で言うと正直クラスを用意して当て込んだ方が分かりやすいと思いますが、ミックスインの利点として「引数」を与えることが出来ることが挙げられます。

### ミックスイン（引数）

例えば先程の例で、「#main」の時は10pxの角丸にしたい場合･･･。

```css
.borderRadius (@radius) {
	border-radius: @radius;
	-moz-border-radius: @radius;
	-webkit-border-radius: @radius;
}

#main {
	width: 700px;
	float: right;
	.borderRadius(10px);
}
#side {
	width: 200px;
	float: left;
	.borderRadius(5px);
}
```

CSSに変換すると･･･。

```css
#main {
	width: 700px;
	float: right;
	border-radius: 10px;
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
}
#side {
	width: 200px;
	float: left;
	border-radius: 5px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}
```

と言う感じに、値を渡すだけで書き分けてくれます。  
 また、引数に初期値を渡すことが出来ます。

```css
.borderRadius (@radius: 5px) {
	border-radius: @radius;
	-moz-border-radius: @radius;
	-webkit-border-radius: @radius;
}

#main {
	width: 700px;
	float: right;
	.borderRadius(10px);
}
#side {
	width: 200px;
	float: left;
	.borderRadius;
}
```

CSSにすると、前例と同じ内容が出力されます。

### その他

他にも引数の値によって振り分けることが出来たり、関数が色々と用意されていたり、ネストしてグループ化したり出来るようなのですが、今回は触りだけ･･･。  
 またちょこちょこ触ってみるようにします。

[公式のドキュメント](http://less-ja.studiomohawk.com/#docs)でそのあたりについても紹介されています。


## 参考

- [LESS « The Dynamic Stylesheet language](http://lesscss.org/)
- [LESS – The Dynamic Stylesheet language（日本語）](http://less-ja.studiomohawk.com/)
- [CSS拡張メタ言語「SCSS(Sass)」と「LESS」の比較 – (DxD)∞](http://dxd8.com/archives/217/)