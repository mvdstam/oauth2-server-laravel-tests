var frisby = require('frisby'),
    jwt = require('jsonwebtoken'),
    fs = require('fs'),

    clientID = '660cdc84-7413-485f-859f-d689154bb920',
    clientSecret = '13320e3b-a2d2-4451-88f3-769b3c8d845f';

var validateToken = function(err, res, body) {
    jwt.verify(
        JSON.parse(body).access_token,
        fs.readFileSync('id_rsa.pub'),
        {
            issuer: 'http://localhost:8080',
            audience: clientID
        }
    );
};

frisby.create('Client Credentials grant')
    .post('http://localhost:8080/oauth2/access_token', {
        grant_type: 'client_credentials'
    })
    .addHeader(
        'Authorization',
        'Basic ' + new Buffer([clientID, clientSecret].join(':')).toString('base64')
    )
    .expectStatus(200)
    .expectJSON({
        token_type: 'Bearer'
    })
    .after(validateToken)
    .toss();
