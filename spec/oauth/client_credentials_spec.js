var frisby = require('frisby'),
    common = require('../common'),
    client = require('../client');

frisby.create('[Client Credentials] Request access token with valid credentials returns access token')
    .post('http://app/oauth2/access_token', {
        grant_type: 'client_credentials'
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

frisby.create('[Client Credentials] Request access token with invalid credentials returns HTTP-401')
    .post('http://app/oauth2/access_token', {
        grant_type: 'client_credentials'
    })
    .addHeader(
        'Authorization',
        common.getAuthenticationHeaderValue('foo', 'bar')
    )
    .expectStatus(401)
    .expectJSON({
        error: 'invalid_client'
    })
    .toss();
