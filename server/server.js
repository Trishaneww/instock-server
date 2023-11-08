const express = require('express');
const knex = require('knex')(require('./knexfile'));
const app = express();
const cors = require('cors')
require("dotenv").config();


app.use(cors());


app.get('/', (req,res) => {
    res.send("DEFAULT")
})

// get request for all warehouses
app.get('/warehouses', async (req, res) => {
    try {
      const data = await knex('warehouses');
      res.status(200).send(data);
    } catch(err) {
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    }
  });

// get request for all inventory
app.get('/inventories', async (req, res) => {
    try {
        const data = await knex('inventories');
        res.status(200).send(data);
    } catch(err) {
        res.status(400).send(`Eroor retreieving Inventories: ${err}`)
    }
} )


app.listen(5050, () => {
  console.log(`running at http://localhost:5050`);
});