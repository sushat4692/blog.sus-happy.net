title: "JavaScript非同期ローダーを試しに作ってみた"
date: 2012-01-28T00:17:43.000Z
updated: 2016-04-03T14:47:52.000Z
tags: 
  - JavaScript
---

バラバラのJavaScriptいっぱい読み込むときに、最近のモダンブラウザは「async」属性を使えばバックグラウンドで読んでくれるそうなのですが、そうでない環境では非同期通信を使って読むと早くなる、とかいう記事を見かけたことがあったので作ってみました。


## デモ

まずは、通常の呼び出し、defer属性、async属性、非同期ローダーを使った呼び出しのそれぞれのデモを置いておきます。  
 初めにjqueryと、ダミーのテキストをコメントアウトして無理やりファイルサイズを大きくした10個のJSファイルを呼び出しています。

※同じJavaScriptを呼び出しているので、キャッシュを削除してから次のデモを見ると比較しやすいと思います。

- [デモ（何もなしなHTML記述）](http://demo.sus-happy.net/javascript/prloader/normal.html)
- [デモ（deferなHTML記述）](http://demo.sus-happy.net/javascript/prloader/defer.html)
- [デモ（asyncなHTML記述）](http://demo.sus-happy.net/javascript/prloader/async.html)
- [デモ（非同期ローダーを利用）](http://demo.sus-happy.net/javascript/prloader/)

それぞれ特徴があって面白い動きをしますね。

async属性を利用した場合は、順番が読み込まれた順になるのが気に食わないのですが、JavaScriptの作り自体の問題な気がします…精進します。

続きで実装方法と、詰まったところをだらだらと流しておきます。


## 非同期通信

XMLHttpRequestを利用して非同期通信をしています。そのためローカル環境での実行が出来ないのがデメリットです。


## 実行処理

[こちらのページ](http://fdays.blogspot.com/2010/05/javascript-script.html)を参考に読み込み完了後、実行する際はinnerHTMLで実行しようとしたのですが、Mac Safari4でエラーが発生しました。  
 失敗したときのコードはこんな感じ。

```javascript
var s = document.createElement('script');
s.type = 'text/javascript';
s.charset = 'utf-8';
s.innerHTML = scr;
s.setAttribute('defer', 'defer');
var cs = document.getElementsByTagName('script')[0];
cs.parentNode.insertBefore(s, cs);
```

原因は恐らくJS内の不等号や、HTMLの記述で、HTMLデータと誤認識したのかな？と思っています。

そこで、HTMLデータと認識させない様にcreateTextNodeを使ってscriptタグに挿入しています。  
 成功したときのコードはこんな感じ。

```javascript
var s = document.createElement('script');
s.type = 'text/javascript';
s.charset = 'utf-8';
s.appendChild(document.createTextNode(scr));
s.setAttribute('defer', 'defer');
var cs = document.getElementsByTagName('script')[0];
cs.parentNode.insertBefore(s, cs);
```


## IEの場合

IE6～8では上記の読み込み方法では実行されず、IE9では順番がバラバラになってしまいましたので、[こちらの方法](http://d.hatena.ne.jp/shogo4405/20061207/1165479339)を参考に下記の通りに読み込んでいます。

```javascript
var s = document.createElement("span");
s.innerHTML = "&nbsp;<script defer='defer' type='text/javascript'>"+scr+"</script>";
document.body.appendChild(s);
```

ただし、 を頭に配置しているので、空白が表示されてしまいます。


## IEの判別

IE以外は最初の方法で実行させたいので、IEの判別をIEのみ実装されている「document.uniqueID」で振り分けています。

```javascript
if( document.uniqueID ) {
	/* IE */
} else {
	/* IE以外 */
}
```


## ソースコード

GitHubにアップしましたので、下記リンクよりダウンロード出来ます。

[ダウンロード（GitHub）](https://github.com/sus-happy/parallel-loader.js)

ただ、あまり検証はしていないので業務に利用するのはお勧めしません。


## 参考

- [floatingdays: JavaScriptによって動的に script要素を追加する場合のブラウザごとの挙動の違い](http://fdays.blogspot.com/2010/05/javascript-script.html)
- [innerHTMLでscriptする – Thousand Years](http://d.hatena.ne.jp/shogo4405/20061207/1165479339)


## 追記 2012/01/30

「実行処理」内のソースで記述を間違えておりました。申し訳ありません。  
 “currentscript” -> “is”

また、「is」という変数名もなんだか怪しい気がする（予約語になりそう）ので、「cs」に変更しました。
