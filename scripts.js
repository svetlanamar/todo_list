document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const incompleteTaskList = document.getElementById("incompleteTaskList");
  const completedTaskList = document.getElementById("completedTaskList");

  function saveTaskToStorage(task, priority) {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.push({ task, priority, completed: false });
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  }

  function deleteTaskFromStorage(index) {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  }

  function toggleTaskCompletion(index) {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks[index].completed = !storedTasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
    displayStoredTasks();
  }

  function displayStoredTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    incompleteTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    storedTasks.forEach(({ task, priority, completed }, index) => {
      const li = document.createElement("li");
      li.classList.add(priority);
      li.innerHTML = `<input type="checkbox" class="completedCheck" ${completed ? "checked" : ""}> <span class="task-text ${completed ? "completed" : ""}">${task}</span> <span class="priority-label">(${priority.toUpperCase()})</span> <span class='deleteBtn'>Delete</span>`;

      const taskList = completed ? completedTaskList : incompleteTaskList;
      taskList.appendChild(li);

      li.querySelector(".deleteBtn").addEventListener("click", () => {
        deleteTaskFromStorage(index);
        displayStoredTasks();
      });

      li.querySelector(".completedCheck").addEventListener("change", () => {
        toggleTaskCompletion(index);
      });
    });
  }

  function addTask() {
    const task = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (task !== "") {
      saveTaskToStorage(task, priority);
      taskInput.value = "";
      displayStoredTasks();
    }
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  displayStoredTasks();
});
