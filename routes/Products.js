const express = require('express')
const connection = require('../config')
const router = express.Router()

router.get('/', (req, res) => {
  connection.query('SELECT * from product', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error retrieving data')
    } else {
      res.status(200).json(results)
    }
  })
})

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM product WHERE idproduct = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error retrieving product')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.get('/filter/jewels', (req, res) => {
  connection.query(
    `SELECT * from product P JOIN type T ON T.idtype = P.type_idtype
    JOIN typegroup TP ON TP.idtypegroup = T.typegroup_idtypegroup
    WHERE TP.groupname = 'Bijoux'`,
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error retrieving data')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.get('/filter/clothes', (req, res) => {
  connection.query(
    `SELECT * from product P JOIN type T ON T.idtype = P.type_idtype
    JOIN typegroup TP ON TP.idtypegroup = T.typegroup_idtypegroup
    WHERE TP.groupname = 'Prêt-à-porter'`,
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error retrieving data')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.get('/filter/bags', (req, res) => {
  connection.query(
    `SELECT * from product P JOIN type T ON T.idtype = P.type_idtype
    JOIN typegroup TP ON TP.idtypegroup = T.typegroup_idtypegroup
    WHERE TP.groupname = 'Maroquinerie'`,
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error retrieving data')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.post('/', (req, res) => {
  const {
    name,
    shortdescription,
    longdescription,
    price,
    stock,
    smallurl,
    bigurl,
    type_idtype
  } = req.body
  connection.query(
    'INSERT INTO product (name, shortdescription, longdescription, price, stock, smallurl, bigurl, type_idtype) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      shortdescription,
      longdescription,
      price,
      stock,
      smallurl,
      bigurl,
      type_idtype
    ],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send('Error saving product')
      }
      res.status(200).send('Successfully saved product')
    }
  )
})

router.put('/:id', (req, res) => {
  const idProduct = parseInt(req.params.id)
  const newProduct = req.body

  connection.query(
    'UPDATE product SET ? WHERE idproduct = ?',
    [newProduct, idProduct],
    err2 => {
      if (err2) {
        res.status(500).json({
          error: err2.message,
          sql: err2.sql
        })
      }

      connection.query(
        'SELECT * FROM product  WHERE idproduct = ?',
        idProduct,
        (err3, records) => {
          if (err3) {
            res.status(500).json({
              error: err3.message,
              sql: err3.sql
            })
          }

          const updatedProduct = records[0]
          const { ...product } = updatedProduct
          const host = req.get('host')
          const location = `http://${host}${req.url}/${product.id}`
          res.status(201).set('Location', location).json(product)
        }
      )
    }
  )
})

module.exports = router
