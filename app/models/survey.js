const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

const responseSchema = new mongoose.Schema({
  value: Boolean,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey'
  }
})

const Response = mongoose.model('Response', responseSchema)
const Survey = mongoose.model('Survey', surveySchema)

module.exports = {
  Survey,
  Response
}
