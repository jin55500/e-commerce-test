/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_lists', function(table) {
        table.increments('id').primary();
        table.integer('order_id')
        table.integer('product_id')
        table.string('product_name');
        table.string('product_code');
        table.integer('qty');
        table.decimal('price', 10, 2).defaultTo('0.00');
        table.decimal('price_total', 10, 2).defaultTo('0.00');
        table.timestamps(true, true); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
