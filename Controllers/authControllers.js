const bcrypt = require('bcrypt');
const userModel = require('../models/user')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');



async function register(req,res){
    try {
        const validateData= [
            body('name').isString().notEmpty().isLength({ max: 255 }),
            body('email').isEmail().notEmpty().isLength({ max: 255 }),
            body('password').isLength({ min: 6 }),
        ];
        await Promise.all(validateData.map(validation => validation.run(req)));
        const validators = validationResult(req);
        if (!validators.isEmpty()) {
            return res.status(500).json({ 'successful': false, "message": validators.array() }).end()
        }

        let data = req.body;
        const checkEmailExist = await userModel.getOne('users',{'email':data.email})
        if(checkEmailExist){
            return res.status(500).json({ 'successful': false, "message": 'Email already exist' }).end()
        }

        data.password = await bcrypt.hash(data.password, 10);
        await userModel.create('users',{
            email: data.email,
            name: data.name,
            password: data.password
        });
        res.status(200).json({
            "success" : true,
            "message" : "register success!"
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function login(req,res){
    try {
        let data = req.body
        const user = await userModel.getOne('users',{'email':data.email})
        if(!user || !(await bcrypt.compare(data.password, user.password))){
            return res.status(500).json({ 'successful': false,"message": 'Invalid email or password' }).end()
        }
        const token = jwt.sign({ id: user.id, name: user.name,type:user.type}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            "success" : true,
            "message" : "login success!",
            "token" : token
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

async function getProfile(req,res){
    try {
        const user = await userModel.getOne('users',{'id':req.user.id})
        if(!user){
            return res.status(500).json({ 'successful': false,"message": 'Un authorization! user not found' }).end()
        }
        delete user.password
        res.status(200).json({
            "success" : true,
            "message" : "get profile success!",
            "data" : user
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

let blacklist = [];
async function logout(req,res){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        blacklist.push(token);
        res.clearCookie('jwtToken');
        res.status(200).json({
            "success" : true,
            "message" : "logout success!",
        });
    } catch (error) {
        res.status(500).json({
            "success" : false,
            "message" : error.message
        });
    }
}

function checkTokenBlacklist(token) {
    return blacklist.includes(token);
}

module.exports = {
    register,
    login,
    getProfile,
    logout,
    checkTokenBlacklist
};
  