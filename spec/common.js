var jwt = require('jsonwebtoken'),
    fs = require('fs'),
    client = require('./client');

module.exports = {
    validateToken: function(body) {
        jwt.verify(
            body.access_token,
            fs.readFileSync('public.pem'),
            {
                issuer: 'http://localhost:8080',
                audience: client.id
            }
        );
    },

    getAuthenticationHeaderValue: function(username, password) {
        return 'Basic ' + new Buffer([username, password].join(':')).toString('base64');
    }
}
