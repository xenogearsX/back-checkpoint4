require('dotenv').config()
const express = require('express')
const connection = require('../config')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

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
        res.status(500).send('Problème lors de la création de compte')
      }
      res.status(200).send('Création de compte réussie')
    }
  )
})

router.post('/protected', (req, res) => {
  const token = getToken(req)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(200).send('echec')
    }
    console.log('decode', decoded)
    return res
      .status(202)
      .send({ idAccount: decoded.idAccount, isAdmin: decoded.isAdmin })
  })
})
module.exports = router

router.post('/signin', (req, res) => {
  connection.query(
    'SELECT * from account WHERE email= ? ',
    [req.body.email],
    (err, result) => {
      if (err) {
        res.status(400).send('Impossible car :' + err)
      } else if (
        result[0] &&
        bcrypt.compareSync(req.body.password, result[0].password)
      ) {
        const tokenUserinfo = {
          idAccount: result[0].idaccount,
          isAdmin: result[0].isadmin
        }
        const token = jwt.sign(tokenUserinfo, process.env.JWT_SECRET)
        res.header('Access-Control-Expose-Headers', 'x-access-token')
        res.set('x-access-token', token)
        res.status(200).send({
          idAccount: result[0].idaccount,
          isAdmin: result[0].isadmin
        })
      } else {
        res.status(201).send('failed')
      }
    }
  )
})

module.exports = router
