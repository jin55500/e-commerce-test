/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('carts', function(table) {
        table.increments('id').primary();
        table.integer('user_id')
        table.integer('product_id')
        table.integer('qty');
        table.timestamps(true, true); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('carts');
};
