const md5 = require('md5');
const Axios = require('axios');
const fetch = require('node-fetch');
console.log(md5('supervisor01'));
fetch(
  'https://maps.googleapis.com/maps/api/geocode/json?address=juaracoding&key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q'
)
  .then((response) => response.json())
  .then((data) => console.log(data.results[0]['geometry']));
