title: "HTML5で追加されたフォームの新機能を試してみた"
date: 2011-01-26T23:43:22.000Z
updated: 2011-01-26T23:47:02.000Z
tags: 
  - HTML
  - html5
---


HTML5から実装されるフォームの要素が多数あり、事前調査とスマートフォンサイトにも使えそうなことから、ちょこちょことメモを残しておきます。


## input typeの追加属性

inputタグのtype属性に、要素が幾つか追加されました。追加された項目については、[この辺り](http://www.html5.jp/tag/elements/input.html)で網羅されているので、そちらを参照ください。

中でも、number・date・tel・email等はお問い合わせフォームにも良くある項目なので、実装された時には活用したいですね。

また、rangeの様に入力形式が大幅に変わったものもあります。

<input type="range"></input>※対応していないブラウザでは、ただのテキスト入力欄になります。

JavaScriptを利用しないと作れなかったスライドバーでの入力方法は、色々な使い道がありそうです。


## placeholder属性

サンプルとして予め表示させておき、フォーカス時に非表示になるテキストを追加できるplaceholder要素が実装されます。

この機能についても、以前まではJavaScriptを利用して実装しており、HTMLだけで完結できるので、単純に工数の削減が見込めそうです。

<input placeholder="こんな感じに表示されます。" size="50" type="text"></input>


## required・pattern属性

まだOperaのみの対応となりますが、必須入力、正規表現によるパターン制限をHTMLのみでかけることが出来ます。

サーバサイドのプログラムか、即時反映であればJavaScriptが必要だった入力チェックですが、HTMLだけで完結できるのはものすごい便利そうです。

フォームだけでもまだまだ追加された要素は沢山ありますが、とりあえずサクッと調べてみて、気になったものを挙げてみました。  
 調べながら思ったことは、HTML5が世に出回った時にはフォームの組み方、入力形式が変わっているかもしれないなぁと感じました。


## 参考リンク集

- [input 要素 – フォーム – HTML要素 – HTML5 タグリファレンス – HTML5.JP](http://www.html5.jp/tag/elements/input.html)
- [【HTML5】HTML5で追加されたformの新要素をいろいろなブラウザで試してみた : アシアルブログ](http://blog.asial.co.jp/686)
- [【レビュー】HTML5 search、WebKitブラウザは使用注意 | エンタープライズ | マイコミジャーナル](http://journal.mycom.co.jp/articles/2010/09/10/input-type-search-on-webkit/index.html)


