var frisby = require('frisby'),
    common = require('../common'),
    client = require('../client');

frisby.create('[Password] Request access token with valid credentials returns access token')
    .post('http://localhost:8080/oauth2/access_token', {
        grant_type: 'password',
        username: 'testuser',
        password: 'testpass'
    })
    .addHeader(
        'Authorization',
        common.getAuthenticationHeaderValue(client.id, client.secret)
    )
    .expectStatus(200)
    .expectJSON({
        token_type: 'Bearer'
    })
    .afterJSON(common.validateToken)
    .toss();

frisby.create('[Password] Request access token with invalid credentials returns HTTP-401')
    .post('http://localhost:8080/oauth2/access_token', {
        grant_type: 'password',
        username: 'testtest',
        password: 'testtest'
    })
    .addHeader(
        'Authorization',
        common.getAuthenticationHeaderValue(client.id, client.secret)
    )
    .expectStatus(401)
    .expectJSON({
        error: 'invalid_credentials'
    })
    .toss();
