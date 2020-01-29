const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Workout = require('./models/workout');

let mongoose = require('mongoose');
let db = require('./models');

mongoose.connect('mongodb://localhost/workout', {
  useNewUrlParser: true,
  useFindAndModify: false
});

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('tiny'));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'));
});

app.get('/api/workouts', async (req, res) => {
  Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/api/workouts', async (req, res) => {
  const workout = new Workout({ exercises: req.body });
  Workout.create(workout)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put('/api/workouts/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  Workout.findById(id)
    .then(dbWorkout => {
      dbWorkout.exercises.push(data);
      return dbWorkout;
    })
    .then(dbWorkout => {
      Workout.findOneAndUpdate(
        { _id: id },
        { exercises: dbWorkout.exercises },
        { new: true }
      )
        .then(dbWorkout => {
          res.json(dbWorkout);
        })
        .catch(err => {
          res.json(err);
        });
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/api/workouts/range', async (req, res) => {
  Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log('App now listening at localhost:' + PORT);
});
