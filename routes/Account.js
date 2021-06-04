const express = require('express')
const connection = require('../config')
const router = express.Router()

router.post('/', (req, res) => {
  const { orderitems } = req.body
  connection.query(
    'INSERT INTO shop.account (orderitems) VALUES(?)',
    [orderitems],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send('Error saving account')
      }
      res.status(200).send('Successfully saved account')
    }
  )
})

module.exports = router
