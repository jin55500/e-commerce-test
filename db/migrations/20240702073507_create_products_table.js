/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('code');
        table.decimal('price', 10, 2).defaultTo('0.00');
        table.text('description').nullable();
        table.integer('stock').defaultTo('0');
        table.string('image_path', 500).nullable();
        table.string('image_original_name', 500).nullable();
        table.string('image', 500).nullable();
        table.string('image_extension', 50).nullable();
        table.timestamps(true, true); 
        table.timestamp('deleted_at').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
