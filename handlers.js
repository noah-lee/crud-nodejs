const { v4: uuidv4 } = require("uuid");

let { inventory } = require("./inventory");

// Get all items in inventory
const getItems = (req, res) => {
  console.log("GET ALL ITEMS");
  try {
    // Filter out items tagged as deleted
    const filteredInventory = inventory.filter((item) => !item.deleted);
    console.log(filteredInventory);
    res
      .status(200)
      .json({ status: 200, message: "success", data: filteredInventory });
  } catch (err) {
    // Placeholder sever error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Get item from inventory
const getItem = (req, res) => {
  console.log("GET ITEM");
  const { _id } = req.params;
  try {
    // Find item with _id
    const item = inventory.find((item) => item._id === _id);
    if (item) {
      console.log(item);
      res.status(200).json({ status: 200, message: "success", data: item });
    } else {
      console.log(`Item with id ${_id} not found.`);
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Add item to inventory
const addItem = (req, res) => {
  console.log("ADD ITEM");
  const { name } = req.body;
  try {
    // Check if item with same name exists in inventory
    const exists = inventory.some(
      (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (exists) {
      // If item exists...
      console.log(`Item ${name} already exists in inventory.`);
      res.status(400).json({
        satus: 400,
        message: "fail",
        data: `Item ${name} already exists in inventory.`,
      });
    } else {
      // If item does not exist...
      const newItem = {
        _id: uuidv4(),
        ...req.body,
        deleted: false,
      };
      inventory.push(newItem);
      console.log(newItem);
      res
        .status(201)
        .json({ status: "201", message: "success", data: newItem });
    }
  } catch (err) {
    // Placeholder server error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Update item in inventory
const updateItem = (req, res) => {
  console.log("UPDATE ITEM");
  const { _id } = req.params;
  const { name } = req.body;
  try {
    // Check if item with same name exists in inventory
    const exists = inventory.some(
      (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (exists) {
      // If item exists...
      console.log(`Item ${name} already exists in inventory.`);
      res.status(400).json({
        satus: 400,
        message: "fail",
        data: `Item ${name} already exists in inventory.`,
      });
    } else {
      // If item does not exist...
      let updatedItem = {};
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          updatedItem = { ...item, ...req.body };
          return updatedItem;
        } else {
          return item;
        }
      });
      console.log(updatedItem);
      res
        .status(201)
        .json({ status: "201", message: "success", data: updatedItem });
    }
  } catch (err) {
    // Placeholder server error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Delete item from inventory
const deleteItem = (req, res) => {
  console.log("DELETE ITEM");
  const { _id } = req.params;
  const { comment } = req.body;
  try {
    // Check if item with same _id exists in inventory
    const exists = inventory.some((item) => item._id === _id);
    if (exists) {
      // If item exists...
      let deletedItem = {};
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          deletedItem = { ...item, deleted: true, comment: comment };
          return deletedItem;
        } else {
          return item;
        }
      });
      console.log(deletedItem);
      res
        .status(200)
        .json({ status: "200", message: "success", data: deletedItem });
    } else {
      // If item does not exist...
      console.log(`Item with id ${_id} not found.`);
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Undelete item from inventory
const undeleteItem = (req, res) => {
  console.log("UNDELETE ITEM");
  const { _id } = req.params;
  try {
    // Check if item with same _id exists in inventory
    const exists = inventory.some((item) => item._id === _id);
    if (exists) {
      // If item exists...
      let undeletedItem = {};
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          delete item.comment;
          undeletedItem = { ...item, deleted: false };
          return undeletedItem;
        } else {
          return item;
        }
      });
      console.log(undeletedItem);
      res
        .status(201)
        .json({ status: "201", message: "success", data: undeletedItem });
    } else {
      // If item does not exist...
      console.log(`Item with id ${_id} not found.`);
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
    console.log("Server error.");
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
  undeleteItem,
};
