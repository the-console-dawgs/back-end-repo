// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const mongoose = require('mongoose')

// pull in Mongoose model for responses
const modelsFile = require('../models/survey')
const Response = modelsFile.Response
const Survey = modelsFile.Survey

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /responses
router.get('/responses', requireToken, (req, res) => {
  Response.find()
    .then(responses => {
      // `responses` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return responses.map(response => response.toObject())
    })
    // respond with status 200 and JSON of the responses
    .then(responses => res.status(200).json({ responses: responses }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW SURVEY RESPONSES
// GET /reponses/5a7db6c74d55bc51bdf39793
router.get('/responses/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  let theSurvey
  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => {
      theSurvey = survey.toObject()
      const responses = Response.find({
        'survey': req.params.id
      })
      return responses
    })
    // attach the array of responses as property of survey
    .then(responses => {
      theSurvey.responses = responses.map(response => response.toObject())
    })
    // .then(console.log)
    // if `findById` is succesful, respond with 200 and "surveys" JSON
    .then(survey => res.status(200).json({ survey: theSurvey.responses }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// // SHOW
// // GET /responses/5a7db6c74d55bc51bdf39793
// router.get('/responses/:id', requireToken, (req, res) => {
//   // req.params.id will be set based on the `:id` in the route
//   Survey.findById(req.params.id)
//     .populate('responses')
//     .exec((error, survey) => {
//       if (error) {
//         console.error(error)
//       }
//       console.log('survey.responses is: ', survey.responses)
//       return survey
//     })
//     .then(handle404)
//     // if `findById` is succesful, respond with 200 and "responses" JSON
//     .then(response => res.status(200).json({ response: response.toObject() }))
//     // if an error occurs, pass it to the handler
//     .catch(err => handle(err, res))
// })

// CREATE
// POST /responses
router.post('/responses', requireToken, (req, res) => {
  // set owner of new responses to be current user
  // req.body.response.owner = req.user.id
  // console.log('response.survey ', req)
  let response = req.body.response
  const id = new mongoose.Types.ObjectId(req.body.response.surveyId)
  response.survey = id
  // response.survey = <Survey ID>
  Response.create(response)
    // respond to succesful `create` with status 201 and JSON of new "responses"
    .then(response => {
      res.status(201).json({ response: response.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /responses/5a7db6c74d55bc51bdf39793
router.patch('/responses/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.response.owner

  Response.findById(req.params.id)
    .then(handle404)
    .then(response => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, response)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.response).forEach(key => {
        if (req.body.response[key] === '') {
          delete req.body.response[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return response.update(req.body.response)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /responses/5a7db6c74d55bc51bdf39793
router.delete('/responses/:id', requireToken, (req, res) => {
  Response.findById(req.params.id)
    .then(handle404)
    .then(response => {
      // throw an error if current user doesn't own `responses`
      requireOwnership(req, response)
      // delete the responses ONLY IF the above didn't throw
      response.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
