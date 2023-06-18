const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '..', 'data', 'tasks.json');
const lastIdPath = path.join(__dirname, '..', 'data', 'lastId.json');

function getTasks() {
    if (fs.existsSync(tasksPath)) {
        const tasksJson = fs.readFileSync(tasksPath, 'utf8');
        return JSON.parse(tasksJson);
    }
    return [];
}

function getLastId() {
    if (fs.existsSync(lastIdPath)) {
        const lastIdJson = fs.readFileSync(lastIdPath, 'utf8');
        return JSON.parse(lastIdJson).lastId;
    }
    return 0;
}

function incrementAndSaveLastId() {
    const lastId = getLastId();
    const incrementedId = lastId + 1;
    const lastIdJson = JSON.stringify({ lastId: incrementedId });
    fs.writeFileSync(lastIdPath, lastIdJson);
    return incrementedId;
}

function saveTasks(tasks) {
    const tasksJson = JSON.stringify(tasks);
    fs.writeFileSync(tasksPath, tasksJson);
}

module.exports = (app) => {
    app.get('/tasks', (req, res) => {
        const tasks = getTasks();
        res.json(tasks);
    });

    app.post('/tasks', (req, res) => {
        const { description, priority } = req.body;
        const tasks = getTasks();
        const newTaskId = incrementAndSaveLastId();
        const newTask = { id: newTaskId, description, priority, completed: false };
        tasks.push(newTask);
        saveTasks(tasks);
        res.json({ success: true, tasks });
    });

    app.put('/tasks/:id', (req, res) => {
        const id = Number(req.params.id);
        const tasks = getTasks();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            res.json({ success: true, tasks });
        } else {
            res.status(404).json({ success: false, error: 'Task not found' });
        }
    });

    
};
