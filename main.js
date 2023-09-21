/*переменные*/
const entry = document.getElementById("entry");
const form = document.getElementById("form");
const ul = document.getElementById("todo-list");
const alertP = document.querySelector(".alert");
const clearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");
const cancelBtn = document.querySelector(".cancel-btn");

let editFlag = false;
let editElement;
let editID;
//let items =[]
let LSkey = "items";

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
cancelBtn.addEventListener("click", setBackToDefault);
window.addEventListener("DOMContentLoaded", setupItems);

function addItem(e) {
  e.preventDefault();
  let val = entry.value;
  let id = new Date().getTime().toString();

  if (val && !editFlag) {
    createList(val, id);
    displayAlert("Вы добавили элемент!", "alert-success");
    clearBtn.classList.remove("d-none");
    addToLS(val, id);
  } else if (val && editFlag) {
    editElement.innerText = val;
    displayAlert("Элемент изменен", "alert-success");
    editLS(val, editID);
    setBackToDefault();
  } else {
    displayAlert("Пожалуйста добавьте элемент", "alert-danger");
  }
  entry.value = null;
}

function createList(val, id) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.setAttribute("data-id", id);
  li.innerHTML = `<p class="text">${val}</p>
<i class="bx bxs-edit bx-sm"></i>
<i class="bx bx-check bx-sm"></i>
<i class="bx bxs-trash bx-sm"></i>`;
  //icons
  li.querySelector(".bx.bxs-edit").addEventListener("click", editItem);
  li.querySelector(".bx.bx-check").addEventListener("click", checkItem);
  li.querySelector(".bx.bxs-trash").addEventListener("click", deleteItem);

  ul.append(li);
}

function editItem() {
  console.log("edit");
  editFlag = true;
  console.log(this.previousElementSibling);
  editID = this.parentElement.dataset.id;
  let pText = this.previousElementSibling;
  editElement = pText;
  entry.value = this.previousElementSibling.innerText;
  submitBtn.innerText = "Edit";
  cancelBtn.classList.remove("d-none");
  ul.querySelectorAll(".bx").forEach((i) => {
    i.classList.add("v-none");
  });
  clearBtn.classList.add("d-none");
}
function checkItem() {
  this.parentElement.classList.toggle("liChecked");
  displayAlert("Задача выполнена", "alert-success");
}
function deleteItem() {
  console.log("delete");
  let id = this.parentElement.dataset.id;

  ul.removeChild(this.parentElement);
  displayAlert("Пожалуйста добавьте элемент", "alert-danger");
  if (ul.children.length === 0) {
    clearBtn.classList.add("d-none");
  }
  removeFromLS(id);
}

function displayAlert(message, styles) {
  alertP.innerText = message;
  alertP.classList.add(styles);
  setTimeout(() => {
    alertP.innerText = "";
    alertP.classList.remove(styles);
  }, 2000);
}

function clearItems() {
  ul.innerHTML = null;
  displayAlert("Пожалуйста добавьте элемент", "alert-danger");
  clearBtn.classList.add("d-none");
  localStorage.clear();
}

function setBackToDefault() {
  editFlag = false;
  editElement = undefined;
  editID = undefined;
  entry.value = null;
  submitBtn.innerText = "submit";
  cancelBtn.classList.add("d-none");
  ul.querySelectorAll(".bx").forEach((i) => {
    i.classList.remove("v-none");
  });
  clearBtn.classList.remove("d-none");
}

function addToLS(val, id) {
  let obj = { id, val };
  let items = getLS();
  items.push(obj);
  localStorage.setItem(LSkey, JSON.stringify(items));
}

function getLS() {
  return localStorage.getItem(LSkey)
    ? JSON.parse(localStorage.getItem(LSkey))
    : [];
}

function removeFromLS(id) {
  let items = getLS();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem(LSkey, JSON.stringify(items));
  if (items.length === 0) {
    localStorage.removeItem(LSkey);
  }
}
function editLS(val, editID) {
  let items = getLS();
  items = items.map((item) => {
    if (item.id === editID) item.val = val;
    return item;
  });
  localStorage.setItem(LSkey, JSON.stringify(items));
}

function setupItems() {
  let items = getLS();
  if (items.length > 0) {
    items.forEach((item) => {
      const { id, val } = item;
      createList(val);
    });
    clearBtn.classList.remove("d-none");
  }
}
