var https = require('https');
var Group = require('./model/group.js');

function GitlabClient(url, privateToken) {
  this.url = url
  this.privateToken = privateToken

  this.getGroupDetails = function(groupName) {
    var path = '/groups/' + groupName;
    var options = this._getRequestOptions('GET', path);

    return new Promise(function(resolve, reject) {
      var req = https.request(options, function(res) {
        let data = '';
        res.setEncoding('utf8');
        console.log(`get group details for ${groupName} returned STATUS: ${res.statusCode}`);
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', () => {
          resolve(new Group(JSON.parse(data)));
        });
      });

      req.on('error', error => {
        reject({
         'message': `No group found with name ${groupName}`
        })
      })
      req.end()
    });
  }

  this._getRequestOptions = function (method, path) {
    return {
      host: this.url,
      port: 443,
      path: "/api/v4" + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Private-Token': this.privateToken
      }
    };
  }
}

module.exports = GitlabClient;