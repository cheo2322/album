const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Album } = require('../models/album');
const { Sticker } = require('../models/sticker');

router.post(`/`, async (req, res) => {
  const user = await User.findById(req.body.user);

  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }

  let album = new Album({
    user: req.body.user,
  });

  album = await album.save();

  if (!album) {
    return res.status(400).send('The album cannot be created!');
  }

  res.send(album);
});

router.get(`/:id`, async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    return res.status(404).json({ message: 'Album not found!' });
  }

  res.send(album);
});

router.get(`/:id/details`, async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json({ message: 'Album not found!' });
  }

  let remaining = [];
  let missing = [];

  for (let i = 0; i < album.remainingStickers.length; i++) {
    let sticker = await Sticker.findById(album.remainingStickers.at(i));

    remaining.push(sticker.code);
  }

  for (let i = 0; i < album.missingStickers.length; i++) {
    let sticker = await Sticker.findById(album.missingStickers.at(i));

    missing.push(sticker.code);
  }

  res.json({ remaining: remaining, missing: missing });
});

router.put(`/:id/stickers`, async (req, res) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    {
      remainingStickers: req.body.remainingStickers,
      missingStickers: req.body.missingStickers,
    },
    { new: true }
  );

  if (!album) return res.status(400).send('Album not found!');

  res.send({ message: 'OK' });
});

module.exports = router;
