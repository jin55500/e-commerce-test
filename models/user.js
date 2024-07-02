const knex = require('../db/knex.js')

async function create(table,data){
    return knex.insert(data).into(table)
}

async function update(table,data,whereCondtion,whereRaw = null){

    let query = knex(table).update(data).where(whereCondtion)

    if (whereRaw != null) {
        query = query.whereRaw(whereRaw);
    }

    return query;
}

async function getOne(table,whereCondtion={}) {
    let query = knex.from(table).where(whereCondtion).first();
    return query;
}

module.exports = {
    create,
    update,
    getOne
}