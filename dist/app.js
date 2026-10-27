"use strict";
const todoForm = document.getElementById('todo-form');
const taskNameInput = document.getElementById('task-name');
const dueDateInput = document.getElementById('due-date');
const taskList = document.getElementById('task-list');
let tasks = loadTasksFromLocalStorage();
renderTasks();
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name || !dueDate)
        return;
    const newTask = {
        id: Date.now().toString(),
        name: name,
        dueDate: dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
    todoForm.reset();
});
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = task.name;
        const dateSpan = document.createElement('span');
        dateSpan.className = 'due-date';
        dateSpan.textContent = `(Due: ${task.dueDate})`;
        taskDetails.appendChild(checkbox);
        taskDetails.appendChild(taskSpan);
        taskDetails.appendChild(dateSpan);
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        li.appendChild(taskDetails);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}
function toggleTaskCompletion(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return Object.assign(Object.assign({}, task), { completed: !task.completed });
        }
        return task;
    });
    saveTasksToLocalStorage();
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
}
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        try {
            return JSON.parse(storedTasks);
        }
        catch (e) {
            console.error('Failed to parse tasks from localStorage', e);
            return [];
        }
    }
    return [];
}
