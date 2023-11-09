const express = require("express");
const knex = require("knex")(require("./knexfile"));
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("DEFAULT");
});

// get request for all warehouses
app.get("/warehouses", async (req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
});

// get request for all inventory
app.get("/inventories", async (req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(`Error retreieving Inventories: ${err}`);
  }
});

app.post("/warehouses", async (req, res) => {
  try {
    console.log(req.body);
    const data = await knex.insert(req.body).into("warehouses");
    const newWarehouseId = data[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
    });

    // res.status(201).json(createdWarehouse);
    console.log(createdWarehouse);
  } catch (err) {
    res.status(500).send({ message: `Unable to create new warehouse: ${err}` });
    console.log({ message: `Unable to create new warehouse: ${err}` });
  }
});

app.post("/inventories", async (req, res) => {
  try {
    console.log(req.body);
    const data = await knex.insert(req.body).into("inventories");
    const newInventoryId = data[0];
    const createdInventory = await knex("inventories").where({
      id: newInventoryId,
    });

    // res.status(201).json(createdWarehouse);
    console.log(createdInventory);
  } catch (err) {
    res.status(500).send({ message: `Unable to create new Inventory: ${err}` });
    console.log({ message: `Unable to create new Inventory: ${err}` });
  }
});

app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});
