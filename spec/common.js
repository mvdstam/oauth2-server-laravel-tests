var jwt = require('jsonwebtoken'),
    fs = require('fs'),
    client = require('./client'),
    crypto = require('crypto');

module.exports = {
    validateToken: function(body) {
        jwt.verify(
            body.access_token,
            fs.readFileSync('storage/app/oauth2-server/public.pem'),
            {
                issuer: 'http://app',
                audience: client.id
            }
        );
    },

    getAuthenticationHeaderValue: function(username, password) {
        return 'Basic ' + new Buffer([username, password].join(':')).toString('base64');
    },

    nonce: function() {
        return new Buffer(crypto.randomBytes(48)).toString('base64');
    }
};
