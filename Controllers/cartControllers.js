const productModel = require('../models/product')
const cartModel = require('../models/cart')
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

        let data = await cartModel.getList('carts',
            [
                'carts.*',
                'products.name as product_name',
                'products.code as product_code',
                'products.price',
            ],
            [
                { table: 'products', condition: { 'products.id': 'carts.product_id' } }
            ],
            {
                'carts.user_id' : req.user.id
            },
            calSkip(page, size),
            size
        )

        res.status(200).json({
            "success" : true,
            "message" : "register success!",
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

async function addItemToCart(req,res){
    try {
        let product = await productModel.getOne('products',{'id':req.query.product_id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }

        //เช็คว่ามีสินค้าในตะกร้ารึยัง
        let checkItem = await cartModel.getOne('carts',{'user_id':req.user.id,'product_id':req.query.product_id})
        
        if(!checkItem){
            let checkCount = await cartModel.getList('carts',{'user_id':req.user.id})
            if(checkCount.length > 20){
                res.status(500).json({
                    "success" : false,
                    "message" : 'limit item'
                });
            }
            await cartModel.create('carts',{
                'user_id' : req.user.id,
                'product_id' : req.query.product_id,
                'qty' : 1,
            })
        }

        await cartModel.incrementQty('carts',{'id':checkItem.id},1)
    
        res.status(200).json({
            "success" : true,
            "message" : "add item to cart success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function minusItem(req,res){
    try {
        let cart = await cartModel.getOne('carts',{'id':req.params.id})
        if(!cart){
            return res.status(500).json({ 'successful': false, "message": 'item not found' }).end()
        }

        if(cart.qty > 1){
            await cartModel.decrementQty('carts',{'id':cart.id},1)
        }else{
            await cartModel.del('carts',{'id':cart.id})
        }
    
        res.status(200).json({
            "success" : true,
            "message" : "delete item from cart success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function submitCart(req,res){
    try {
        console.log('test');
        let cart = await cartModel.getList('carts','*',[],{'user_id':req.user.id})
        if(cart.length == 0){
            return res.status(500).json({ 'successful': false, "message": 'no item in cart' }).end()
        }

        let order = await orderModel.create(cart,req.user.id)

        res.status(200).json({
            "success" : true,
            "message" : "create order success!"
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
    addItemToCart,
    minusItem,
    submitCart
};
  