
var frisby = require('frisby'),
    common = require('../common'),
    client = require('../client'),
    expect = require('expect');

frisby.create('[Refresh token] Request access token with valid credentials returns access token')
    .post('http://app/oauth2/access_token', {
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
    .afterJSON(function(accessToken) {
        common.validateToken(accessToken);

        frisby.create('[Refresh token] Request access token with valid refresh token returns access token')
            .post('http://app/oauth2/access_token', {
                grant_type: 'refresh_token',
                refresh_token: accessToken.refresh_token
            })
            .addHeader(
                'Authorization',
                common.getAuthenticationHeaderValue(client.id, client.secret)
            )
            .expectStatus(200)
            .expectJSON({
                token_type: 'Bearer'
            })
            .afterJSON(function(newAccessToken) {
                common.validateToken(newAccessToken);

                expect(newAccessToken.access_token).toNotEqual(accessToken.access_token);
            })
            .toss();
    })
    .toss();
