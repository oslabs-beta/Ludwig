const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  uri: {type: String, required: true},
  ariaRec: {type: Object, required: true}
}, {
  timestamps: true,
});

module.exports = mongoose.model('doc', docSchema);