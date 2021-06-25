require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const connection = require('../config')
const router = express.Router()

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM shop.order WHERE account_idaccount = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error retrieving product')
      } else {
        const orderTemp = results.map(order => {
          return {
            idorder: order.idorder,
            date: order.date.toLocaleDateString(),
            orderitems: JSON.parse(order.orderitems),
            total: order.total,
            account_idaccount: order.account_idaccount
          }
        })
        res.status(200).json(orderTemp)
      }
    }
  )
})

router.post('/', (req, res) => {
  const { date, orderitems, total, account_idaccount } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_LOGIN,
      pass: process.env.MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.MAIL_LOGIN,
    to: [process.env.MAIL_LOGIN, 'xenogears@hotmail.fr'],
    subject: 'Votre commande sur Bibelot.com',
    text: `Vous avez commandé le ${date}:
          ${orderitems
            .map(item => item.name + ' x ' + item.quantity)
            .join(', ')} pour un total de ${total}€.`,
    html: `<div style="display:block;font-size:1rem;margin:auto;width:100%;">
            <h1 style="width:50%;">Votre commande du ${date}</h1>
            <table style="width:80%;">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
             ${orderitems
               .map(
                 item =>
                   `<tr key=${item.id}>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                  </tr>`
               )
               .join('')}
             <tr>
               <td colSpan='2'>Total</td>
               <td>${total}</td>
             </tr>
           </tbody>
         </table>
       </div>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })

  connection.query(
    'INSERT INTO shop.order (date, orderitems, total, account_idaccount) VALUES(?, ?, ?, ?)',
    [
      date.split('/').reverse().join('-'),
      JSON.stringify(orderitems),
      total,
      account_idaccount
    ],
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
