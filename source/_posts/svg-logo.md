title: "ベクター形式でWebページ上に表示できるSVGでロゴを描いてみた"
date: 2012-03-04T22:28:06.000Z
updated: 2016-04-03T14:39:17.000Z
tags: 
  - svg
---

今後様々なデバイスが発表されて、様々な解像度のディスプレイで表示されることを考えると、ビットマップ画像での対応に限界があると感じたので、[SVG](http://www.w3.org/Graphics/SVG/)もちょっと調べてみました。

ついでにこのブログのロゴをSVGで描いてみました。SVGが対応しているブラウザであれば、SVGで表示しているはずです。


## SVGの表示の仕方

SVGの表示のさせ方には幾つか方法があります。

1. objectタグ内のparamタグで指定する
2. objectタグのdata属性で指定する
3. imgタグで表示する
4. HTML内に直接記述する
5. CSSで背景画像に指定する

の辺りでしょうか？  
 これら＋[JavaScriptで生成するライブラリ](http://raphaeljs.com/)もあるようですが、今回はリンクのみの紹介としておきます。

このサイトで採用しているのは、振り分けが楽そうだったのでCSSで背景画像にして指定しています。  
 とはいってもあんまり表示確認していません。（Chrome17、Firefox10、IE9は確認できてます。


## .htaccessの設定

実は先程の方法だけではクライアント側が対応していても、サーバ側がSVGを認識していないことがあると表示されません。

そこで、拡張子が「svg」「svgz」の場合はSVGである事を認識させるため、.htaccessか、Apacheの設定で以下の記述をします。

```
AddType image/svg+xml .svg
AddType image/svg+xml .svgz
```


## SVGのコード

そんなに長いコードにならなかったので、ロゴのコードを全文貼っておきます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="110px" height="20px" viewBox="0 0 110 20">
	<polygon points="0,15 10,15 10,0 25,0 25,5 15,5 15,20 0,20" stroke="none" fill="black" />
	<polygon points="20,6 25,6 25,15 30,15 30,0 35,0 35,20 20,20" stroke="none" fill="black" />
	<polygon points="36,15 40,15 40,0 55,0 55,5 45,5 45,20 36,20" stroke="none" fill="black" />
	<polygon points="50,6 55,6 55,10 60,10 60,0 65,0 65,20 60,20 60,15 55,15 55,20 50,20" stroke="none" fill="black" />
	<rect x="66" y="0" width="4" height="5" style="fill:black;" />
	<rect x="66" y="10" width="4" height="10" style="fill:black;" />
	<rect x="75" y="0" width="5" height="9" style="fill:black;" />
	<rect x="71" y="10" width="9" height="5" style="fill:black;" />
	<polygon points="75,16 81,16 81,15 90,15 90,20 75,20" stroke="none" fill="black" />
	<polygon points="85,0 100,0 100,20 91,20 91,15 95,15 95,5 90,5 90,14 85,14" stroke="none" fill="black" />
	<rect x="101" y="0" width="9" height="5" style="fill:black;" />
	<polygon points="101,15 105,15 105,10 110,10 110,20 101,20" stroke="none" fill="black" />
</svg>
```


## 参考サイト

- [object 要素 + param 要素による SVG の埋め込み (1)](http://www.remus.dti.ne.jp/~a-satomi/nikki/tmp/bouhoumen_svg/object_param_1.html)
- [特集：スタートアップ SVG｜gihyo.jp … 技術評論社](http://gihyo.jp/dev/feature/01/svg)
- [SVG + VMLのJavaScriptグラフィックスライブラリ「Raphaël」 – MOONGIFT|オープンソース・ソフトウェア紹介を軸としたITエンジニア、Webデザイナー向けブログ](http://www.moongift.jp/2009/09/raphael/)