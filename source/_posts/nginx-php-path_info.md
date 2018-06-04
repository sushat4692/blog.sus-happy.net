---
title: "nginx+php-fpmでPATH_INFOを取得してみた"
date: 2012-02-08T01:13:29.000Z
updated: 2016-04-03T14:44:34.000Z
tags:
  - nginx
  - PHP
---

[前回の設定](http://blog.sus-happy.net/nginx-php/)ではPATH_INFOが取得できず、404になってしまっていたので、修正を行いました。

その他、`DOCUMENT_ROOT`の値も変だったりしたので色々と見直しをしています。

正規表現を使って、「`hoge.php/fuga`」の様なURLが呼び出されたとき、スラッシュの前と後とを切り分けて、`SCRIPT_NAME`と、`PATH_INFO`それぞれの値に割り当てています。

```
location ~ \.php($|/) {
	set $script $uri;
	set $path_info "";
	if ($uri ~ "^(.+\.php)(/.+)") {
		set $script $1;
		set $path_info $2;
	}
	fastcgi_pass    127.0.0.1:9000;
	include         fastcgi_params;
	fastcgi_index   index.php;
	fastcgi_param   SCRIPT_FILENAME    /path/to/documentroot$fastcgi_script_name;
	fastcgi_param   DOCUMENT_ROOT   /path/to/documentroot;
	fastcgi_param   PATH_INFO       $path_info;
	fastcgi_param   SCRIPT_NAME     $script;
	fastcgi_intercept_errors on;
}
```

`DOCUMENT_ROOT`や`SCRIPT_NAME`を指定しても中々上手く設定されない！、と思っていたら、「`include fastcgi_params`」を「`fastcgi_param～`」より下に記述していたので上書きされている事に気づきました。
 （このことに気づくのに地味に時間をかけてしまった･･･。
