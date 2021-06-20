const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, TIME } = Sequelize.DataTypes;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:FSA123@localhost/acme_tdd', {logging: false});

const Artist = conn.define('artist', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING
});

const Album = conn.define('album', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING
});

const Song = conn.define('song', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING,
  duration: TIME
});

const Track = conn.define('track', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  }
});

Album.belongsTo(Artist);
Artist.hasMany(Album);
Song.belongsTo(Artist);
Artist.hasMany(Song);
Track.belongsTo(Album);
Album.hasMany(Track);
Track.belongsTo(Song);
Song.hasMany(Track);


const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const [weeknd, metalica, adele] = await Promise.all([
    Artist.create({ name: 'The Weeknd'}),
    Artist.create({ name: 'Metalica'}),
    Artist.create({ name: 'Adele'})
  ]); 

  const [album1, album2, album3] = await Promise.all([
    Album.create({ name: 'Album 1', artistId: weeknd.id}),
    Album.create({ name: 'Album 2', artistId: metalica.id}),
    Album.create({ name: 'Album 3', artistId: adele.id})
  ]); 

  const [song1, song2, song3] = await Promise.all([
    Song.create({ name: 'Song 1', artistId: weeknd.id, duration: '00:05:05'}),
    Song.create({ name: 'Song 2', artistId: metalica.id, duration: '00:05:06'}),
    Song.create({ name: 'Song 3', artistId: adele.id, duration: '00:05:07'})
  ]); 

  const [track1, track2, track3] = await Promise.all([
    Track.create({ name: 'Track 1', albumId: album1.id, songId: song1.id}),
    Track.create({ name: 'Track 2', albumId: album2.id, songId: song2.id}),
    Track.create({ name: 'Track 3', albumId: album3.id, songId: song3.id})
  ]); 
  
  return {
    artists: {
      weeknd,
      metalica
    }
  };

};




module.exports = {
  syncAndSeed,
  models: {
    Artist,
    Album, Track, Song
  }
};
