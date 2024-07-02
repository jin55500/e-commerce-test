/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
        table.increments('id').primary();
        table.integer('user_id')
        table.decimal('total', 10, 2).defaultTo('0.00');
        table.timestamps(true, true); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
