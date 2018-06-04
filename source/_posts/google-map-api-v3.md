title: "Google Map API V3を試してみた"
date: 2010-08-11T01:14:48.000Z
updated: 2016-04-03T15:58:58.000Z
tags: 
  - Google
  - GoogleMap
  - JavaScript
---

一年以上前に公開されていたらしいのですが、今更ながらGoogleMap APIのV3の存在を知ったので試してみました。


## V3での主な変更点

V2からV3へとバージョンアップに伴い、以下のような変更・改善点があります。

<dl><dt>API Keyが不要になった</dt><dd>URL毎に発行していたAPI Keyが不要となりました。開発者側にとっては結構うれしいことです。</dd><dt>スマートフォンへの対応がなされた</dt><dd>携帯端末用に表示速度が改善され、またGPS機能との連動が可能となりました。</dd><dt>JavaScriptの記述方法が変更された</dt><dd>V2に比べてJavaScriptの記述方法に変更があったようです。</dd></dl>

## テストコード

まずHTML側に地図を表示させるdiv要素を配置します。

```html
<div id="gmap"></div>
```

地図を表示させる基本のコードは以下のとおりです。

```javascript
google.maps.event.addDomListener(window, 'load', function() {
	var mapdiv = document.getElementById('gmap');
	var initPosition = {
		zoom: 14,
		center: new google.maps.LatLng(35.17073004594335, 136.9),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true,
	};
	var map = new google.maps.Map(mapdiv, initPosition);
});
```

マーカーを表示させるには以下のコードを追加します。

```javascript
var marker = new google.maps.Marker({
	position: new google.maps.LatLng(35.17073004594335, 136.8816876411438),
	map: map,
	title: '名古屋駅'
});
```

情報ウィンドウを表示するのはこちらのコードです。

```javascript
var infoWindow = new google.maps.InfoWindow({
	content: '名古屋駅'
});
infoWindow.open(map, marker);
```

また、V3より複数の情報ウィンドウを表示させることが可能になり、こちらの[デモページ](http://demo.sus-happy.net/javascript/gmap3/)の様な表現も出来るようになりました。

デモページで使っているJavaScriptのコードは以下のとおりです。

```javascript
google.maps.event.addDomListener(window, 'load', function() {
    var mapdiv = document.getElementById('gmap');
    var initPosition = {
        zoom: 14,
        center: new google.maps.LatLng(35.17073004594335, 136.9),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true,
    };
    var map = new google.maps.Map(mapdiv, initPosition);

    var marker = new Array();
    var infoWindow = new Array();

    marker.push( new google.maps.Marker({
        position: new google.maps.LatLng(35.17073004594335, 136.8816876411438),
        map: map,
        title: '名古屋駅'
    }) );
    infoWindow.push( new google.maps.InfoWindow({
        content: '名古屋駅'
    }) );

    marker.push( new google.maps.Marker({
        position: new google.maps.LatLng(35.170798014746985, 136.92037045955658),
        map: map,
        title: '新栄町'
    }) );
    infoWindow.push( new google.maps.InfoWindow({
        content: '新栄町'
    }) );

    for(var i=0; i<marker.length; i++) {
        infoWindow[i].open(map, marker[i]);
    }
});
```