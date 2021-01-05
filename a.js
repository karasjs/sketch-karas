const fetch = require('node-fetch');

const base64 = require('./1.json');

function uploadImage (base64Data, needCompress = 1, needFormat = 1, fileName = 'a.png') {

  const a = base64.base64Data.replace(/\+/g, '_')
  console.log(a);
  const url = 'http://127.0.0.1:7001/api/ae2karas/upload';

  // const url = 'https://animconfig-office.alipay.net/api/ae2karas/upload';
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `imgData=${a}&fileName=${fileName}&needCompress=${needCompress}&needFormat=${needFormat}`,
  })
    .then(res => res.text())
    .then(res => {
      console.log(res)
      if (res.ok) {
        console.log(JSON.parse(res.text()._value))
        console.log(res.text())
        return JSON.parse(res.text()._value);
      } else {
        return null;
      }
    })
    .catch(e => {
      console.error(e)
    });
}

uploadImage();