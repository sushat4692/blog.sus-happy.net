title: "Google Font APIを使ってみた"
date: 2010-05-23T17:24:28.000Z
updated: 2016-04-03T16:25:51.000Z
tags: 
  - Google
  - フォント
---

先日、Googleが発表したGoogle Font APIを試しに使ってみました。

適用しているのは、一番上の「SUSH-i LOG」の部分と、各記事のタイトルで、「Droid Serif」というフォントを利用しています。

利用方法もかなり簡単。外部CSSを読み込むように、head要素内に、

```html
<link href='http://fonts.googleapis.com/css?family=Droid+Serif' rel='stylesheet' type='text/css'>
```

と記述し、適用させたい箇所に通常通りにfont-familyで指定するだけです。

```css
h1 {
	font-family:'Droid Serif';
}
```

読み込み速度も気にならない程度、フォントの数はまだそこまでありませんが今後に期待です。

ただ、日本語を対応するとなると、容量が膨大になるので、どうなるかが気になります。それも期待。