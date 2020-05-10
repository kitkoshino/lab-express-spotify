require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const artistName = req.query.artistName;

  spotifyApi
    .searchArtists(artistName)
    .then((resultArtist) => {
      console.log('resultado da busca: ', resultArtist.body.artists.items[0].images[0].url);
      res.render('artist-search-results', { resultArtist: resultArtist.body.artists.items });
    })
    .catch((error) => {
      console.log('erro: ', error);
    });
});

app.get('/albums/:id', (req, res) => {
  const artistId = req.params.id;

  spotifyApi.getArtistAlbums(artistId)
  .then(artistAlbuns => {
    console.log(artistAlbuns.body.items);
    res.render('albums', {artistAlbuns: artistAlbuns.body.items});
  });
});

app.get('/album-tracks/:id', (req, res) => {
  const albumId = req.params.id;

  spotifyApi.getAlbumTracks(albumId)
  .then(albumTracks => {
    console.log(albumTracks.body);
    res.render('albuns-tracks', {albumTracks: albumTracks.body.items})
  })
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
