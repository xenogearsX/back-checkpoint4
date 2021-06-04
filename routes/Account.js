const express = require('express')
const connection = require('../config')
const router = express.Router()

router.post('/', (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    streetnumber,
    streetname,
    zipcode,
    city,
    country
  } = req.body
  connection.query(
    'INSERT INTO account (email, password, firstname, lastname, streetnumber, streetname, zipcode, city, country) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      email,
      password,
      firstname,
      lastname,
      streetnumber,
      streetname,
      zipcode,
      city,
      country
    ],
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
