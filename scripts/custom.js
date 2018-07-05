// netlifyに必要なファイル_redirectsをpublicで生成する (通常は_で始まるファイルは無視されるが、下記コードでpublicに生成できるようになる)
hexo.extend.generator.register('netlify-redirects', function(locals){
  var fs = require('hexo-fs');
  var pathFn = require('path');
  var data = fs.readFileSync( pathFn.join( process.env.PWD || process.cwd() , '_redirects'));
  return {
    path: "_redirects",
    data: data
  };
});
