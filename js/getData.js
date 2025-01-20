import request from "./instance.js";
import { LIMIT } from "./const.js";

const allCard = document.querySelector(".all-card"),
  categoryInput = document.querySelector(".category-input"),
  pagination = document.querySelector(".pagination"),
  categoryForm = document.querySelector(".category-form"),
  cadegoryModalClose = document.querySelector(".cadegory-modal-close"),
  categoryOpenBtn = document.querySelector(".category-open-btn"),
  addSaveBtn = document.querySelector(".add-save-btn");

let search = "";
let activePage = 1;
let selected = null;

function getCard({ firstName, avatar, id, age, worktype }) {
  return `
   <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
      <div class="card">
        <img src="${avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${firstName}</h5>
          <p class="card-title">Age: ${age}</p>
          <p class="card-title">Work Type: ${worktype}</p>
          <div class="d-flex" style="gap:3px">
            <button class="btn btn-success edit-btn" 
                data-bs-toggle="modal"
                data-bs-target="#exampleModal" 
                id="${id}">Edit</button>
            <button class="btn btn-danger delete-btn" id="${id}">Delete</button>
            <a href="./students.html?teachers/:id/students=${id}" class="btn btn-primary">View to Student</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
async function getData() {
  try {
    allCard.innerHTML = `<div className="d-flex justify-content-center align-items-center vh-100">
      <img
        className="img-fluid"
        src="https://media1.tenor.com/m/qMWisxsVAcoAAAAC/cat-funny-stupid-loading-reloading-frozen.gif"
        alt="Loading..."
      />
    </div>`;
    let params = {
      firstName: search,
    };
    let { data } = await request.get("/teachers", { params });

    let paramsWidth = {
      firstName: search,
      page: activePage,
      limit: 10,
    };
    let { data: dataWidth } = await request.get("/teachers", {
      params: paramsWidth,
    });

    let pages = Math.ceil(data.length / LIMIT);

    pagination.innerHTML = ` <li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }">
      <button class="page-link" page="-" >Previous</button>
    </li>`;

    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `
      <li class="page-item ${
        activePage === i ? "active" : ""
      }"><button class="page-link" page="${i}">${i}</button></li>
      `;
    }

    pagination.innerHTML += ` <li class="page-item ${
      activePage === pages ? "disabled" : ""
    }">
      <button class="page-link" page="+" >Next</button>
    </li>
    `;

    allCard.innerHTML = "";
    dataWidth.map((category) => {
      allCard.innerHTML += getCard(category);
    });
  } catch (err) {
    console.log(err);
  }
}
getData();

categoryInput.addEventListener("keyup", function (e) {
  search = this.value;
  getData();
});

pagination.addEventListener("click", function (e) {
  let page = e.target.getAttribute("page");
  if (page !== null) {
    if (page == "+") {
      activePage++;
    } else if (page == "-") {
      activePage--;
    } else {
      activePage = +page;
    }
    getData();
  }
});

categoryForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  let categoryData = {
    firstName: this.firstName.value,
    avatar: this.images.value,
  };
  if (selected == null) {
    await request.post("/teachers", categoryData);
  } else {
    await request.put(`/teachers/${selected}`, categoryData);
  }
  getData();

  bootstrap.Modal.getInstance(cadegoryModalClose).hide();
});

categoryOpenBtn.addEventListener("click", function (e) {
  selected = null;
  categoryForm.firstName.value = "";
  categoryForm.images.value = "";
  addSaveBtn.textContent = "Add Save";
});

window.addEventListener("click", async function (e) {
  let checkModal = e.target.classList.contains("edit-btn");
  let id = e.target.getAttribute("id");
  if (checkModal) {
    selected = id;

    let { data } = await request.get(`/teachers/${id}`);
    categoryForm.firstName.value = data.firstName;
    categoryForm.images.value = data.avatar;
    addSaveBtn.textContent = "Edit Save";
  }
  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let isDelete = confirm("Delete Category?");
    if (isDelete) {
      await request.delete(`/teachers/${id}`);
      getData();
    }
  }
});
