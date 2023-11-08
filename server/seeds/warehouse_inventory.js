/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const warehouseData = require('../seeds-data/warehouses');
const inventoryData = require('../seeds-data/inventories');

exports.seed = async function(knex) {
  await knex('warehouses').del();
  await knex('inventories').del();
  await knex('warehouses').insert(warehouseData);
  await knex('inventories').insert(inventoryData);
};