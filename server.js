const express = require("express"); //Set up the express module
const path = require("path"); //Include the Path module

const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Endpoints
const {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
  undeleteItem,
} = require("./handlers");

// Get all items in inventory
app.get("/api/items", getItems);

// Get item from inventory
app.get("/api/item/:_id", getItem);

// Add item to inventory
app.post("/api/item", addItem);

// Update item in inventory
app.put("/api/item/:_id", updateItem);

// Delete item from inventory
app.delete("/api/item/:_id", deleteItem);

// Undelete item from inventory
app.patch("/api/item/:_id", undeleteItem);

// Serve index.html to client
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

//Listen on PORT 3000
app.listen(3000, function () {
  console.log("App server is running on port 3000");
});
