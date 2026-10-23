// To-Do List application
const STORAGE_KEY = "todoTasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const errorMsg = document.getElementById("errorMsg");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");
const filterBtns = document.querySelectorAll(".btn-filter");

let tasks = loadTasks();
let currentFilter = "all";

// ---------- Local Storage (optional challenge) ----------
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) { /* storage unavailable: app still works in memory */ }
}

// ---------- Core actions ----------
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    errorMsg.textContent = "Please enter a task. It can't be empty or only spaces.";
    taskInput.classList.add("is-invalid");
    taskInput.focus();
    return;
  }
  errorMsg.textContent = "";
  taskInput.classList.remove("is-invalid");
  tasks.push({ id: Date.now(), text: text, completed: false });
  taskInput.value = "";
  saveTasks();
  render();
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
  render();
}

// ---------- Rendering ----------
function render() {
  const visible = tasks.filter(t =>
    currentFilter === "all" ? true :
    currentFilter === "active" ? !t.completed : t.completed
  );

  taskList.innerHTML = "";

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item empty-state";
    li.textContent = tasks.length === 0
      ? "No tasks yet. Add your first one above."
      : "No " + currentFilter + " tasks to show.";
    taskList.appendChild(li);
  }

  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = "list-group-item task-item" + (task.completed ? " done" : "");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "form-check-input";
    check.checked = task.completed;
    check.setAttribute("aria-label", "Mark task as completed");
    check.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text; // textContent prevents HTML injection

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-sm btn-delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(check, span, del);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
}

// ---------- Events ----------
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
taskInput.addEventListener("input", () => {
  errorMsg.textContent = "";
  taskInput.classList.remove("is-invalid");
});
clearBtn.addEventListener("click", clearCompleted);
filterBtns.forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));

document.getElementById("todayDate").textContent =
  new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

render();
