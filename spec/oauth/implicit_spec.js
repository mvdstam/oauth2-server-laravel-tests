var frisby = require('frisby'),
    common = require('../common'),
    client = require('../client'),
    querystring = require('querystring'),
    expect = require('expect');

var nonce = common.nonce(),
    redirectUri = 'http://localhost:8080';

frisby.create('[Implicit] Initiate authorization process')
    .get('http://localhost:8080/oauth2/authorize?'+querystring.stringify({
        response_type: 'token',
        client_id: client.id,
        redirect_uri: redirectUri,
        state: nonce
    }))
    .expectStatus(200)
    .after(function(err, res) {
        expect(res.headers).toIncludeKey('set-cookie');

        frisby.create('[Implicit] Complete authorization by logging in')
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
                expect(res.headers['location']).toInclude('#');

                // Implicit grant returns data in the URL fragment
                var fragment = querystring.parse(res.headers['location'].split('#')[1]);

                // Verify fragment string contains expected information
                expect(fragment).toIncludeKeys([
                    'access_token',
                    'token_type',
                    'expires_in',
                    'token_type',
                    'state'
                ]);

                // Validate nonce
                expect(fragment['state']).toBe(nonce);
                common.validateToken(fragment);
            })
            .toss();
    })
    .toss();
