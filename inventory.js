const { v4: uuidv4 } = require("uuid");

// Database
let inventory = [
  { _id: uuidv4(), name: "Car", deleted: false },
  { _id: uuidv4(), name: "Computer", deleted: false },
  { _id: uuidv4(), name: "Book", deleted: false },
];

module.exports = { inventory };
