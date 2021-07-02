require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const connection = require('../config')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const router = express.Router()

const getToken = req => {
  if (
    req.body.authorization &&
    req.body.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.body.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM account WHERE idaccount = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur de réception du compte')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

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
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Création de compte réussie')
      }
    }
  )
})

router.post('/forgot', (req, res) => {
  connection.query(
    'SELECT * FROM account WHERE email = ? ',
    [req.body.email],
    (err, result) => {
      if (err) {
        res.status(500).send('Impossible car :' + err)
      } else if (result[0]) {
        const userInfo = {
          idAccount: result[0].idaccount
        }
        const params = jwt.sign(userInfo, process.env.JWT_SECRET, {
          expiresIn: 3600
        })

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_LOGIN,
            pass: process.env.MAIL_PASSWORD
          }
        })

        const mailOptions = {
          from: process.env.MAIL_LOGIN,
          to: 'xenogears@hotmail.fr',
          subject: 'Réinitialisation de votre mot de passe bibelot.com',
          text: `Réinitialisation de votre mot de passe demandé le ${new Date().toLocaleDateString()}
                Veuillez suivre ce lien http://localhost:3000/forgot/${params}`,
          html: `<div style="display:block;font-size:1rem;margin:auto;width:100%;">
                  <h1 style="width:100%;">Réinitialisation de votre mot de passe demandé le ${new Date().toLocaleDateString()}</h1>
                  <a href="http://localhost:3000/forgot/${params}">Lien de réinitilisation valable une heure</a>
                  <p>Si vous n'êtes pas à l'origine de cette réinitialisation, contactez-nous <a href="mailto:${
                    process.env.MAIL_LOGIN
                  }">Admin Bibelot.com</a></p>
                </div>`
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })

        res
          .status(200)
          .send(`Email de réinitialisation envoyé à ${req.body.email}`)
      } else {
        console.log('Email not recognized')
        res
          .status(200)
          .send(`Email de réinitialisation envoyé à ${req.body.email}`)
      }
    }
  )
})

router.post('/protected', (req, res) => {
  const token = getToken(req)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      res.status(200).send(err.message)
    } else {
      console.log('decode', decoded)
      res
        .status(202)
        .send({ idAccount: decoded.idAccount, isAdmin: decoded.isAdmin })
    }
  })
})

router.post('/signin', (req, res) => {
  connection.query(
    'SELECT * from account WHERE email= ? ',
    [req.body.email],
    (err, result) => {
      if (err) {
        res.status(500).send('Impossible car :' + err)
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

router.put('/:id', (req, res) => {
  const {
    email,
    firstname,
    lastname,
    streetnumber,
    streetname,
    zipcode,
    city,
    country
  } = req.body
  connection.query(
    `UPDATE shop.account SET email = ?, firstname = ?, lastname = ?, streetnumber = ?, streetname = ?, zipcode = ?, city = ?, country = ? WHERE (idaccount = ?)`,
    [
      email,
      firstname,
      lastname,
      streetnumber,
      streetname,
      zipcode,
      city,
      country,
      req.params.id
    ],
    err => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Modification de compte réussie.')
      }
    }
  )
})

module.exports = router
