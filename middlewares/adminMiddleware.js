const jwt = require('jsonwebtoken');

async function admin(req,res,next){
    console.log(req.user)
    if (req.user && req.user.type == "admin") { 
        return next(); 
    } else {
        return res.status(403).json({ message: 'premission denied' }); 
    }
}

module.exports = {
    admin
};