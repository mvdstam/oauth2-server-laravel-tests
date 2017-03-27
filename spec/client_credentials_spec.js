var frisby = require('frisby'),
    common = require('./common'),
    client = require('./client');

frisby.create('[Client Credentials] Request access token with valid credentials returns access token')
    .post('http://localhost:8080/oauth2/access_token', {
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

frisby.create('[Client Credentials] Request access token with invalid credentials returns HTTP-400')
    .post('http://localhost:8080/oauth2/access_token', {
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
