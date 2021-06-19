"use strict";

const key = { book: "BOOK" };

// Data
let data = [];

// Localstorage
const localStorage = window.localStorage;

// Element
const modal = document.getElementById("my_modal");
const titleModal = document.getElementById("title_modal");
const titleButton = document.getElementById("title_button");

// Tabs
const tabs1 = document.getElementById("tabs_1");
const tabs2 = document.getElementById("tabs_2");
const notRead = document.getElementById("not_read");
const finishRead = document.getElementById("finish_read");
const listBook = document.getElementById("my_list_book");
const listBookFinish = document.getElementById("my_list_book_finish");

// Form
const formAdd = document.getElementById("form_add");

// LocalStorage Function
function init() {
  if (!!localStorage.getItem(key.book))
    data = JSON.parse(localStorage.getItem(key.book));
  else data = [];

  notRead.classList.remove("is-hidden");
  finishRead.classList.add("is-hidden");
  tabs1.classList.add("is-active");
  tabs2.classList.remove("is-active");

  getBooks();
}

function syncData() {
  localStorage.setItem(key.book, JSON.stringify(data));
  data = JSON.parse(localStorage.getItem(key.book));

  getBooks();
}
// END

// Element Function
function getBooks() {
  listBook.innerHTML = "";
  listBookFinish.innerHTML = "";

  if (!!data.length) {
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      addListBook(el);
    }
  }
}

function addListBook(el) {
  const isComplete = el.isComplete;
  const payload = `
    <tr>
      <td>${el.title}</td>
      <td>${el.author}</td>
      <td>${el.year}</td>
      <td>
      <button class="button is-ghost" onclick="openEditModal(${el.id})"><strong>EDIT</strong></button>
      <button class="button is-danger" onclick="deleteList(${el.id})"><strong>HAPUS</strong></button>
      </td>
    </tr>
  `;

  if (isComplete) listBookFinish.innerHTML += payload;
  else if (!isComplete) listBook.innerHTML += payload;
  else {
    listBook.innerHTML = "";
    listBookFinish.innerHTML = "";
  }
}

function openModal() {
  modal.classList.add("is-active");
  titleModal.innerHTML = "Tambah";
  titleButton.innerHTML = "TAMBAH";

  formAdd.reset();
}

function openEditModal(id) {
  const payload = data.find((el) => el.id === id);

  if (!!payload) {
    modal.classList.add("is-active");
    titleModal.innerHTML = `Edit ${payload?.title}`;
    titleButton.innerHTML = "UPDATE";

    formAdd.elements["id"].value = id;
    formAdd.elements["title"].value = payload?.title;
    formAdd.elements["author"].value = payload?.author;
    formAdd.elements["year"].value = payload?.year;
    formAdd.elements["isComplete"].value =
      payload?.isComplete === false ? "not_finish" : "finish";
  }
}

function closeModal() {
  modal.classList.remove("is-active");
}
// END

// CRUD
function saveList(e) {
  data.push(e);
  syncData();
}

function deleteList(e) {
  data.forEach(function (v, index) {
    if (v.id === e) data.splice(index, 1);
  });

  syncData();
}

function updateList(e) {
  data.forEach(function (v, index) {
    if (v.id === e?.id) data.splice(index, 1);
  });
  data.push(e);

  syncData();
}
// END

// Event Listener
document.addEventListener("DOMContentLoaded", function () {
  tabs1.addEventListener("click", function () {
    notRead.classList.remove("is-hidden");
    finishRead.classList.add("is-hidden");
    tabs1.classList.add("is-active");
    tabs2.classList.remove("is-active");
  });

  tabs2.addEventListener("click", function () {
    notRead.classList.add("is-hidden");
    finishRead.classList.remove("is-hidden");
    tabs1.classList.remove("is-active");
    tabs2.classList.add("is-active");
  });

  formAdd.addEventListener("submit", function (e) {
    const theID = formAdd.elements["id"].value;
    let payload = {
      id: +theID || +new Date(),
      title: formAdd.elements["title"].value,
      author: formAdd.elements["author"].value,
      year: formAdd.elements["year"].value,
      isComplete:
        formAdd.elements["isComplete"].value === "not_finish" ? false : true,
    };

    if (theID !== "") updateList(payload);
    else saveList(payload);

    closeModal();
    e.preventDefault();
  });

  init();
});
// END
