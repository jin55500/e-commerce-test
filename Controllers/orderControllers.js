const orderModel = require('../models/order')

const calSkip = (page, size) => {
    return (page - 1) * size;
}

const calPage = (count, size) => {
    return Math.ceil(count / size);
}

async function getList(req,res){
    try {
    
        const page = req.query.page ? req.query.page : 1
        const size = req.query.size ? req.query.size : 10

        let data = await orderModel.getList('orders',
            [
                'orders.*',
                'users.name as user_name',
            ],
            [
                { table: 'users', condition: { 'users.id': 'orders.user_id' } }
            ],
            {
                'orders.user_id' : req.user.id
            },
            calSkip(page, size),
            size
        )


        res.status(200).json({
            "success" : true,
            "message" : "get order success!",
            "data" : data.data,
            "currentPage": page,
            "pages": calPage(data.count, size),
            'count_data' : data.count
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function detail(req,res){
    try {

        let order = await orderModel.getOne('orders',{'id':req.params.id})
        if(!order){
            return res.status(500).json({ 'successful': false, "message": 'order not found' }).end()
        }
        order.order_list = await orderModel.getList('order_lists',['*'],[],{'order_id':req.params.id})

        res.status(200).json({
            "success" : true,
            "message" : "get order detail success!",
            "data" : order,

        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

module.exports = {
    getList,
    detail
};