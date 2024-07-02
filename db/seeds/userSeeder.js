/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt')
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {name: 'admin', type: 'admin', email: 'admin@example.com',password: bcrypt.hashSync('123456', 10)},
  ]);
};
