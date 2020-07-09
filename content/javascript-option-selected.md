---
title: "JavaScriptで追加したoption要素を選択状態にしたい時にIE6に阻まれた時の対処"
date: 2012-05-27T18:35:11.000Z
updated: 2016-04-03T14:20:52.000Z
tags: 
  - JavaScript
  - jQuery
---

とある案件で、JavaScript（jQuery）を利用してセレクトボックスの数を変動させて、場合によっては追加した要素をそのまま選択状態にしたかったのですが、IE6でエラーが発生してしまうという事例が発生してしまったので、メモ代わりに残しておきます。


## 発生事例

まずは、エラーが起きてしまった時の記述について。

```javascript
var val = "foo", text = "bar";
$("#select").append($("<option>", {"value":val, "text":text})).val(val);
```

この記述でも基本的には問題ないのですが、IE6ではエラーが発生してしまいます。

エラーの内容としては存在しないデータを設定しようとしているため云々、という事みたいなので描画順が影響している？との事ですが、どうなんでしょう。


## 改善策

参考サイトに改善策が色々載っていたので列挙しておきます。

setTimeoutを利用

```javascript
var val = "foo", text = "bar";
$("#select").append($("<option>", {"value":val, "text":text}));
setTimeout( function() {
	$("#select").val(val);
}, 0 );
```

.clone()を利用

```javascript
var val = "foo", text = "bar";
$("#select").append($("<option>", {"value":val, "text":text}));
$("#select").after($("#select").clone()).remove();
$("#select").val(val);
```

.width()を利用

```javascript
var val = "foo", text = "bar";
$("#select").append($("<option>", {"value":val, "text":text})).width();
$("#select").val(val);
```

.focus()を利用

```javascript
var val = "foo", text = "bar";
$("#select").append($("<option>", {"value":val, "text":text})).focus();
$("#select").val(val);
```

全てappendした後に何か処理を挟む、という方法を取っている様ですね。描画順が狂わないように挟む、と言う感じでしょうか。

どんな時でも動きそうなのはsetTimeoutの様な気がしますが、プログラムとしての順番が信用できなくなりそうですね。  
 どれが一番良いのかな？うーん。


## 参考

- [jQueryを使うときに気をつけるべき8のポイント | tech.kayac.com – KAYAC engineers' blog](http://tech.kayac.com/archive/jquery-checkpoints.html)
- [jQueryでoption要素を追加した際の諸問題 – むつらつれづれ](http://d.hatena.ne.jp/x6x6/20080318/1205817536)