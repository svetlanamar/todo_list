const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');
const tasksRoutes = require('./routes/tasks');
const pollRoutes = require('./routes/poll');

const app = express();

app.use(bodyParser.json());  // Parse JSON body
app.use(express.static(path.join(__dirname, '..', 'public')));  // Serve static files

tasksRoutes(app);
pollRoutes(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tasks.html'));
});

app.listen(3000, () => console.log('Server is running...'));

