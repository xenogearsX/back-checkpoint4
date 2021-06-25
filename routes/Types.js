const express = require('express')
const connection = require('../config')
const router = express.Router()

router.get('/', (req, res) => {
  connection.query('SELECT * from type', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Erreur de réception des types produit')
    } else {
      res.status(200).json(results)
    }
  })
})

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM type WHERE idtype = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur de réception du type produit')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.post('/', (req, res) => {
  const { typename, typegroup_idtypegroup } = req.body
  connection.query(
    'INSERT INTO type (typename, typegroup_idtypegroup) VALUES (?, ?)',
    [typename, typegroup_idtypegroup],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Sauvegarde réussie du type')
      }
    }
  )
})

router.put('/:id', (req, res) => {
  const idType = parseInt(req.params.id)
  const newType = req.body

  connection.query(
    'UPDATE type SET ? WHERE idtype = ?',
    [newType, idType],
    err => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        connection.query(
          'SELECT * FROM type  WHERE idtype = ?',
          idType,
          (error, records) => {
            if (error) {
              res.status(500).send(error.message)
            } else {
              const updatedType = records[0]
              const { ...type } = updatedType
              const host = req.get('host')
              const location = `http://${host}${req.url}/${type.id}`
              res.status(201).set('Location', location).json(type)
            }
          }
        )
      }
    }
  )
})

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM type WHERE idtype = ?',
    [req.params.id],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Type supprimé !')
      }
    }
  )
})

module.exports = router
