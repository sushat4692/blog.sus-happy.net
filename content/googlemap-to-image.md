---
title: "GoogleMapを画像として呼び出す方法"
date: 2010-08-29T22:41:03.000Z
updated: 2016-04-03T15:42:58.000Z
tags:
  - Google
  - GoogleMap
---

普段はJavaScriptを用いて、GoogleMapの各種機能を持った地図を表示させていますが、他に携帯やその他JavaScriptをOffにしている環境に対して、画像として呼び出す方法があります。

Google Static Maps APIと呼ばれるもので、[こちらの公式ページ](http://code.google.com/intl/ja/apis/maps/documentation/staticmaps/)で詳しい説明がなされています。

よく使われる、特定地域を表示し特定の場所にターゲットを配置する方法は以下の通りです。

```html
<img src="http://maps.google.com/staticmap
?center=&#91;地図の中心座標　緯度&#93;,&#91;地図の中心座標　経度&#93;
&markers=&#91;マーカー　緯度&#93;,&#91;マーカー　経度&#93;,&#91;マーカー　色&#93;
&zoom=&#91;拡大値&#93;
&size=&#91;横幅&#93;x&#91;縦幅&#93;
&key=&#91;GoogleMap API Key&#93;" />
```

試しに名古屋駅の緯度・経度「35.170694,136.881637」を中心、マーカーを配置し、拡大値を16、300x300pxの画像を表示したい場合は、

```html
<img src="http://maps.google.com/staticmap
?center=35.170694,136.881637
&markers=35.170694,136.881637,red
&zoom=16&size=300x300
&key=&#91;GoogleMap API Key&#93;" />
```

のように記述することで、以下のように表示されます。

![](https://maps.google.com/staticmap?center=35.170694,136.881637&markers=35.170694,136.881637,red&zoom=16&size=300x300&key=ABQIAAAAA5qkCGkJOwdXk8tYusa7ZBRg6S1mwwG_hVilJduEoXtSoPPcqBQLk8iG7Gi6iNz0AnnFnSO8mX-Rkg)