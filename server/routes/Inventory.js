const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const cors = require("cors");

router.use(express.json());
router.use(cors());

router.get("/", async (req, res) => {
    try {
      const data = await knex("inventories");
  
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json(`Error retreieving Inventories: ${err}`);
    }
})

router.post("/", async (req, res) => {
    if (
      !req.body.category ||
      !req.body.description ||
      !req.body.item_name ||
      !req.body.quantity ||
      !req.body.status ||
      !req.body.warehouse_id
    ) {
      res.send("Invalid Field");
    } else {
      try {
        const data = await knex.insert(req.body).into("inventories");
        const newInventoryId = data[0];
        const createdInventory = await knex("inventories").where({
          id: newInventoryId,
        });
  
      } catch (err) {
        res
          .status(500)
          .json({ message: `Unable to create new Inventory: ${err}` });
      }
    }
  });
  


module.exports = router;