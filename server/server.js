const express = require("express");
const knex = require("knex")(require("./knexfile"));
const app = express();
const cors = require("cors");
// import validation function
const validation = require("./utils/validation");
require("dotenv").config();

const inventoryRoute = require('./routes/Inventory');
const warehouseRoute = require('./routes/Warehouse');


app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("DEFAULT");
});

app.use("/warehouses", warehouseRoute);
app.use("/inventories", inventoryRoute);

// get request for a all inventories with of a warehouse id
app.get("/warehouses/:id/inventories", async (req, res) => {
  try {
    const data = await knex("inventories").where({
      warehouse_id: req.params.id,
    });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(`Error retreieving Inventories: ${err}`);
  }
});

app.get("/warehouses/:id", async (req, res) => {
  try {
    const selectedWarehouse = await knex("warehouses")
      .select("*")
      .where({ id: req.params.id });
    res.status(200).json(selectedWarehouse);
  } catch (err) {
    res.status(404).json(`Error retrieving Warehouses: ${err}`);
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

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory: ${error}`,
    });
  }
});

// put request editing of the warehouse details
app.put("/warehouses/:id", async (req, res) => {
  const updates = req.body;

  try {
    const number = await knex("warehouses")
      .where({ id: req.params.id })
      .update(updates);

    if (number) {
      const updatedwarehouse = await knex("warehouses").where({ id: number });
      res.status(200).json(updatedwarehouse);
    } else {
      console.log("error updating ");
      res
        .status(404)
        .json({ message: `Warehouse ID: ${req.params.id} doesn't exist` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating new warehouse", error: err });
  }
});

app.put("/inventories/:id", async (req, res) => {
  const { item_name, description, category, quantity, status } = req.body;
  if (!item_name || !description || !category || !quantity || !status) {
    return res.status(400).json({
      message: "Please fill out all fields",
    });
  }
  const updates = req.body;

  try {
    const number = await knex("inventories")
      .where({ id: req.params.id })
      .update(updates);

    if (number) {
      const updatedInventory = await knex("warehouses").where({ id: number });
      res.status(200).json(updatedInventory);
    } else {
      console.log("error updating ");
      res
        .status(404)
        .json({ message: `Inventory ID: ${req.params.id} doesn't exist` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating new inventory", error: err });
  }
});

// get request for a single inventory item
app.get("/inventories/:id", async (req, res) => {
  try {
    const data = await knex("inventories")
      .select(
        "inventories.id as id",
        "inventories.*",
        "warehouses.id as warehouse_id",
        "warehouses.warehouse_name"
      )
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where({ "inventories.id": req.params.id });
    res.status(200).json(data);
  } catch (err) {
    res.status(404).send(`Error retreieving Inventories: ${err}`);
  }
});

app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});
