import { NotAuthorized, NotFound } from '../lib/errors.js'
import Playlist from '../models/playlistModel.js'
import Song from '../models/songModel.js'
import User from '../models/userModel.js'


//! Get all playlist
async function playlistIndex(req, res, next) {
  try {
    const playlist = await Playlist.find().populate('users').populate('user')
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
// ! Get a Users Playlists
async function getUsersPlaylist(req, res, next) {
  try {
    req.body.user = req.currentUser
    const userplaylist = await Playlist.find({
      user: req.body.user._id,
    }).populate('songs')
    return res.status(200).send(userplaylist)
  } catch (e) {
    next(e)
  }
}

//! get a particular playlist
async function playlist(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
      .populate('songs')
      .populate('users')
      .populate('user')

    if (!playlist) {
      throw new NotFound(`Playlist with id: ${playlistId} does not exist.`)
    }
    res.status(200).json(playlist)
  } catch (e) {
    next(e)
  }
}


//! Get all songs from playlist
async function songs(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId).populate('songs')
    if (!playlist) {
      throw new NotFound(`Playlist with id: ${playlistId} does not exist.`)
    }
    res.status(200).json(playlist.songs)
  } catch (err) {
    next(err)
  }
}


//! Create a playlist
async function add(req, res, next) {
  try {
    req.body.user = req.currentUser
    req.body.users = req.currentUser
    const playlist = await Playlist.create(req.body)
    await playlist.save()
    const user = await User.findById(req.currentUser._id)
    user.playlists.push(playlist)
    const savedUser = await user.save()
    res.status(200).json(savedUser)
  } catch (e) {
    next(e)
  }
}


//! Edit an playlist
async function edit(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      throw new NotFound(`Playlist with id: ${playlistId} does not exist.`)
    }
    if (!playlist.public && !playlist.users.includes(req.currentUser._id)) {
      throw new NotAuthorized()
    }
    const editedPlaylist = await Playlist.updateOne(
      { _id: playlistId },
      req.body
    )
    if (editedPlaylist.nModified < 1) {
      res.sendStatus(304)
    }
    res.status(200).json(await Playlist.findById(playlistId))
  } catch (err) {
    next(err)
  }
}


//! Delete a playlist 
async function remove(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist.public && !playlist.users.includes(req.currentUser._id)) {
      throw new NotAuthorized()
    }
    await Playlist.deleteOne({ _id: playlist._id })
    res.sendStatus(202)
  } catch (err) {
    next(err)
  }
}


//! Add a song to a playlist 
async function addSong(req, res, next) {
  console.log('Adding song to playlist')
  try {
    const { playlistId, songId } = req.params
    req.body.user = req.currentUser
    console.log('request params: ', req.params)
    const playlist = await Playlist.findById(playlistId)
    // console.log('Playlist User', typeof playlist.user)
    // console.log('Req Current User', typeof req.currentUser._id)
    // console.log(playlist.public)
    // console.log('current user owns playlist?', playlist.user._id.equals(req.currentUser._id))
    if (!playlist) {
      throw new NotFound(`Playlist with id: ${playlistId} does not exist.`)
    }
    if (!playlist.public && !playlist.user._id.equals(req.currentUser._id)) {
      throw new NotAuthorized()
    }

    const song = await Song.findById(songId)
    playlist.songs.push(song)

    const playlistWithNewSong = await playlist.save()
    res.status(200).json(playlistWithNewSong.songs)

  } catch (err) {
    next(err)
  }
}


//! Remove a song from a playlist
async function removeSong(req, res, next) {
  try {
    const { playlistId, songId } = req.params
    const playlist = await Playlist.findById(playlistId).populate('songs')
    if (!playlist) {
      throw new NotFound(`Playlist with id: ${playlistId} does not exist.`)
    }
    if (!playlist.public && !playlist.users.includes(req.currentUser._id)) {
      throw new NotAuthorized()
    }
    const song = playlist.songs.findIndex((song) => song.equals(songId))
    if (song === -1) {
      throw new NotFound(`Song with id: ${songId} does not exist.`)
    }
    playlist.songs.splice(song, 1)
    const playlistWithDeletedSong = await playlist.save()
    res.status(200).json(playlistWithDeletedSong.songs)
  } catch (err) {
    next(err)
  }
}

export default {
  getUsersPlaylist,
  playlistIndex,
  playlist,
  add,
  edit,
  remove,
  songs,
  addSong,
  removeSong,
}
