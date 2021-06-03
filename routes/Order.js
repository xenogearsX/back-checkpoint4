const express = require('express')
const connection = require('../config')
const router = express.Router()

router.post('/', (req, res) => {
  const { orderitems } = req.body
  connection.query(
    'INSERT INTO shop.order (orderitems) VALUES(?)',
    [orderitems],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send('Error saving order')
      }
      res.status(200).send('Successfully saved order')
    }
  )
})

module.exports = router
