const jayson = require('jayson');

// Create a client connected to backend server
const client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

// Test RPC method
function add(a, b, callback) {
  client.request('add', [a, b], function(err, error, response) {
    if (err) throw err;
    console.log(response);
    callback(response);
  });
}

// Get news summaries for a user
const getNewsSummariesForUser = (userId, pageNum) => {
  return new Promise((resolve, reject) => {
    client.request('get_news_summaries_for_user', [userId, pageNum], (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
};

// Log a news click event for a user
const logNewsClickForUser = (userId, newsId) => {
  return new Promise((resolve, reject) => {
    client.request('log_news_click_for_user', [userId, newsId], (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
};

module.exports = {
  add : add,
  getNewsSummariesForUser,
  logNewsClickForUser
};
