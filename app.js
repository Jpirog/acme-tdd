const express = require('express');
const app = express();
const path = require('path');
const { models: { Artist, Album , Track, Song}} = require('./db');
const {Op} = require('sequelize')


app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/artists', async(req, res, next)=> {
  try {
    res.send(await Artist.findAll({
      order: [['name']]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums', async(req, res, next)=> {
  try {
    res.send(await Album.findAll({
      order: [['name']]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums/:term', async(req, res, next)=> {
  const searchTerm = req.params.term;
  try {
    res.send(await Album.findAll({
      where: {
        name: {[Op.substring]: searchTerm}
      }
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums/:albumname/tracks', async(req, res, next)=> {
  const albumName = req.params.albumname;
  console.log('LOOKING FOR ALBUM', albumName)
  const xxx = await Track.findAll({
    include: [
      {
        model: Album,
        where: {name: albumName}
      }, 
      {model: Song}
    ],
  });
  console.log('XXXXX', xxx)
  try {
    res.send(await Track.findAll({
      include: [
        {
          model: Album,
          where: {name: albumName}
        }, 
        {model: Song}
      ],
    }));
  }
  catch(ex){
    next(ex);
  }
});

module.exports = app;
