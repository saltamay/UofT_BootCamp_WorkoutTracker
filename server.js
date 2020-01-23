const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('tiny'));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, function() {
  console.log('App now listening at localhost:' + PORT);
});
