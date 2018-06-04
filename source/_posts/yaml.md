---
title: "YAMLについてもう少し調べてみた"
date: 2012-06-25T23:09:07.000Z
updated: 2016-04-03T14:16:44.000Z
tags: 
  - YAML
---

以前[PHPを使ってYAMLを扱う方法](http://blog.sus-happy.net/201104/spyc-yaml/ "spycを使ってYAMLを利用してみた")についてメモをしていましたが、もう少しYAMLについて調べてみました。


## 基本的な記述

### 配列とハッシュ

YAMLは配列かハッシュによってデータを表現することが出来ます。  
 頭に「-」を付けた場合は配列、「キー: 値」の様に「:」で区切った場合にハッシュとなります。

```yaml
- foo
- bar
hoge: fuga
```

### 階層化

半角スペースでインデントをすることで、配列・ハッシュを階層化することが出来ます。  
 また、インデントを行う際にタブ文字は使えません。

```yaml
-
  - foo
  - bar
hoge: 
  - fuga
  - piyo
```

### コメントアウト

前回も何も説明せずに使っていましたが、コメントアウトは「#」です。

「#」を付けた後ろを行末までコメントアウトします。範囲指定は無いようなので、複数行コメントアウト指定場合は何度も記述する必要があります。

```yaml
- foo
- var
# ここはコメントアウト
hoge: fuga
```

### 改行

YAMLの特性として改行すると次のデータになってしまうため、改行を行う時は下記の様に記述する必要があります。

```yaml
foo: bar
break : |
  Lorem Ipsum is simply dummy text
  of the printing and typesetting industry.
```

特殊なモノとして、改行をスペースに、空白行があった場合は改行に変換する記述もあります。

```yaml
break : >
  Lorem Ipsum is simply dummy text
  of the printing and typesetting industry.
  
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,...
```

### インライン

全て改行をして記述するのではなく、一行にまとめて記述することも可能です。

```yaml
normal :
  - foo
  - bar
inline : [hoge, fuga]
```

連想配列の場合は下記の通り。

```yaml
-
  type : normal
  data : hash
- {type: inline, data: hash}
```


## ちょっと応用的な記述

### アンカーとエイリアス

「&」で印をつけて、「*」で読み込むことが出来ます。

```yaml
- &mark
  - hoge
  - fuga
- *mark
```

…のはずなんですが、[PHPのspyc](http://code.google.com/p/spyc/)では上手く動いていない様な気がします…。


## 参考

- [Rubyist Magazine – プログラマーのための YAML 入門 (初級編)](http://jp.rubyist.net/magazine/?0009-YAML)