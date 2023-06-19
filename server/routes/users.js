const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

function getUsers() {
    if (fs.existsSync(usersPath)) {
        const usersJson = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(usersJson);
    }
    return [];
}

function saveUsers(users) {
    const usersJson = JSON.stringify(users);
    fs.writeFileSync(usersPath, usersJson);
}

module.exports = (app) => {
    app.post('/signup', (req, res) => {
        const { username, password } = req.body;
        const users = getUsers();

        if (users.some(user => user.username === username)) {
            res.status(400).json({ success: false, error: 'Username already exists' });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = { username, password: hashedPassword };
            users.push(newUser);
            saveUsers(users);
            req.session.user = newUser;
            res.json({ success: true });
        }
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        const users = getUsers();
        const user = users.find(user => user.username === username);

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Invalid username or password' });
        }
    });

    app.post('/logout', (req, res) => {
        req.session.destroy();
        res.json({ success: true });
    });
};
