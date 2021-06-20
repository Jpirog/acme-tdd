const { expect } = require('chai');
const { syncAndSeed } = require('./db');
const supertest = require('supertest');
const app = supertest(require('./app'));

describe('The API', ()=> {
  let seed;
  beforeEach(async()=> {
    seed = await syncAndSeed();
  });
  describe('seeded data', ()=> {
    it('The Weeknd is one of the artists', ()=> {
      const weeknd = seed.artists.weeknd;
      expect(weeknd).to.be.ok;
    });
    it('Metalica is one of the artists', ()=> {
      expect(seed.artists.metalica.name).to.equal('Metalica');
    });
  });
  describe('artists routes', ()=> {
    describe('GET /api/artists', ()=> {
      it('returns the artists', async()=> {
        const response = await app.get('/api/artists');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        const names = response.body.map( artist => artist.name);
        expect(names).to.eql(['Adele', 'Metalica', 'The Weeknd']);
      });
    });
  });

  describe('albums routes', ()=> {
    describe('GET /api/albums', ()=> {
      it('returns the albums', async()=> {
        const response = await app.get('/api/albums');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        const names = response.body.map( album => album.name);
        expect(names).to.eql(['Album 1', 'Album 2', 'Album 3']);
      });
    });
  });

  describe('albums routes', ()=> {
    describe('GET /api/albums/:term', ()=> {
      it('returns the albums with term in the name', async()=> {
        const response = await app.get('/api/albums/bum%201');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        const names = response.body.map( album => album.name);
        expect(names).to.eql(['Album 1']);
      });
    });
  });
  
  describe('tracks routes', ()=> {
    describe('GET /api/albums/tracks', ()=> {
      it('returns the tracks of an album with the song name', async()=> {
        const response = await app.get('/api/albums/Album%201/tracks');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        console.log('RESP',response.body)
        const names = [response.body[0].album.name]
        console.log('NAMES', names)
        expect(names).to.eql(['Album 1']);
      });
    });
  });

});

