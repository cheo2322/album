const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Album } = require('../models/album');
const { Sticker } = require('../models/sticker');

router.get(`/`, async (req, res) => {
  const stickers = await Sticker.find();

  if (!stickers) {
    return res.status(500).json({ success: false });
  }

  res.send(stickers);
});

router.post(`/`, async (req, res) => {
  await Sticker.remove({});

  let data = [
    'FWC',
    'QAT',
    'ECU',
    'SEN',
    'NED',
    'ENG',
    'IRN',
    'USA',
    'WAL',
    'ARG',
    'KSA',
    'MEX',
    'POL',
    'FRA',
    'AUS',
    'DEN',
    'TUN',
    'ESP',
    'CRC',
    'GER',
    'JPN',
    'BEL',
    'CAN',
    'MAR',
    'CRO',
    'BRA',
    'SRB',
    'SUI',
    'CMR',
    'POR',
    'GHA',
    'URU',
    'KOR',
  ];

  for (let i = 0; i <= 29; i++) {
    let stickerCode = data[0] + i;

    let sticker = new Sticker({
      code: stickerCode,
    });

    sticker = await sticker.save();

    if (!sticker) {
      return res.status(400).send('Problem with sticker ' + stickerCode);
    }
  }

  for (let i = 1; i <= data.length; i++) {
    for (let j = 0; j <= 19; j++) {
      let stickerCode = data[i] + j;

      let sticker = new Sticker({
        code: stickerCode,
      });

      sticker = sticker.save();

      if (!sticker) {
        return res.status(400).send('Problem with sticker ' + stickerCode);
      }
    }
  }

  res.send({ message: 'OK' });
});

// router.post('/', async (req, res) => {
//   let user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     passwordHash: bcrypt.hashSync(req.body.password, 10),
//     phone: req.body.phone,
//     isAdmin: req.body.isAdmin,
//     street: req.body.street,
//     apartment: req.body.apartment,
//     zip: req.body.zip,
//     city: req.body.city,
//     country: req.body.country,
//   });

//   user = await user.save();

//   if (!user) {
//     return res.status(400).send('The user cannot be created!');
//   }

//   res.send(user);
// });

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30m',
      }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send('Password is wrong');
  }
});

router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    userCount: userCount,
  });
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: 'the user is deleted!',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'user not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
