const { v4: uuidv4 } = require("uuid");

let { inventory } = require("./inventory");

// Get all items in inventory
const getItems = (req, res) => {
  console.log("GET ALL ITEMS");
  try {
    // Filter out items tagged as deleted
    const filteredInventory = inventory.filter((item) => !item.deleted);
    res
      .status(200)
      .json({ status: 200, message: "success", data: filteredInventory });
  } catch (err) {
    // Placeholder sever error catcher
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Get item from inventory
const getItem = (req, res) => {
  const { _id } = req.params;
  try {
    const item = inventory.find((item) => item._id === _id);
    if (item) {
      res.status(200).json({ status: 200, message: "success", data: item });
    } else {
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
    res.status(500).json({
      status: 500,
      message: "fail",
      data: "Server error message",
    });
  }
};

// Add item to inventory
const addItem = (req, res) => {
  console.log("ADD NEW ITEM");
  const { name } = req.body;
  try {
    const exists = inventory.some(
      (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (exists) {
      res.status(400).json({
        satus: 400,
        message: "fail",
        data: `Item ${name} already exists in inventory.`,
      });
    } else {
      const newItem = {
        _id: uuidv4(),
        ...req.body,
        deleted: false,
      };
      inventory.push(newItem);
      res
        .status(201)
        .json({ status: "201", message: "success", data: newItem });
    }
  } catch (err) {
    // Placeholder server error catcher
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
    // Check if item with _id exists in inventory
    const exists = inventory.some((item) => item._id === _id);
    if (exists) {
      // If item exists...
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          return { ...item, deleted: true, comment: comment };
        } else {
          return item;
        }
      });
      res.status(200).json({ status: "200", message: "success" });
    } else {
      // If item does not exist
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
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
    // Check if item with _id exists in inventory
    const exists = inventory.some((item) => item._id === _id);
    if (exists) {
      // If item exists...
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          delete item.comment;
          return { ...item, deleted: false };
        } else {
          return item;
        }
      });
      res.status(201).json({ status: "201", message: "success" });
    } else {
      // If item does not exist
      res.status(404).json({
        status: 404,
        message: "fail",
        data: `Item with id ${_id} not found.`,
      });
    }
  } catch (err) {
    // Placeholder server error catcher
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
    const exists = inventory.some(
      (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (exists) {
      res.status(400).json({
        satus: 400,
        message: "fail",
        data: `Item ${name} already exists in inventory.`,
      });
    } else {
      inventory = inventory.map((item) => {
        if (item._id === _id) {
          return { _id, ...req.body };
        } else {
          return item;
        }
      });
      res.status(201).json({ status: "201", message: "success" });
    }
  } catch (err) {
    // Placeholder server error catcher
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
