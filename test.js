const md5 = require('md5');

console.log(md5('test'));

console.log('098f6bcd4621d373cade4e832627b4f6' === md5('testz'));
