const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  remainingStickers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sticker',
      required: false,
    },
  ],
  missingStickers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sticker',
      required: false,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

albumSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

albumSchema.set('toJSON', {
  virtuals: true,
});

exports.Album = mongoose.model('Album', albumSchema);

exports.albumSchema = albumSchema;
