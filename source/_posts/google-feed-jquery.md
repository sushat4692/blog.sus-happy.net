title: "Google AJAX Feed API用のjQuery独自関数"
date: 2010-08-14T01:54:17.000Z
updated: 2016-04-03T15:55:42.000Z
tags: 
  - Google
  - JavaScript
  - jQuery
---

ブログで更新を行ったものをRSSを利用して読み込む際に、サーバが別でもJavaScriptのみで実現できるので、何回か使ったことがあるのですが、毎度毎度HTMLの構成が変わったりしたので読み込みのJSを書き換えていました。

もう少し便利に使えないかな？と、jQueryを用いて汎用性高める目的で作ってみました。

[ダウンロードはこちらから](http://blog.sus-happy.net/wp-content/uploads/2010/08/jquery.google-rss.js)、[デモページはこちらから](http://demo.sus-happy.net/javascript/grss/)確認できます。


## 関数概要

`{target}.gRssFeed({url}, {num}, {option});`

<dl><dt>{target}</dt><dd>適用する対象</dd><dt>{url}</dt><dd>読み込むRSSのURL</dd><dt>{num}</dt><dd>表示させるエントリー数</dd><dt>{option}</dt><dd><dl><dt>[bdate](string) = "&lt;li&gt;"</dt><dd>日付の前に挿入する文字列</dd><dt>[edate](string) = ""</dt><dd>日付の後に挿入する文字列</dd><dt>[btitle](string) = ""</dt><dd>エントリータイトルの前に挿入する文字列</dd><dt>[etitle](string) = "&lt;li&gt;"</dt><dd>エントリータイトルの後に挿入する文字列</dd><dt>[etitle](dformat) = "y/m/d"</dt><dd>日付のフォーマット  
 y:年、m:月、d:日にそれぞれ置き換えられる</dd></dl></dd></dl>

## サンプルコード

スタンダード

```html
<ul id="liRss"></ul>
```

```javascript
$("#liRss").gRssFeed( "http://blog.sus-happy.net/feed/", 5 );
```

表組みで表示

```html
<table id="tableRss"></table>
```

```javascript
$("#tableRss").gRssFeed( "http://blog.sus-happy.net/feed/", 5, { bdate:"<tr><th>", edate:"</th>", btitle:"<td>", etitle:"</td></tr>" } );
```

定義済みリストで表示

```html
<dl id="dlRss"></dl>
```

```javascript
$("#dlRss").gRssFeed( "http://blog.sus-happy.net/feed/", 5, { bdate:"<dt>", edate:"</dt>", btitle:"<dd>", etitle:"</dd>" } );
```

日付フォーマットの変更

```javascript
$("#dateRss").gRssFeed( "http://blog.sus-happy.net/feed/", 5, { dformat:"y年m月d日" } );
```


## ソースコード

```javascript
google.load("feeds", "1");
function initialize() {
    /* -------------
        ここに読み込み設定を記述する
    ------------- */
}
jQuery.fn.extend({
    gRssFeed : function( url, num, opt) {
        var tgt = $(this);

        if( !opt ) opt = new Object();
        var _bd = opt.bdate!=null ? opt.bdate : "<li>";
        var _ed = opt.edate!=null ? opt.edate : "&nbsp;";
        var _bt = opt.btitle!=null ? opt.btitle : "";
        var _et = opt.etitle!=null ? opt.etitle : "</li>";
        var _df = opt.dformat!=null ? opt.dformat : "y/m/d";
        var feed = new google.feeds.Feed(url);
        feed.setNumEntries(num);
        feed.load(function(result) {
            if (!result.error) {
                tgt.each( function() {
                    for (var i = 0; i < result.feed.entries.length; i++) {
                        var entry = result.feed.entries[i];

                        var d_d = new Date(entry.publishedDate);
                        var year = d_d.getYear();
                        if (year < 2000) year += 1900;
                        var month = zeroFiller(d_d.getMonth()+1);
                        var day = zeroFiller(d_d.getDate());
                        var dateTxt = _bd+_df.replace("y", year).replace("m", month).replace("d", day)+_ed;

                        var anchorTxt = _bt+'<a href="'+entry.link+'" target="_blank">'+entry.title+'</a>'+_et;
                        $(this).append(dateTxt+anchorTxt);
                    }
                } );
            }
        } );
    }
});
google.setOnLoadCallback(initialize);

function zeroFiller(num) {
    num = num+"";
    return num.length < 2 ? '0'+num : num;
}
```
