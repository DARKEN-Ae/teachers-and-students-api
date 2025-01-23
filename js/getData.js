import request from "./instance.js";
import { LIMIT } from "./const.js";

const allCard = document.querySelector(".all-card"),
  categoryInput = document.querySelector(".category-input"),
  pagination = document.querySelector(".pagination"),
  categoryForm = document.querySelector(".category-form"),
  cadegoryModalClose = document.querySelector(".cadegory-modal-close"),
  categoryOpenBtn = document.querySelector(".category-open-btn"),
  addSaveBtn = document.querySelector(".add-save-btn"),
  checkBox = document.getElementById("defaultCheck1");

let search = "";
let activePage = 1;
let selected = null;

function getCard({
  firstName,
  lastName,
  images,
  group,
  isMarried,
  phoneNumber,
  email,
  id,
}) {
  let marrid = isMarried ? "Yes✅" : "No❌";
  return `
   <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
      <div class="card" id="animatedCard">
        <img src="${images}" class="card-img-top" alt="..." />
       <a href="https://t.me/itklaster">
        <img
          class="klaster-logo"
          src="./assets/it_klaster_logo.jpg"
          alt="..."
        /></a>
        <div class="card-body">
          <p class="card-title">Name: ${firstName}</p>
          <p class="card-title">Last Name: ${lastName}</p>
          <p class="card-title">Group: ${group}</p>
          <p class="card-title">Is Married: ${marrid}</p>
          <p class="card-title">Phone Number: ${phoneNumber}</p>
          <p class="card-title">Email: ${email}</p>
          <div class="d-flex" style="gap:3px">
            <button class="btn btn-success edit-btn" 
                data-bs-toggle="modal"
                data-bs-target="#exampleModal" 
                id="${id}">Edit</button>
            <button class="btn btn-danger delete-btn" id="${id}">Delete</button>
            <a style="font-size: 10px;" href="./students.html?teacher/${id}/student=${id}" class="btn btn-primary">View to Student</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function getData() {
  try {
    allCard.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; margin-top: 14vh;">
      <img
      style="border-radius: 18%"
        className="img-fluid"
        src="../assets/tenor.gif"
        alt="Loading..."
      />
    </div>`;
    let params = {
      firstName: search,
    };
    let { data } = await request.get("/teacher", { params });

    let paramsWidth = {
      firstName: search,
      page: activePage,
      limit: 10,
    };
    let { data: dataWidth } = await request.get("/teacher", {
      params: paramsWidth,
    });

    let pages = Math.ceil(data.length / LIMIT);

    pagination.innerHTML = ` <li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }">
      <button class="page-link" page="-" >«</button>
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
      <button class="page-link" page="+" >»</button>
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
    images: this.images.value,
    lastName: this.lastName.value,
    isMarried: checkBox.checked,
  };
  if (selected == null) {
    await request.post("/teacher", categoryData);
  } else {
    await request.put(`/teacher/${selected}`, categoryData);
  }
  getData();

  bootstrap.Modal.getInstance(cadegoryModalClose).hide();
});

categoryOpenBtn.addEventListener("click", function (e) {
  selected = null;
  categoryForm.firstName.value = "";
  categoryForm.images.value = "";
  categoryForm.lastName.value = "";
  categoryForm.isMarried.checked = false;
  addSaveBtn.textContent = "Add Save";
});

window.addEventListener("click", async function (e) {
  let checkModal = e.target.classList.contains("edit-btn");
  let id = e.target.getAttribute("id");
  if (checkModal) {
    selected = id;

    let { data } = await request.get(`/teacher/${id}`);
    categoryForm.firstName.value = data.firstName;
    categoryForm.images.value = data.images;
    categoryForm.lastName.value = data.lastName;
    categoryForm.isMarried.checked = data.isMarried;
    addSaveBtn.textContent = "Edit Save";
  }
  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let isDelete = confirm("Delete Category?");
    if (isDelete) {
      await request.delete(`/teacher/${id}`);
      getData();
    }
  }
});

checkBox.addEventListener("change", function (e) {
  if (checkBox.checked) {
    getData(e);
  } else {
    getData(e);
  }
});
