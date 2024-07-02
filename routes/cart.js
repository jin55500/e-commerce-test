const express = require('express')
const cartController = require('../Controllers/cartControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express()

router.get('/',authMiddleware.auth,cartController.getList)
router.get('/add-item',authMiddleware.auth,cartController.addItemToCart)
router.get('/:id',authMiddleware.auth,cartController.minusItem)
router.get('/submit/cart',authMiddleware.auth,cartController.submitCart)
module.exports = router