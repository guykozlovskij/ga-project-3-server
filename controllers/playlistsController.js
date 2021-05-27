import Playlist from '../models/playlistModel.js'
import Song from '../models/songModel.js'

//! Get all playlist
async function playlistIndex(req, res, next) {
  try {
    const playlist = await Playlist.find().populate('users')
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! get a particular playlist
async function playlist(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
      .populate('songs')
      .populate('users')


    if (!playlist) {
      return res.status(404).json({ error: { message: 'Unauthorized' } })
    }
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}

//! get all songs from playlist
async function songs(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId).populate('songs')
    if (!playlist) {
      res.send(404).json({ error: { message: 'Playlist not found' } })
    }
    res.status(200).json(playlist.songs)
  } catch (err) {
    next(err)
  }
}

//! add a playlist
async function add(req, res, next) {
  try {
    req.body.users = req.currentUser
    const playlist = await Playlist.create(req.body)
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! edit an playlist
async function edit(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    if (playlist.type.toLowerCase() === 'private' && !playlist.users.includes(req.currentUser._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    const editedPlaylist = await Playlist.updateOne({ '_id': playlistId }, req.body)
    if (editedPlaylist.nModified < 1) {
      res.sendStatus(304)
    }
    res.status(200).json(await Playlist.findById(playlistId))


  } catch (err) {
    next(err)
  }
}

//! delete a playlist 
async function remove(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (playlist.type.toLowerCase() === 'private' && !playlist.users.includes(req.currentUser._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    await Playlist.deleteOne({ _id: playlist._id })
    res.sendStatus(202)
  } catch (err) {
    next(err)
  }
}
//! add a song to a playlist 
async function addSong(req, res, next) {
  try {
    const { playlistId, songId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      res.send(404).json({ error: { message: 'Playlist not found' } })
    }
    if (playlist.type.toLowerCase() === 'private' && !playlist.users.includes(req.currentUser._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    const song = await Song.findById(songId)
    playlist.songs.push(song)
    const playlistWithNewSong = await playlist.save()
    res.status(200).json(playlistWithNewSong.songs)
  } catch (err) {
    next(err)
  }
}

//! delete a song from playlist
async function removeSong(req, res, next) {
  try {
    const { playlistId, songId } = req.params
    const playlist = await Playlist.findById(playlistId).populate('songs')
    if (!playlist) {
      return res.status(404).json({ error: { message: 'Playlist not found' } })
    }
    if (playlist.type.toLowerCase() === 'private' && !playlist.users.includes(req.currentUser._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    const song = playlist.songs.findIndex((song) => song.equals(songId))
    if (song === -1) {
      return res.status(404).json('Not found')
    }
    playlist.songs.splice(song, 1)
    const playlistWithDeletedSong = await playlist.save()
    res.status(200).json(playlistWithDeletedSong.songs)
  } catch (err) {
    next(err)
  }
}


export default {
  playlistIndex,
  playlist,
  add,
  edit,
  remove,
  songs,
  addSong,
  removeSong
}