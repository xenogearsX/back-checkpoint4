require('dotenv').config()
const express = require('express')
const connection = require('../config')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
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
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)

  connection.query(
    'INSERT INTO account (email, password, firstname, lastname, streetnumber, streetname, zipcode, city, country) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      email,
      hashedPassword,
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

router.post('/signin', (req, res) => {
  connection.query(
    'SELECT * from account WHERE email= ? ',
    [req.body.email],
    (err, result) => {
      if (err) {
        res.status(400).send('Impossible car :' + err)
      } else {
        if (
          req.body.email === result[0].email &&
          bcrypt.compareSync(req.body.password, result[0].password)
        ) {
          const tokenUserinfo = {
            email: req.body.email
          }
          const token = jwt.sign(tokenUserinfo, process.env.JWT_SECRET)
          res.header('Access-Control-Expose-Headers', 'x-access-token')
          res.set('x-access-token', token)
          res.status(200).send({ details: 'user connected' })
        } else {
          res.status(201).send('Failed')
        }
      }
    }
  )
})

module.exports = router
