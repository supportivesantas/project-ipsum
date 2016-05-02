const request = require('superagent');

const Get = (url, callback) => {
  request
    .get(url)
    .end((err, res) => {
      if (err) {
        console.error('Err in util/restHander ', err);
      }
      callback(err, res);
    });
};

const Post = (url, data, callback) => {
  request
    .post(url)
    .send(data)
    .end((err, res) => {
      if (err) {
        console.error('Err in util/restHander ', err);
      }
      callback(err, res);
    });
};

export default {
  Get: Get,
  Post: Post,
};
