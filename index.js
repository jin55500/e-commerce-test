const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const app = express()
const host = 'localhost'
const port = 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true  }))

app.use(fileupload())
app.use('/uploads', express.static('uploads'));

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const product = require('./routes/product')
app.use('/api/product',product)

const cart = require('./routes/cart')
app.use('/api/cart',cart)

const order = require('./routes/order')
app.use('/api/order',order)

const server = http.createServer(app)
server.listen(port, () => console.log(`Server is running on port ${port}!`))