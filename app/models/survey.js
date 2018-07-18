const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  response: {
    type: Boolean,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Survey', surveySchema)
