const showOn = document.getElementById("addBook");
const showOff = document.getElementById("close");
const overlay = document.getElementById("formBook");

showOn.addEventListener("click", function () {
  clear();
  overlay.style.display = "flex";
  const h2 = document.querySelector(".input_section .title-input h2");
  h2.innerText = "Tambahkan Buku Baru";

  const editNameButton = document.getElementById("bookSubmit");
  editNameButton.innerText = "Tambah Buku";
});

showOff.addEventListener("click", function () {
  overlay.style.display = "none";
  selectedEditBook.length = 0;
});

const STORAGE_KEY = "BOOKSHELF_APPS";
const SAVED_EVENT = "saved-book";

function storageExist() {
  if (typeof Storage === undefined) {
    alert("Lokal Storage Anda Tidak Didukung Browser");
    return false;
  }
  return true;
}

function saveData() {
  if (storageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("SAVED_EVENT"));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  overlay.style.display = "none";
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isEdit == true) {
      saveEditBook();
    } else {
      addBook();
    }
    clear();
    selectedEditBook.splice(0, selectedEditBook.length);
  });

  showOn.addEventListener("click", function (event) {
    event.preventDefault();
    overlay.style.display = "flex";
  });

  showOff.addEventListener("click", function (event) {
    event.preventDefault();
    overlay.style.display = "none";
  });
  if (storageExist()) {
    loadDataFromStorage();
  }
});

function clear() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  overlay.style.display = "none";
}

const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

document.addEventListener(RENDER_EVENT, () => {
  const unfinished = document.getElementById("incompleteBookshelfList");
  const finished = document.getElementById("completeBookshelfList");

  unfinished.innerHTML = "";
  finished.innerHTML = "";

  for (const book of books) {
    const bookElement = newBook(book);
    if (book.isCompleted) {
      finished.append(bookElement);
    } else {
      unfinished.append(bookElement);
    }
  }
});

function addBook() {
  isEdit = false;
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function newBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Author: ${bookObject.author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Year: ${bookObject.year}`;

  const bookStatus = document.createElement("p");
  bookStatus.innerText = bookObject.isCompleted
    ? "Status: Selesai"
    : "Status: Belum Selesai";

  const content = document.createElement("div");
  content.classList.add("content");
  content.append(bookTitle, bookAuthor, bookYear, bookStatus);

  const action = document.createElement("div");
  action.classList.add("action");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.append(content, action);

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container", "center-icon");

  if (bookObject.isCompleted) {
    const undoIcon = document.createElement("i");
    undoIcon.classList.add("bi", "bi-arrow-clockwise");
    iconContainer.appendChild(undoIcon);

    const undoButton = document.createElement("button");
    undoButton.setAttribute("type", "button");
    undoButton.classList.add("undo");
    undoButton.appendChild(iconContainer);

    undoButton.addEventListener("click", function () {
      addUnfinished(bookObject.id);
    });

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square");
    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("edit");
    editButton.appendChild(editIcon);
    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash-fill");
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("delete");
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    action.appendChild(undoButton);
    action.appendChild(editButton);
    action.appendChild(deleteButton);
  } else {
    const doneIcon = document.createElement("i");
    doneIcon.classList.add("bi", "bi-check-circle");
    iconContainer.appendChild(doneIcon);

    const doneButton = document.createElement("button");
    doneButton.setAttribute("type", "button");
    doneButton.classList.add("done");
    doneButton.appendChild(iconContainer);

    doneButton.addEventListener("click", function () {
      addFinished(bookObject.id);
    });

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square");
    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("edit");
    editButton.appendChild(editIcon);
    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash-fill");
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("delete");
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    action.appendChild(doneButton);
    action.appendChild(editButton);
    action.appendChild(deleteButton);
  }

  const card = document.createElement("article");
  card.classList.add("card");
  card.append(cardBody);

  return card;
}

function addUnfinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function addFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

const selectedEditBook = [];
var isEdit = false;

function editBook(bookId) {
  isEdit = true;
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  selectedEditBook.push(bookTarget);
  overlay.style.display = "flex";
  document.getElementById("inputBookTitle").value = bookTarget.title;
  document.getElementById("inputBookAuthor").value = bookTarget.author;
  document.getElementById("inputBookYear").value = bookTarget.year;
  document.getElementById("inputBookIsComplete").checked =
    bookTarget.isCompleted;

  const h2 = document.querySelector(".input_section .title-input h2");
  h2.innerText = "Form Edit";

  const editNameButton = document.getElementById("bookSubmit");
  editNameButton.innerText = "Edit Book";
}

function saveEditBook() {
  isEdit = false;
  const getBookId = selectedEditBook[0].id;
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const bookTarget = findBook(getBookId);

  if (bookTarget == null) return;

  bookTarget.id = getBookId;
  bookTarget.title = title;
  bookTarget.author = author;
  bookTarget.year = year;
  bookTarget.isCompleted = isCompleted;

  selectedEditBook.splice(0, selectedEditBook.length);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  const confirmDelete = confirm("Apakah Anda Yakin Ingin Menghapus Buku Ini?");
  if (confirmDelete === true) {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    return;
  }

  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const search = document.getElementById("searchBookTitle");

search.addEventListener("keyup", function (event) {
  const searchBook = event.target.value.toLowerCase();
  const listBooks = document.querySelectorAll(".book_list article");

  listBooks.forEach((book) => {
    const bookTitle = book.querySelector(".content h3").innerText.toLowerCase();
    if (bookTitle.includes(searchBook)) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }
  });
});

const searchSubmit = document.getElementById("searchSubmit");

searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
});

const editIcon = document.createElement("i");
editIcon.classList.add("bi");
editIcon.classList.add("bi-pencil-square");

const editButton = document.createElement("button");
editButton.setAttribute("type", "button");
editButton.classList.add("edit");
editButton.append(editIcon);

editButton.addEventListener("click", function () {
  editBook(bookObject.id);
});

const deleteIcon = document.createElement("i");
deleteIcon.classList.add("bi");
deleteIcon.classList.add("bi-trash-fill");

const deleteButton = document.createElement("button");
deleteButton.setAttribute("type", "button");
deleteButton.classList.add("delete");
deleteButton.append(deleteIcon);

deleteButton.addEventListener("click", function () {
  deleteBook(bookObject.id);
});
