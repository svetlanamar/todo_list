const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const completedTaskList = document.getElementById('completedTaskList');
const priorityInput = document.getElementById('priorityInput');
const pollContainer = document.getElementById('pollContainer');

function getTasksAndUpdateTaskList() {
    fetch('/tasks')
        .then(res => res.json())
        .then(data => {
            const completedTasks = data.filter(task => task.completed);
            const currentTasks = data.filter(task => !task.completed);
            updateTaskList(currentTasks, taskList);
            updateTaskList(completedTasks, completedTaskList);
            updatePollOptions(completedTasks);
        });
}

function updateTaskList(tasks, taskListElement) {
    taskListElement.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            fetch('/tasks/' + task.id, {
                method: 'PUT'
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    getTasksAndUpdateTaskList();
                }
            });
        });

       

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(task.description + ' (Priority: ' + task.priority + ')'));
        taskListElement.appendChild(li);
    });
}


getTasksAndUpdateTaskList();

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTask = taskInput.value;
    const newTaskPriority = priorityInput.value;

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newTask, priority: newTaskPriority })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            taskInput.value = '';
            getTasksAndUpdateTaskList();
        }
    });
});



function updatePollOptions(completedTasks) {
    pollContainer.innerHTML = '';
    completedTasks.forEach(task => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'pollOption';
        radio.value = task.id;
        const text = document.createTextNode(task.description);
        label.appendChild(radio);
        label.appendChild(text);
        pollContainer.appendChild(label);
    });

    const button = document.createElement('button');
    button.textContent = 'Vote';
    button.addEventListener('click', submitVote);
    pollContainer.appendChild(button);
}

function submitVote() {
    const selectedOption = document.querySelector('input[name="pollOption"]:checked');
    if (selectedOption) {
        fetch('/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskId: selectedOption.value })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`Task "${data.task.description}" now has ${data.task.votes} vote(s).`);
                getTasksAndUpdateTaskList();
            }
        });
    }
}

// Get the modals
var loginModal = document.getElementById('loginModal');
var signupModal = document.getElementById('signupModal');

// Get the button that opens the modals
var loginButton = document.getElementById('loginButton');
var signupButton = document.getElementById('signupButton');

// Get the <span> element that closes the modals
var loginClose = document.getElementsByClassName("close")[0];
var signupClose = document.getElementsByClassName("close")[1];

// Get the forms
var loginForm = document.getElementById('loginForm');
var signupForm = document.getElementById('signupForm');

// When the user clicks on the button, open the modal
loginButton.onclick = function() {
  loginModal.style.display = "block";
}

signupButton.onclick = function() {
  signupModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
loginClose.onclick = function() {
  loginModal.style.display = "none";
}

signupClose.onclick = function() {
  signupModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == signupModal) {
    signupModal.style.display = "none";
  }
}

// Add event listeners to the forms
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch('/login', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    // Handle response here
    console.log(data);
    loginModal.style.display = "none";
  })
  .catch(error => console.error('Error:', error));
});

signupForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(data => {
    // Handle response here
    console.log(data);
    signupModal.style.display = "none";
  })
  .catch(error => console.error('Error:', error));
});

