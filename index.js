var numeral = require('numeral');
var striptags = require('striptags');
var wordcount = require('wordcount');

var counter = function(content) {
  content = striptags(content).trim();
  var bn = content.match(/[\u0980-\u09FF]/g) || [];
  if (bn.length) {
    bn = content.split(" ");
  }
  var en = content.replace(/[\u0980-\u09FF]/g, '');
  return [bn.length, wordcount(en)];
};

hexo.extend.helper.register('min2read', function(content, {
  bn = 200,
  en = 200
} = {}) {
  var len = counter(content);
  var readingTime = len[0] / bn + len[1] / en;
  return readingTime < 1
    ? '1'
    : numeral(readingTime).format('0');
});

hexo.extend.helper.register('wordcount', function(content) {
  var len = counter(content);
  return numeral(len[0] + len[1]).format('0,0');
});

hexo.extend.helper.register('totalcount', function(site, format) {
  var count = 0;
  site.posts.forEach(function(post) {
    var len = counter(post.content);
    count += len[0] + len[1];
  });
  if (count < 1024) {
    return numeral(count).format('0,0');
  }
  return numeral(count).format(format || '0,0.0a');
});
