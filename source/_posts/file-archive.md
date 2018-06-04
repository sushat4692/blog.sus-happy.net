---
title: "Win – Mac間での圧縮データの取り扱いについて"
date: 2010-10-04T01:07:00.000Z
updated: 2016-04-03T15:39:13.000Z
tags: 
  - Mac
  - Windows
  - フリーソフト
  - 便利
---

仕事柄、MacもWindowsも使う事があるのですが、圧縮データを扱う際に良く文字化けを起こしてしまったりして、ちょっと弊害が発生したので、また新しくPCセットアップしたり、教えたりする時にリンクとか直ぐ忘れてしまうので、ブログを書いたことだけを覚えておけるように色々まとめておきました。


## ファイル名、フォルダ名に全角文字を使わない

送信側と受信側のPCが同じOSであれば問題ありませんが、もし送信側がMac、受信側がWindows等の別のOSに送る場合に、ファイル名やフォルダ名に全角文字を使った圧縮データを送ると、解凍した際に文字化けを引き起こす原因となります。

また、フォルダの中に入っているファイルが半角英数であっても、フォルダの名前が全角なら中のファイルも文字化けしてしまうので、注意してください。

### 解決方法

<dl>
<dt>１．圧縮するフォルダ・ファイルは全て半角英数で作成する</dt>
<dd>一つでも全角文字のファイルやフォルダがあるだけで、他のファイルやフォルダに影響を及ぼす危険性があるので、全て半角英数で入力するようにします。  
 またこの際に、Mac上ではフォルダ名に「\」を入力する事が可能ですが、Windows上では「\」が特別な文字列として扱われるため、使用しないでください。</dd>
<dt>２．特別なソフトを利用する</dt>
<dd>また、<a href="http://plusd.itmedia.co.jp/pcuser/articles/0808/11/news057.html">こちらのページで説明されているように</a>、特別なソフトで圧縮すれば問題ないようです。</dd>
<dt>３．もし文字化けするデータを受け取った場合（Win）</dt>
<dd>Windowsで文字化けするデータを受け取った場合には、<a href="http://www.lzh-zip.com/freesoft/free309.html">Archive decoder</a>を利用する事で、Macで圧縮したデータでも文字化けを回避する事が可能です。</dd>
</dl>
## 圧縮形式はZIP形式で行う

様々な圧縮形式が存在しますが、一番広く扱われている圧縮形式が「ZIP形式（拡張子.zip）」であるため、これ以外の圧縮形式は扱わない方が良いです。

### 作成方法

以下のページで作成方法を詳しく説明されているので、分かりやすいかと思います。

<dl><dt>Windowsユーザ</dt><dd>[Microsoft At Home マガジン | 今週の快適 Windows Tips | 圧縮 (Zip) ファイルにパスワードを設定してデータを保護する](http://www.microsoft.com/japan/athome/magazine/ucontents/users/tips/windows/107.mspx)</dd><dt>Macユーザ</dt><dd>[Macでzip圧縮は右クリックで | デジイチ最新情報！](http://kensei.jugem.cc/?eid=1734)</dd></dl>ちなみにWindowsでの圧縮/解凍ソフトのオススメは「[Lhaplus](http://www.vector.co.jp/soft/win95/util/se169348.html)」です。


## 番外編

### Windowsでsit形式のファイルを解凍する

Windowsでsit形式のファイルを解凍するには[Windows用のStuffIt Expander](http://www.xucker.jpn.org/pc/staffit_install.html)を利用する事で可能です。