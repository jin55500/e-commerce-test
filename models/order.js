const knex = require('../db/knex.js')

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

async function create(cart,userId){
    try {
        const order = knex.transaction( async trx =>{
            let order = await trx('orders').insert({
                'user_id' : userId
            })
            let orderTotal = 0;
            for(item of cart){
                
                let product = await trx('products').where({'id':item.product_id,'deleted_at':null}).where('stock','>=',item.qty).first()
                if(!product){
                    
                    throw new Error(`product out of stock`)
                }

                await trx('order_lists').insert({
                    'order_id': order[0],
                    'product_id': product.id,
                    'product_name': product.name,
                    'product_code': product.code,
                    'qty': item.qty,
                    'price': product.price,
                    'price_total' : item.qty * product.price
                })
                await trx('products').where('id',product.id).decrement('stock',item.qty)
                orderTotal +=  item.qty * product.price
            }

            await trx('orders').where('id', order[0]) .update({total: orderTotal});
            await trx('carts').where('user_id',userId).delete()
            return order[0]
        })

        return order
    } catch (error) {
        throw error; 
    }

}

async function getOne(table,whereCondtion={},whereRaw = null) {
    let query = knex.from(table).where(whereCondtion).first();
    if (whereRaw != null) {
        query = query.whereRaw(whereRaw);
    }
    return query;
}

module.exports = {
    getList,
    create,
    getOne
}