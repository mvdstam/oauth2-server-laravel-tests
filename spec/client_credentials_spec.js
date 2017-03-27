var frisby = require('frisby');

frisby.create('Client Credentials grant')
    .post('http://localhost:8080/oauth2/access_token', {
        grant_type: 'client_credentials'
    })
    .addHeader(
        'Authorization',
        new Buffer([
            '660CDC84-7413-485F-859F-D689154BB920',
            '13320E3B-A2D2-4451-88F3-769B3C8D845F'
        ].join(':')).toString('base64')
    )
    .expectStatus(200)
    .expectJson({
        token_type: 'bearer'
    })
    .toss();
