---
title: "TwitterのタイムラインをPHPのoAuthを利用して取得してみた"
date: 2010-12-06T23:54:24.000Z
updated: 2016-04-03T15:30:18.000Z
tags: 
  - oAuth
  - PHP
  - Twitter
---

プチリニューアルを行う中で、Twitterのタイムラインを取得したかったので、PHPを使って取得できないものか試してみました。

ライブラリを色々と使ってますが、以下のような方法で取得できたので、残しておきます。

「[PHP+OAuthでTwitter – SDN Project](http://www.sdn-project.net/labo/oauth.html)」の記事を参考に制作しました。ありがとうございます。

基本的に参考サイトを参考にしていただければoAuthでのタイムラインの取得が可能となります。

ただ、今回はXML形式ではなく、JSON形式で取得をしてみました。

```php
$req = $to->OAuthRequest("https://twitter.com/statuses/user_timeline.json","GET",array("count"=>"20"));
```

ついでにJSON形式のタイムラインを取得する簡単なjQueryプログラムを書いてみました。

```javascript
$.getJSON( "../include/getTwitter.php", function(data) {
	for( var i=0; i<data.length; i++ ) {
		$("#contents")
			.append( $("<div>")
				.append( $("<div>")
					.append( $("<p>", {"html":data[i].text}) )
					.append( $("<p>", {"html":data[i].created_at}) )
					.append( $("<a>", {"href":"http://twitter.com/"+data[i].screen_name+"/status/"+data[i].id, html:"パーマリンク"}) )
				)
			);
	}
} );
```

`text`：本文、`created_at`：投稿日時、`name`：名前、`screen_name`：ユーザIDの辺りが良く使う項目だと思います。