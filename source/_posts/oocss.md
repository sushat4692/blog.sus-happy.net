title: "オブジェクト指向CSS : OOCSSについて"
date: 2010-06-04T02:05:15.000Z
updated: 2016-04-03T16:17:57.000Z
tags: 
  - CSS
  - HTML
---

英語の記事なので、具体的にどんな内容が書かれているか理解できていませんが、[オブジェクト指向CSS（Object Oriented CSS: OOCSS）について書かれた記事](http://www.sitepoint.com/blogs/2009/06/16/first-look-object-oriented-css/)を読んで、CSSの記述方法について、もしかしたらOOCSSとは違う考えなのかもしれませんが、少し考えてみました。

これまで、スタイルを付与したい箇所にid/classを指定し、それぞれに固有のスタイルを当てはめていましたが、

- Web上の表現として良く利用するスタイル
- そのサイト内でよく利用するスタイル
- そのページ内でよく利用するスタイル
- 指定の箇所でしか利用しないスタイル

に分けられるのでは無いかと考え、それらについて定義したスタイルを「使い回す」だけでコーディングを行って、効率が良いのか試しています。

具体的にどのような記述を行っているかは以下の通り。


## Web上の表現として良く利用するスタイル

ここは、どこまで含まれるのか模索中ですが、今のところ以下のようなスタイルをすべてのページで読み込むようにしています。

```css
/* リンク */
a {
	text-decoration:underline;
}
a:hover {
	text-decoration:none;
}
a.mr,
.mr a {
	text-decoration:none;
}
a.mr:hover,
.mr a:hover {
	text-decoration:underline;
}

/* 配置 */
.left {
	text-align:left !important;
}
.right {
	text-align:right !important;
}
.center {
	text-align:center !important;
}

.fleft {
	float:left;
}
.fright {
	float:right;
}
```

どのようなサイトでも使われている、リンク装飾、文字配置についてを指定して、サイトによってはリンク色などより詳細な値を上書きしています。


## そのサイト内でよく利用するスタイル

サイトによって余白のとり方などに特徴があり、数値が同じ箇所については、ここで指定しすべてのページで読み込むことで「使い回す」事が可能です。

例えば、以下のようなスタイルを用意しておきます。

```css
.topMg {
	margin-top:-20px;
}
.btmMg {
	margin-bottom:40px;
}
```

上記二つのスタイルで、

1. 指定要素の上に20px余白
2. 指定要素の下に20px余白
3. 指定要素の上に40px余白
4. 指定要素の下に20px余白

の4通りを作り出すことが可能です。

```html
<div id="preview">
	<!-- 指定要素の上に20px -->
	<p class="btmMg">一つ前の要素</p>
	<p class="topMg">指定要素</p>

	<!-- 指定要素の下に20px -->
	<p class="topMg">指定要素</p>
	<p class="btmMg">一つ後の要素</p>

	<!-- 指定要素の上に40px -->
	<p class="btmMg">一つ前の要素</p>
	<p>指定要素</p>

	<!-- 指定要素の下に40px -->
	<p class="btmMg">指定要素</p>
	<p>一つ後の要素</p>
</div>
```

上記の考えで、同様に「そのページ内でよく利用するスタイル」も定義を行い、最後に固有のスタイルを付与していきます。

ある程度のレイアウトでしたら、固有のスタイルを定義することなくHTMLを編集するだけで可能なので、効率が上がるのでは無いかと考えていますが…

明確な答えが出てきたらまた書くことにします。