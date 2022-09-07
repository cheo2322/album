const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
});

stickerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

stickerSchema.set('toJSON', {
  virtuals: true,
});

exports.Sticker = mongoose.model('Sticker', stickerSchema);

exports.stickerSchema = stickerSchema;
