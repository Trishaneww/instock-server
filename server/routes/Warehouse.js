const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const cors = require("cors");
const validation = require("../utils/validation");

router.use(express.json());
router.use(cors());


router.get("/", async (_req, res) => {
    try {
      const data = await knex("warehouses");
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json(`Error retrieving Warehouses: ${err}`);
    }
});



router.post("/", async (req, res) => {
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
      res.json("Invalid Field");
    } else {
      try {
        const data = await knex.insert(req.body).into("warehouses");
        const newWarehouseId = data[0];
        const createdWarehouse = await knex("warehouses").where({
          id: newWarehouseId,
        });
  
      } catch (err) {
        res
          .status(500)
          .json({ message: `Unable to create new warehouse: ${err}` });
      }
    }
  });


 module.exports = router;