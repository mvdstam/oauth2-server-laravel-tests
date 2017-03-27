var frisby = require('frisby');

frisby.create('Homepage')
    .get('http://localhost:8080')
    .expectStatus(200)
    .toss();
