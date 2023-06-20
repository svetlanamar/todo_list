const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const tasksRoutes = require('./routes/tasks');
const pollRoutes = require('./routes/poll');
const userRoutes = require('./routes/users');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(bodyParser.json());  // Parse JSON body
app.use(express.static(path.join(__dirname, '..', 'public')));  // Serve static files

// The routes after the middleware
tasksRoutes(app);
pollRoutes(app);
userRoutes(app);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'tasks.html'));
});

app.listen(3000, () => console.log('Server is running...'));
