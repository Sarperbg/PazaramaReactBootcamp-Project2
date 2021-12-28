const LOCAL_STORAGE_KEY = "NAME";

// Tüm elementleri seçiyoruz.
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const logoutButton = document.querySelector("#logout");
const addButton = document.querySelector("#addBtn");
const userName = getName();

function getName() {
  const name = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(name === null) return prompt('Lütfen isminizi giriniz');
  else return name;
}

eventListeners();
listTodos();

function eventListeners() {
  form.addEventListener("submit", addTodo);
  secondCardBody.addEventListener("click", deleteTodo);
  logoutButton.addEventListener("click", logout);
}

function listTodos() {
  getTodosFromApi()
  .then( todoList => {
      todoList.forEach( todo => {
        addTodoUI(todo.content, todo.id);
      });
  })
  .catch( err => {
      showAlert("danger","Todoları çekerken bir hata oluştu: "+err);
  })
}

// Bütün todoları silme işlemi.
function logout(event) {
  if (confirm("Çıkış yapmak istediğine emin misin?")) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    location.reload();
  }
}
// todoları tek tek silme işlemi.
function deleteTodo(event) {
  if (event.target.className === "fa fa-remove");
  {
    deleteTodoOnApi(event.target.parentElement.parentElement.id)
    .then( res => {
      event.target.parentElement.parentElement.remove();
      showAlert("success", "Todo başarıyla silindi");
    })
    .catch( err => showAlert("danger","Bir hata oluştu. Todo silinemedi: "+err))
  }
}
function addTodo(event) {
  //trim fonksiyonu ile sağ ve sol tarafdaki değerleri kaldırdık.
  const newTodo = todoInput.value.trim();
  // input fieldi boş olmamalı, en az 3 karater içermeli.
  if (newTodo.length < 3) {
    showAlert("danger", "Lütfen en az 3 karakterli bir todo girin...");
  } else {

    postTodoToApi({
      userName: userName,
      content:newTodo,
      isCompleted: false
    })
    .then( res => {
      addTodoUI(newTodo, res.id);
      showAlert("success", "Başarıyla Eklnedi");
    })
    .catch( err => showAlert('danger'+err))
  }
  event.preventDefault();
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  // Set Time out fonksiyonu ile 1 saniye sonra kaldırmak istediğimiz mesajı kaldırdık.
  setTimeout(function () {
    alert.remove();
  }, 1000);
}
function addTodoUI(newTodo, id) {
  // string değerini list item olarak arayüze ekliyoruz.

  // list item oluşturduk.
  const listItem = document.createElement("li");
  //link elementini oluşturduk.
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class= 'fa fa-remove'></i>";
  listItem.className = "list-group-item d-flex justify-content-between";
  listItem.id = id;

  // Text node ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  // Todo List'e List Item'ı ekleme
  todoList.appendChild(listItem);
  todoInput.value = "";
}

// Example POST method implementation:
async function postTodoToApi(todo = {}) {
  // Default options are marked with *
  const response = await fetch("https://61c48fd4f1af4a0017d99673.mockapi.io/todos", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(todo), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Example GET method implementation:
async function getTodosFromApi() {
  // Default options are marked with *
  const response = await fetch("https://61c48fd4f1af4a0017d99673.mockapi.io/todos", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Accept": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Example PUT method implementation:
async function updateTodoOnApi(todo = {}, id = -1) {
  // Default options are marked with *
  const response = await fetch(`https://61c48fd4f1af4a0017d99673.mockapi.io/todos/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(todo), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Example DELETE method implementation:
async function deleteTodoOnApi(id=-1) {
  // Default options are marked with *
  const response = await fetch(`https://61c48fd4f1af4a0017d99673.mockapi.io/todos/${id}`, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Accept": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
