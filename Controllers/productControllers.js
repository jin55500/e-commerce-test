const productModel = require('../models/product')
const cartModel = require('../models/cart')
const { body, validationResult } = require('express-validator');

const fs = require('fs')

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

        let data = await productModel.getList('products',{'deleted_at':null},calSkip(page, size),size)

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


async function create(req,res){
    try {
        const validateData= [
            body('name').isString().notEmpty().isLength({ max: 255 }),
            body('code').isString().notEmpty().isLength({ max: 50 }),
            body('price').isDecimal().notEmpty(),
            body('description').optional().isString(),
            // body('stock').isInt().notEmpty(),
        ];
        await Promise.all(validateData.map(validation => validation.run(req)));
        const validators = validationResult(req);
        if (!validators.isEmpty()) {
            return res.status(500).json({ 'successful': false, "message": validators.array() }).end()
        }

        const checkCode = await productModel.getOne('products',{'code':req.body.code})
        if(checkCode){
            return res.status(500).json({ 'successful': false, "message": 'product code already exist' }).end()
        }

        let uploadimage = {};
        if (req.files != null) {
            if (req.files.image) {
                uploadimage.image_extension = req.files.image.mimetype.split('/')[1]
                uploadimage.image_original_name = req.files.image.name
                uploadimage.image = new Date().getTime() +'_product.'+req.files.image.mimetype.split('/')[1]
                uploadimage.image_path = "/uploads/product/" + uploadimage.image;
                if (!fs.existsSync(__dirname + "/../uploads/product/")){
                    fs.mkdirSync(__dirname + "/../uploads/product/");
                }
                req.files.image.mv(__dirname+'/..'+ uploadimage.image_path, function (err) { });
            }
        }

        const product = await productModel.create('products',{
            name:req.body.name,
            code:req.body.code,
            price:req.body.price,
            description:req.body.description,
            // stock:req.body.stock,
            image_path: uploadimage.image_path || null,
            image_original_name : uploadimage.image_original_name || null,
            image : uploadimage.image || null,
            image_extension : uploadimage.image_extension || null,
        });

        res.status(200).json({
            "success" : true,
            "message" : "Add new product success!"
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
        let product = await productModel.getOne('products',{'id':req.params.id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }
        res.status(200).json({
            "success" : true,
            "message" : "get product success!",
            "data" : product
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}


async function update(req,res){
    try {
        let product = await productModel.getOne('products',{'id':req.params.id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }
        const validateData= [
            body('name').isString().notEmpty().isLength({ max: 255 }),
            body('code').isString().notEmpty().isLength({ max: 50 }),
            body('price').isDecimal().notEmpty(),
            body('description').optional().isString(),
            // body('stock').isInt().notEmpty(),
        ];
        await Promise.all(validateData.map(validation => validation.run(req)));
        const validators = validationResult(req);
        if (!validators.isEmpty()) {
            return res.status(500).json({ 'successful': false, "message": validators.array() }).end()
        }

        const checkCode = await productModel.getOne('products',{'code':req.body.code},`id != ${req.params.id}`)
        if(checkCode){
            return res.status(500).json({ 'successful': false, "message": 'product code already exist' }).end()
        }

        let uploadimage = {};
        if (req.files != null) {
            if (req.files.image) {
                uploadimage.image_extension = req.files.image.mimetype.split('/')[1]
                uploadimage.image_original_name = req.files.image.name
                uploadimage.image = new Date().getTime() +'_product.'+req.files.image.mimetype.split('/')[1]
                uploadimage.image_path = "/uploads/product/" + uploadimage.image;
                if (!fs.existsSync(__dirname + "/../uploads/product/")){
                    fs.mkdirSync(__dirname + "/../uploads/product/");
                }
                req.files.image.mv(__dirname+'/..'+ uploadimage.image_path, function (err) { });
            }
        }

        product = await productModel.update('products',{
            name:req.body.name,
            code:req.body.code,
            price:req.body.price,
            description:req.body.description,
            // stock:req.body.stock,
            image_path: uploadimage.image_path || product.image_path,
            image_original_name : uploadimage.image_original_name || product.image_original_name,
            image : uploadimage.image || product.image,
            image_extension : uploadimage.image_extension || product.image_extension,
        },{'id':req.params.id});

        res.status(200).json({
            "success" : true,
            "message" : "update product success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}


async function del(req,res){
    try {
        let product = await productModel.getOne('products',{'id':req.params.id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }
        product = await productModel.update('products',{deleted_at:new Date()},{'id':req.params.id});
        await cartModel.del('carts',{'product_id':product.id})

        res.status(200).json({
            "success" : true,
            "message" : "delete product success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function decrementStock(req,res){
    try {
        let product = await productModel.getOne('products',{'id':req.params.id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }

        const validateData= [
            body('stock').isInt().notEmpty(),
        ];
        await Promise.all(validateData.map(validation => validation.run(req)));
        const validators = validationResult(req);
        if (!validators.isEmpty()) {
            return res.status(500).json({ 'successful': false, "message": validators.array() }).end()
        }


        product = await productModel.decrementStock('products',{'id':req.params.id},req.body.stock);

        res.status(200).json({
            "success" : true,
            "message" : "decrement stock product success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function incrementStock(req,res){
    try {
        let product = await productModel.getOne('products',{'id':req.params.id,'deleted_at':null})
        if(!product){
            return res.status(500).json({ 'successful': false, "message": 'product not found' }).end()
        }
        const validateData= [
            body('stock').isInt().notEmpty(),
        ];
        await Promise.all(validateData.map(validation => validation.run(req)));
        const validators = validationResult(req);
        if (!validators.isEmpty()) {
            return res.status(500).json({ 'successful': false, "message": validators.array() }).end()
        }

        product = await productModel.incrementStock('products',{'id':req.params.id},req.body.stock);

        res.status(200).json({
            "success" : true,
            "message" : "increment stock product success!"
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
    create,
    detail,
    update,
    del,
    decrementStock,
    incrementStock,
};
  