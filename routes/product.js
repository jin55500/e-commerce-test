const express = require('express')
const productController = require('../Controllers/productControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const router = express()

router.get('/',authMiddleware.auth,productController.getList)
router.post('/',authMiddleware.auth,adminMiddleware.admin,productController.create)
router.get('/:id',authMiddleware.auth,productController.detail)
router.put('/:id',authMiddleware.auth,adminMiddleware.admin,productController.update)
router.delete('/:id',authMiddleware.auth,adminMiddleware.admin,productController.del)
router.post('/decrement/stock/:id',authMiddleware.auth,adminMiddleware.admin,productController.decrementStock)
router.post('/increment/stock/:id',authMiddleware.auth,adminMiddleware.admin,productController.incrementStock)
module.exports = router