const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '..', 'data', 'tasks.json');

function getTasks() {
    if (fs.existsSync(tasksPath)) {
        const tasksJson = fs.readFileSync(tasksPath, 'utf8');
        return JSON.parse(tasksJson);
    }
    return [];
}

function saveTasks(tasks) {
    const tasksJson = JSON.stringify(tasks);
    fs.writeFileSync(tasksPath, tasksJson);
}

module.exports = (app) => {
    app.post('/poll', (req, res) => {
        const taskId = req.body.taskId;
        const tasks = getTasks();
        const task = tasks.find(task => task.id == taskId);

        if (task) {
            task.votes = task.votes ? task.votes + 1 : 1;  // Increment vote count
            saveTasks(tasks);
            res.json({ success: true, task });
        } else {
            res.status(404).json({ success: false, error: 'Task not found' });
        }
    });
};
