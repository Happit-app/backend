var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Habits = require('../models/habits');
var Success = require('../models/success');

router.get('/:id', function(req, res, next) {
  Habits.getOne(req.params.id).then(function(data) {
    return knex('habits_users').where({ habit_id : req.params.id }).pluck('success').then(function(successData) {
      if(successData.length) {
        data.dates = successData;
      }
    }).then(function() {
      res.send(data);
    })
  });
});

router.post('/', function(req, res, next) {
  Habits.add(req.body).then(function(data) {
    res.send(data);
  });
});

router.post('/:id/success', function(req, res, next) {
  Success.markDone(req.params.id, req.body.date).then(function(data) {
    res.send(data);
  });
});

router.put('/:id/update', function(req, res, next) {
  Habits.update(req.body, req.params.id).then( function(data) {
    res.send(data);
  });
});

router.delete('/:id/delete', function(req, res, next) {
  Habits.delete(req.params.id).then( (data) => {
    res.send(data);
  });
});

router.delete('/:id/success/:date', function(req, res, next) {
  Success.remove(req.params.id, req.params.date).then((data) => {
    res.sendStatus(204);
  });
});

module.exports = router;
