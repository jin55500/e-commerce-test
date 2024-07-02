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

async function getList(table,select={},joins = [],whereCondition = {},page,size) {
    let query = knex.select(select).from(table);
    query = query.where(whereCondition);
    
    joins.forEach((join) => {
        const { table: joinTable, condition } = join;
        query = query.join(joinTable, condition);
    });
    
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

async function incrementQty(table,whereCondition,qty){
    return knex.table(table).where(whereCondition).increment('qty',qty)
}

async function decrementQty(table,whereCondition,qty){
    return knex.table(table).where(whereCondition).decrement('qty',qty)
}

async function del(table,whereCondition){
    return knex.table(table).where(whereCondition).delete()
}

module.exports = {
    create,
    update,
    getOne,
    getList,
    incrementQty,
    decrementQty,
    del
}