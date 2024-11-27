
const taskInput = document.getElementById('taskInput');
const descriptionInput = document.getElementById('descriptionInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const alphabeticalSortBtn = document.getElementById('alphabeticalSort');
const dateSortBtn = document.getElementById('dateSort');
const clearCompletedBtn = document.getElementById('clearCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span contenteditable="true" data-index="${index}" class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <p contenteditable="true" data-index="${index}" class="${task.completed ? 'completed' : ''}">${task.description}</p>
            <p>Due: ${task.dueDate}</p>
            <button data-index="${index}" class="${task.completed ? 'complete' : ''}"><i class="fas fa-${task.completed ? 'check-circle' : 'circle'}"></i></button>
            <button data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        taskList.appendChild(li);
    });

    const deleteButtons = document.querySelectorAll('li button:last-child');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteTask);
    });

    const completeButtons = document.querySelectorAll('li button:first-of-type');
    completeButtons.forEach(button => {
        button.addEventListener('click', toggleComplete);
    });

    const editableSpans = document.querySelectorAll('li span[contenteditable], li p[contenteditable]');
    editableSpans.forEach(span => {
        span.addEventListener('blur', updateTask);
    });
}

// Add task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const taskDescription = descriptionInput.value.trim();
    const dueDate = dateInput.value;

    if (taskText && dueDate) {
        const task = {
            text: taskText,
            description: taskDescription,
            dueDate: dueDate,
            completed: false
        };
        tasks.push(task);
        saveTasksToLocalStorage();
        renderTasks();
        taskInput.value = '';
        descriptionInput.value = '';
        dateInput.value = '';
    }
});

// Delete task
function deleteTask(e) {
    const index = parseInt(e.target.parentNode.dataset.index);
    tasks.splice(index, 1);
    saveTasksToLocalStorage();
    renderTasks();
}

// Update task
function updateTask(e) {
    const index = parseInt(e.target.dataset.index);
    if (e.target.tagName === 'SPAN') {
        const newText = e.target.textContent.trim();
        tasks[index].text = newText;
    } else if (e.target.tagName === 'P') {
        const newDescription = e.target.textContent.trim();
        tasks[index].description = newDescription;
    }
    saveTasksToLocalStorage();
}

// Toggle task completion
function toggleComplete(e) {
    const index = parseInt(e.target.parentNode.dataset.index);
    tasks[index].completed = !tasks[index].completed;
    saveTasksToLocalStorage();
    renderTasks();
}

// Sort tasks alphabetically
alphabeticalSortBtn.addEventListener('click', () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    renderTasks();
});

// Sort tasks by date
dateSortBtn.addEventListener('click', () => {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToLocalStorage();
    renderTasks();
});

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage on page load
function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
    }
    renderTasks();
}

// Initialize the application
loadTasksFromLocalStorage();