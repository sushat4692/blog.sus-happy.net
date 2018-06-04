---
title: "classかIDか自動判別して指定要素に追加するjQueryプラグイン"
date: 2011-07-26T03:07:55.000Z
updated: 2016-04-03T14:59:48.000Z
tags: 
  - jQuery
---

jQueryで制作を行っている時に、classやIDを要素に追加する事があるのですが、毎度addClass(“hoge”)や、attr(“id”, “fuga”)の様に指定するのがちょっと面倒だったので、「.hoge」や「#fuga」で自動的に判別して指定するプラグインを作ってみました。

前述したとおり、追加したい要素に「.」や「#」を含む文字列を渡した時に、自動判別して追加します。  
 指定方法はこんな感じ。

```javascript
$("foo").addIC(".var");
```

[ダウンロード（Github）](https://github.com/sus-happy/jquery.addIC.js)

[詳しい内容は固定ページを設けたのでこちらからどうぞ。](http://blog.sus-happy.net/jquery-addic-js/)

しかしこのプラグインの需要なんてあるのだろうか。