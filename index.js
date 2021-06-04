const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const routes = require('./routes/index')

app.use(cors('*'))
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/account', routes.account)
app.use('/order', routes.order)
app.use('/products', routes.products)
app.use('/types', routes.types)
app.use('/typegroups', routes.typegroups)

app.listen(3030, () => console.log('Express server is running'))
