const express = require('express');
const morgan = require('morgan');
const path = require('path');
// const Workout = require('./models/workout');

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
  try {
    const workouts = await db.Workout.find();
    res.status(200).send(workouts);
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
});

app.post('/api/workouts', async (req, res) => {
  const workout = req.body;
  try {
    await db.Workout.workouts.insert(workout);
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
});

app.put('/api/workouts/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const workout = await db.Workout.findById(id);

  if (workout) {
    workout.exercises.push(data);
    await db.Workout.updateOne({ _id: id }, workout, { upsert: true });
    return res.status(200).json({
      success: true
    });
  }
});

app.get('/api/workouts/range', async (req, res) => {
  try {
    const workouts = await db.Workout.find();
    res.status(200).send(workouts);
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
});

app.listen(PORT, function() {
  console.log('App now listening at localhost:' + PORT);
});
