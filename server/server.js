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
    const data = await knex("inventories").join(
      "warehouses",
      "inventories.warehouse_id",
      "warehouses.id"
    );

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(`Error retreieving Inventories: ${err}`);
  }
});

app.get("/inventories/:id", async (req, res) => {
  try {
    const foundInventoryItem = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where({ "inventories.id": req.params.id });

    if (foundInventoryItem.length === 0) {
      return res.status(404).json({
        message: `Inventory Item with ID ${req.params.id} not found`,
      });
    }

    const inventoryItemData = foundInventoryItem[0];
    res.json(inventoryItemData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory item data for inventory with ID ${req.params.id}`,
    });
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

    console.log(createdInventory);
  } catch (err) {
    res.status(500).send({ message: `Unable to create new Inventory: ${err}` });
    console.log({ message: `Unable to create new Inventory: ${err}` });
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

// Patch an inventory item
app.put("/inventories/:id/edit", async (req, res) => {
  // for (const key in req.body) {
  //   if (!inputs[key]) {
  //     return res
  //       .status(400)
  //       .json({ message: `Unable to get value for ${key}` });
  //   }
  // }

  try {
    const InventoryUpdate = await knex("inventories")
      .where({ id: req.params.id })
      .update(req.body);

    if (InventoryUpdate === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    const updatedInventory = await knex("inventories").where({
      id: req.params.id,
    });

    res.json(updatedInventory[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update Inventory with ID ${req.params.id}: ${error}`,
    });
  }
});

app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});
