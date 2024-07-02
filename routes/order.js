const express = require('express')
const orderController = require('../Controllers/orderControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express()

router.get('/',authMiddleware.auth,orderController.getList)
router.get('/:id',authMiddleware.auth,orderController.detail)
module.exports = router