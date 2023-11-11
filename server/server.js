const express = require("express");
const knex = require("knex")(require("./knexfile"));
const app = express();
const cors = require("cors");
// import validation function
const validation = require("./utils/validation");
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
    // console.log(data);
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

// app.get("/inventories/:id", async (req, res) => {
//   try {
//     const foundInventoryItem = await knex("inventories")
//       .join("warehouses", "inventories.warehouse_id", "warehouses.id")
//       .where({ "inventories.id": req.params.id });

//     if (foundInventoryItem.length === 0) {
//       return res.status(404).json({
//         message: `Inventory Item with ID ${req.params.id} not found`,
//       });
//     }

//     const inventoryItemData = foundInventoryItem[0];
//     res.json(inventoryItemData);
//   } catch (error) {
//     res.status(500).json({
//       message: `Unable to retrieve inventory item data for inventory with ID ${req.params.id}`,
//     });
//   }
// });

app.post("/warehouses", async (req, res) => {
  if (
    !validation.isEmailValid(req.body.contact_email) ||
    !validation.isPhoneValid(req.body.contact_phone) ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.warehouse_name ||
    !req.body.contact_name ||
    !req.body.contact_position
  ) {
    res.send("Invalid Field");
  } else {
    try {
      console.log(req.body);
      const data = await knex.insert(req.body).into("warehouses");
      const newWarehouseId = data[0];
      const createdWarehouse = await knex("warehouses").where({
        id: newWarehouseId,
      });

      console.log(createdWarehouse);
    } catch (err) {
      res
        .status(500)
        .send({ message: `Unable to create new warehouse: ${err}` });
      console.log({ message: `Unable to create new warehouse: ${err}` });
    }
  }
});

// post request to create new inventory item + vallidation
app.post("/inventories", async (req, res) => {
  if (
    !req.body.category ||
    !req.body.description ||
    !req.body.item_name ||
    !req.body.quantity ||
    !req.body.status ||
    !req.body.warehouse_id
  ) {
    res.send("Invalid Field");
    console.log("Invalid Field");
  } else {
    try {
      console.log(req.body);
      const data = await knex.insert(req.body).into("inventories");
      const newInventoryId = data[0];
      const createdInventory = await knex("inventories").where({
        id: newInventoryId,
      });

      console.log(createdInventory);
    } catch (err) {
      res
        .status(500)
        .send({ message: `Unable to create new Inventory: ${err}` });
      console.log({ message: `Unable to create new Inventory: ${err}` });
    }
  }
});

// get request for a single warehouse's details
app.get("/warehouses/:id", async (req, res) => {
  try {
    const selectedWarehouse = await knex("warehouses")
      .select("*")
      .where({ id: req.params.id });
    res.status(200).send(selectedWarehouse);
  } catch (err) {
    res.status(404).send(`Error retrieving Warehouses: ${err}`);
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


// get request for a single inventory item
app.get("/inventories/:id", async (req, res) => {
  try {
      const inventoryItems = await knex("inventories").select('*').where({warehouse_id: req.params.id});
      res.status(200).send(inventoryItems);
  } catch (err) {
    res.status(400).send(`Error retreieving Inventories: ${err}`);
  }
});


app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});
