const inventoryForm = document.querySelector("#inventory-form");
const inventoryNameInput = document.querySelector("#inventory-form-name-input");
const submitButton = document.querySelector("#inventory-form-submit");
const undeleteButton = document.querySelector("#undelete-btn");
const inventoryList = document.querySelector("#inventory-list");
const testButton = document.querySelector("#test-btn");

let selectedId = "";
let lastDeletedId = "";

// Reset form
const resetForm = () => {
  selectedId = "";
  inventoryForm.reset();
  inventoryNameInput.placeholder = "Add item to inventory";
  submitButton.value = "Add";
  const selectedItems = document.querySelectorAll(".selected");
  const selectedEditBtns = document.querySelectorAll(".edit-item-btn");
  const selectedDeleteBtns = document.querySelectorAll(".delete-item-btn");
  selectedItems.forEach((el) => {
    el.classList.remove("selected");
  });
  selectedDeleteBtns.forEach((el) => {
    el.innerHTML = "Delete";
  });
  selectedEditBtns.forEach((el) => {
    el.innerHTML = "Edit";
  });
  inventoryNameInput.focus();
};

// Toggle between ADD, DELETE or EDIT mode
const toggleSubmitMode = async (_id, mode) => {
  const selectedItem = document.querySelector(`#item-${_id}`);
  const selectedName = document.querySelector(
    `#item-${_id} > .inventory-item-name`
  );
  const selectedEditBtn = document.querySelector(
    `#item-${_id} > .edit-item-btn`
  );
  const selectedDeleteBtn = document.querySelector(
    `#item-${_id} > .delete-item-btn`
  );
  // Toggle to EDIT mode
  if (selectedEditBtn.innerHTML === "Edit" && mode === "edit") {
    resetForm();
    selectedId = _id;
    inventoryNameInput.value = selectedName.innerHTML;
    submitButton.value = "Save";
    selectedItem.classList.add("selected");
    selectedEditBtn.innerHTML = "Cancel";
    inventoryNameInput.focus();
    // Toggle to DELETE mode
  } else if (selectedDeleteBtn.innerHTML === "Delete" && mode === "delete") {
    resetForm();
    selectedId = _id;
    inventoryNameInput.placeholder = "Add deletion comment";
    submitButton.value = "Confirm";
    selectedItem.classList.add("selected");
    selectedDeleteBtn.innerHTML = "Cancel";
    // Toggle to ADD mode
  } else if (
    selectedDeleteBtn.innerHTML === "Cancel" ||
    selectedEditBtn.innerHTML === "Cancel"
  ) {
    resetForm();
  }
};

// Create HTML item
const createHtmlItem = (item) => {
  // New li element
  const listItem = document.createElement("li");
  listItem.id = `item-${item._id}`;
  listItem.className = "inventory-item";

  // Item name
  const itemName = document.createElement("p");
  itemName.className = "inventory-item-name";
  itemName.innerHTML = item.name;

  // Delete item button
  const dltBtn = document.createElement("button");
  dltBtn.className = "delete-item-btn";
  dltBtn.innerHTML = "Delete";
  dltBtn.addEventListener("click", () => toggleSubmitMode(item._id, "delete"));

  // Edit item button
  const editBtn = document.createElement("button");
  editBtn.className = "edit-item-btn";
  editBtn.innerHTML = "Edit";
  editBtn.addEventListener("click", () => toggleSubmitMode(item._id, "edit"));

  // Append
  listItem.appendChild(itemName);
  listItem.appendChild(dltBtn);
  listItem.appendChild(editBtn);
  inventoryList.appendChild(listItem);
};

// Get all items
const refreshInventory = async () => {
  while (inventoryList.hasChildNodes()) {
    inventoryList.removeChild(inventoryList.firstChild);
  }
  const res = await axios("/api/items");
  const inventoryItems = res.data.data;
  inventoryItems.forEach((item) => {
    createHtmlItem(item);
  });
};

// Get all items on load
window.addEventListener("load", () => {
  refreshInventory();
});

// Send add item request & refresh
const addItem = async (formObject) => {
  resetForm();
  try {
    const res = await axios.post("/api/item", formObject);
    refreshInventory();
  } catch (err) {
    window.alert(err.response.data.data);
  }
};

// Send delete item request & refresh
const deleteItem = async (_id, formObject) => {
  resetForm();
  lastDeletedId = _id;
  const data = { comment: formObject.name };
  const res = await axios.delete(`/api/item/${_id}`, { data });
  undeleteButton.hidden = false;
  refreshInventory();
};

// Send edit item request & refresh
const editItem = async (_id, formObject) => {
  resetForm();
  try {
    const res = await axios.put(`/api/item/${_id}`, formObject);
    refreshInventory();
  } catch (err) {
    window.alert(err.response.data.data);
  }
};

// Send undelete item request & refresh
const undeleteItem = async (_id) => {
  resetForm();
  const res = await axios.patch(`/api/item/${_id}`);
  lastDeletedId = "";
  refreshInventory();
  undeleteButton.hidden = true;
};

// UNDELETE last deleted item
undeleteButton.addEventListener("click", () => {
  if (!lastDeletedId) return;
  undeleteItem(lastDeletedId);
});

// ADD, DELETE or EDIT item
inventoryForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const formData = new FormData(inventoryForm);
  let formObject = {};
  for (let entry of formData.entries()) {
    formObject[entry[0]] = entry[1];
  }
  if (submitButton.value === "Add") {
    // ADD item
    addItem(formObject);
  } else if (submitButton.value === "Confirm") {
    // DELETE item
    deleteItem(selectedId, formObject);
  } else if (submitButton.value === "Save") {
    // EDIT item
    editItem(selectedId, formObject);
  }
});

testButton.addEventListener("click", async () => {
  if (!selectedId) return;
  try {
    const res = await axios(`/api/item/${selectedId}`);
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
});
