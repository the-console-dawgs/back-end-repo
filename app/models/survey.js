const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response'
  }]
}, {
  timestamps: true
})

const responseSchema = new mongoose.Schema({
  value: String,
  survey: {
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
