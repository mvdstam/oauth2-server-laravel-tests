var frisby = require('frisby'),
    common = require('../common'),
    client = require('../client'),
    querystring = require('querystring'),
    expect = require('expect');

var nonce = common.nonce(),
    redirectUri = 'http://localhost:8080';

frisby.create('[Authorization code] Initiate authorization process')
    .get('http://localhost:8080/oauth2/authorize?'+querystring.stringify({
        response_type: 'code',
        client_id: client.id,
        redirect_uri: redirectUri,
        state: nonce
    }))
    .expectStatus(200)
    .after(function(err, res) {
        expect(res.headers).toIncludeKey('set-cookie');

        frisby.create('[Authorization code] Complete authorization by logging in')
            .post('http://localhost:8080/oauth2/authorize', {
                login: {
                    username: 'testuser',
                    password: 'testpass'
                }
            })
            .addHeader('Cookie', res.headers['set-cookie'][0])
            .expectStatus(302)
            .after(function(err, res) {
                // Verify redirect target
                expect(res.headers).toIncludeKey('location');
                expect(res.headers['location']).toInclude('?');

                var query = querystring.parse(res.headers['location'].split('?')[1]);

                // Verify query string contains expected information
                expect(query).toIncludeKey('code');
                expect(query).toIncludeKey('state');
                expect(query['state']).toBe(nonce);

                frisby.create('[Authorization code] Exchange authorization code for an access token')
                    .post('http://localhost:8080/oauth2/access_token', {
                        grant_type: 'authorization_code',
                        redirect_uri: redirectUri,
                        code: query['code']
                    })
                    .addHeader('Authorization', common.getAuthenticationHeaderValue(client.id, client.secret))
                    .expectStatus(200)
                    .expectJSON({
                        token_type: 'Bearer'
                    })
                    .afterJSON(common.validateToken)
                    .toss();
            })
            .toss();
    })
    .toss();
