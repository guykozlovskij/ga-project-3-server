import express from 'express'
import secureRoute from '../middleware/secureRoute.js'

import albumsController from '../controllers/albumsController.js'
import userController from '../controllers/usersController.js'
import songController from '../controllers/songsController.js'
import artistsController from '../controllers/artistsController.js'
import playlistsController from '../controllers/playlistsController.js'
import likesController from '../controllers/likesController.js'
 

const router = express.Router()

//! User routes
router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)


//! Album routes
router.route('/albums')
  .get(albumsController.albumIndex)
  .post(secureRoute, albumsController.add)

router.route('/albums/:albumId')
  .get(albumsController.album)
  .put(secureRoute, albumsController.edit)
  .delete(secureRoute, albumsController.remove)

// Song routes in albums
router.route('/albums/:albumId/songs')
  .get(albumsController.songs)
router.route('/albums/:albumId/songs/:songId')
  .post(secureRoute, albumsController.addSong)
  .delete(secureRoute, albumsController.removeSong)
// Add artist to an album
router.route('/albums/:albumId/artists/:artistId')
  .post(secureRoute, albumsController.addArtist)


//! Songs routes
router.route('/songs/')
  .get(songController.songsIndex)
  .post(secureRoute, songController.uploadSong)

router.route('/songs/:id')
  .get(songController.showSingleSong)
  .delete(secureRoute, songController.removeSong)
  .put(secureRoute, songController.editSong)


//! Comment Routes
router.route('/songs/:id/comments')
  .get(songController.getCommentsForSong)
  .post(secureRoute, songController.createComment)

router.route('/songs/:id/comments/:commentId')
  .put(secureRoute, songController.editComment)
  .delete(secureRoute, songController.deleteComment)


//! Artist routes
router.route('/artists/')
  .get(artistsController.artistIndex)
  .post(secureRoute, artistsController.createArtist)

router.route('/artists/:artistId')
  .get(artistsController.artist)
  .put(secureRoute, artistsController.editArtist)
  .delete(secureRoute, artistsController.removeArtist)

router.route('/artists/:artistId/songs/:songId')
  .post(secureRoute, artistsController.addSongToArtist)

router.route('/artists/:artistId/albums/:albumId')
  .post(secureRoute, artistsController.addAlbumToArtist)


//! Playlist routes
router.route('/playlist')
  .get(playlistsController.playlistIndex)
  .post(secureRoute, playlistsController.add)

router.route('/playlist/:playlistId')
  .get(playlistsController.playlist)
  .put(secureRoute, playlistsController.edit)
  .delete(secureRoute, playlistsController.remove)

// Get Current Users Playlist
router.route('/getusersplaylist')
  .get(secureRoute, playlistsController.getUsersPlaylist)

router.route('/playlist/:playlistId/songs/:songId')
  .post(secureRoute, playlistsController.addSong)
  .delete(secureRoute, playlistsController.removeSong)

router.route('/playlist/:playlistId/songs')
  .get(playlistsController.songs)



router.route('/like/:type/:id/:plusOrMinus')
  .post(secureRoute, likesController.like)

export default router

