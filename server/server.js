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

// get request for a single warehouse's details
app.get('/warehouses/:id', async (req, res) => {
  try {
    const selectedWarehouse = await knex('warehouses').select('*').where({id: req.params.id});
    res.status(200).send(selectedWarehouse);
  } catch(err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`)
  }
});

// Delete a warehouse/:id
app.delete("/warehouses/:id", async (req, res) => {
  try {
    const warehousesDelete = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (warehousesDelete === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete warehouse: ${error}`,
    });
  }
});

// Delete an inventory item
app.delete("/inventories/:id", async (req, res) => {
  try {
    const inventoryDelete = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (inventoryDelete === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory: ${error}`,
    });
  }
});
 
app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});