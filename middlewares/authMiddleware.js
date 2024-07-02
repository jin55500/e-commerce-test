const jwt = require('jsonwebtoken');
const {checkTokenBlacklist} = require('../Controllers/authControllers'); 

async function auth(req,res,next){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token || checkTokenBlacklist(token)) {
            return res.status(401).json({ error: 'Un authorization!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
    auth
};