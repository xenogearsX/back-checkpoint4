const express = require('express')
const connection = require('../config')
const router = express.Router()

router.get('/', (req, res) => {
  connection.query(
    'SELECT * from product P JOIN type T ON T.idtype = P.type_idtype',
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur de réception des produits')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM product WHERE idproduct = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur de réception du produit')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.get('/filter/:type', (req, res) => {
  connection.query(
    `SELECT * from product P JOIN type T ON T.idtype = P.type_idtype
    JOIN typegroup TP ON TP.idtypegroup = T.typegroup_idtypegroup
    WHERE TP.groupname = ?`,
    [req.params.type],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur de réception des produits')
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
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Produit sauvegardé')
      }
    }
  )
})

router.put('/:id', (req, res) => {
  const idProduct = parseInt(req.params.id)
  const newProduct = req.body

  connection.query(
    'UPDATE product SET ? WHERE idproduct = ?',
    [newProduct, idProduct],
    err => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        connection.query(
          'SELECT * FROM product  WHERE idproduct = ?',
          idProduct,
          (error, records) => {
            if (error) {
              res.status(500).send(error.message)
            } else {
              const updatedProduct = records[0]
              const { ...product } = updatedProduct
              const host = req.get('host')
              const location = `http://${host}${req.url}/${product.id}`
              res.status(201).set('Location', location).json(product)
            }
          }
        )
      }
    }
  )
})

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM product WHERE idproduct = ?',
    [req.params.id],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Produit supprimé !')
      }
    }
  )
})

module.exports = router
