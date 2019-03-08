const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemoSchema = new Schema({
  writer: String,
  contents: String,
  starred: [String],
  date: {
    created: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now }
  },
  is_edited: { type: Boolean, default: false }
});

const Memo = mongoose.model('memo', MemoSchema);

module.exports = {
  Memo: Memo
};
