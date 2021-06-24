const workListEl = document.querySelector(".work_collection-doing");
const workListElDone = document.querySelector(".work_collection-done");
const workInputEl = document.querySelector(".work_input");
let mode = "doing";

// mode
function display(mode) {
  switch (mode) {
    case "doing":
      workListEl.style.display = "flex";
      workListElDone.style.display = "none";
      break;

    case "done":
      workListEl.style.display = "none";
      workListElDone.style.display = "flex";
      break;

    default:
      workListEl.style.display = "flex";
      workListElDone.style.display = "flex";
      break;
  }
}

function reset() {
  workListEl.innerHTML = "";
  workListElDone.innerHTML = "";
}

// Create work element
function createWorkEl(work) {
  const newWork = document.createElement("li");
  newWork.classList.add("work");
  newWork.innerHTML = `
  <p class="work_content">${work}</p>
  <i class="fas fa-times delete_item"></i>
  `;
  return newWork;
}

function iniStorage() {
  if (localStorage.getItem("doing") == null) {
    localStorage.setItem("doing", "[]");
  }

  if (localStorage.getItem("done") == null) {
    localStorage.setItem("done", "[]");
  }
}

function storeWorkInStorage(work, category) {
  iniStorage();

  let works = JSON.parse(localStorage.getItem(category));

  works.push(work);
  works = JSON.stringify(works);
  localStorage.setItem(category, works);
}

function deleteWorkInStorage(work, category) {
  iniStorage();
  let list = JSON.parse(localStorage.getItem(category));
  list = list.filter((workInStorage) => workInStorage != work);
  list = JSON.stringify(list);
  localStorage.setItem(category, list);
}

function displayWork(work, category) {
  if (category == "doing") {
    workListEl.appendChild(createWorkEl(work));
  } else if (category == "done") {
    let workEl = createWorkEl(work);
    workEl.classList.add("done");
    workListElDone.appendChild(workEl);
  }
}

// function run onetimes when programs start, to display all work from local storage
function displayAllWorksInStorage(category) {
  if (localStorage.getItem(category) != null) {
    let works = JSON.parse(localStorage.getItem(category));

    works.forEach((work) => {
      displayWork(work, category);
    });
  }
}

// main functions
function addWork(work, category) {
  storeWorkInStorage(work, category);
  displayWork(work, category);
}

function deleteWork(workEl, category) {
  work = workEl.firstElementChild.textContent;
  deleteWorkInStorage(work, category);
  workEl.classList.add("remove");
  setTimeout(() => {
    workEl.remove();
  }, 500);
}

function clearWork(category) {
  localStorage.removeItem(category);

  if (category == "doing") {
    let workElsArr = Array.from(workListEl.children);
    workElsArr.forEach((workEl) => workEl.remove());
  } else if (category == "done") {
    let workElsArr = Array.from(workListElDone.children);
    workElsArr.forEach((workEl) => workEl.remove());
  }
}

function doneWork(workEl) {
  let work = workEl.textContent;
  workEl.classList.add("doneAnimation");
  setTimeout(() => {
    workEl.parentElement.remove();
    addWork(work, "done");
  }, 500);
  deleteWorkInStorage(work, "doing");
}

function undoWork(workEl) {
  let work = workEl.textContent;
  workEl.parentElement.remove();
  addWork(work, "doing");
  deleteWorkInStorage(work, "done");
}

document.addEventListener("click", (e) => {
  let classList = e.target.classList;
  let workEl;
  if (classList.contains("delete_item")) {
    workEl = e.target.parentElement;
    deleteWork(workEl, "doing");
    deleteWork(workEl, "done");
  } else if (classList.contains("work") && !classList.contains("done")) {
    workEl = e.target.firstElementChild;
    doneWork(workEl);
  } else if (classList.contains("work") && classList.contains("done")) {
    workEl = e.target.firstElementChild;
    undoWork(workEl);
  }
});

displayAllWorksInStorage("doing");

function main() {
  let userInput = workInputEl.value;
  workInputEl.value = "";

  switch (userInput) {
    case "@cleardone":
      clearWork("done");
      break;
    case "@cleardoing":
      clearWork("doing");
      break;
    case "@clear":
      clearWork("doing");
      clearWork("done");
      break;
    case "@done":
      reset();
      displayAllWorksInStorage("done");
      mode = "done";
      break;
    case "@doing":
      reset();
      displayAllWorksInStorage("doing");
      mode = "doing";
      break;
    case "@all":
      reset();
      displayAllWorksInStorage("doing");
      displayAllWorksInStorage("done");
      mode = "all";
      break;
    default:
      addWork(userInput, "doing");
      mode = "all";
  }

  display(mode);
}

document.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    main();
  }
});
