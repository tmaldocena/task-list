const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const modalButton = document.getElementById("modalButton");
const completedFilter = document.getElementById("completedFilter");
const pendingFilter = document.getElementById("pendingFilter");

addTaskBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", closeModalHandler);
modalButton.addEventListener("click", modalButtonHandler);
completedFilter.addEventListener("change", filterTasks);
pendingFilter.addEventListener("change", filterTasks);

let editingIndex = -1; // Index de la tarea en edición (-1 si no hay edición)



function openModal() {
  modal.style.display = "block";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  modalTitle.textContent = "Agregar Tarea";
  editingIndex = -1;
}

function closeModalHandler() {
  modal.style.display = "none";
  editingIndex = -1;
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function modalButtonHandler() {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  
  if (title === "") {
    alert("Por favor ingrese un título para la tarea.");
    return;
  }
  
  if (editingIndex === -1) {
    const task = {
      title: title,
      description: description,
      completed: false
    };
    tasks.push(task);
  } else {
    tasks[editingIndex].title = title;
    tasks[editingIndex].description = description;
  }
  isEmpty();
  saveTasksToLocalStorage();
  closeModalHandler();
  renderTasks();
}

function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasksToLocalStorage();
  renderTasks();
}

function editTask(index) {
  editingIndex = index;
  const task = tasks[index];
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  modalTitle.textContent = "Editar Tarea";
  modal.style.display = "block";
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocalStorage();
  renderTasks();
  isEmpty();
}

function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.classList.add("li-flex");
    if (task.completed) {
      taskItem.classList.add("completed");
    }
    taskItem.innerHTML = `
      <div class='task__text'>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
      </div>
      <div class='group-btn'>
        <button class='btn' title='Check' onclick="toggleCompleted(${index})"><span class="material-symbols-rounded">${task.completed ? "close" : "check"}</span</button>
        <button class='btn' title='Edit' onclick="editTask(${index})"><span class="material-symbols-rounded">edit</span></button>
        <button class='btn' title='Delete' onclick="deleteTask(${index})"><span class="material-symbols-rounded">delete</span></button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function filterTasks() {
  const showCompleted = completedFilter.checked;
  const showPending = pendingFilter.checked;
  
  const filteredTasks = tasks.filter(task => {
    return (showCompleted && task.completed) || (showPending && !task.completed);
  });
  
  renderTasks(filteredTasks);
}

function isEmpty(){
  if(tasks.length === 0){
    document.getElementById('filters').style.display = 'none';
    const empty = document.createElement('li');
    empty.innerHTML = `<p class='empty'>There's no tasks currently...</p>`;
    taskList.append(empty);
  }else{
    document.getElementById('filters').style.display = 'flex';
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks.length = 0; // Clear the current tasks array
    tasks.push(...JSON.parse(storedTasks));
  }
}

const tasks = [{
  title: 'Example Task',
  description: 'This is just an example of a task.',
  completed: false
}];


completedFilter.checked = true;
pendingFilter.checked = true;
loadTasksFromLocalStorage();
closeModalHandler();
renderTasks();
