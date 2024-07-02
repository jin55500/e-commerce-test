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

async function getOne(table,whereCondtion={},whereRaw = null) {
    let query = knex.from(table).where(whereCondtion).first();
    if (whereRaw != null) {
        query = query.whereRaw(whereRaw);
    }
    return query;
}

async function getList(table, whereCondition = {},page,size) {
    let query = knex.from(table);
    query = query.where(whereCondition);
    
    
    if(page != null && size != null){
       let count = await knex.from(table).where(whereCondition)
        query = query.offset(page).limit(size)
        return {
            'count' : count.length,
            'data' : await query
        }
    }

    return query;
}

async function incrementStock(table,whereCondition,stock){
    return knex.table(table).where(whereCondition).increment('stock',stock)
}

async function decrementStock(table,whereCondition,stock){
    return knex.table(table).where(whereCondition).decrement('stock',stock)
}


module.exports = {
    create,
    update,
    getOne,
    getList,
    incrementStock,
    decrementStock
}