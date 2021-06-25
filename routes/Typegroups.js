const express = require('express')
const connection = require('../config')
const router = express.Router()

router.get('/', (req, res) => {
  connection.query('SELECT * from typegroup', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Erreur de reception des groupes produits')
    } else {
      res.status(200).json(results)
    }
  })
})

router.get('/:id', (req, res) => {
  connection.query(
    'SELECT * FROM typegroup WHERE idtypegroup = ? ',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Erreur lors de la réception du groupe produit')
      } else {
        res.status(200).json(results)
      }
    }
  )
})

router.post('/', (req, res) => {
  const { groupname } = req.body
  connection.query(
    'INSERT INTO typegroup (groupname) VALUES (?)',
    [groupname],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Sauvegarde réussi du groupe produit')
      }
    }
  )
})

router.put('/:id', (req, res) => {
  const idTypeGroup = parseInt(req.params.id)
  const newTypeGroup = req.body

  connection.query(
    'UPDATE typegroup SET ? WHERE idtypegroup = ?',
    [newTypeGroup, idTypeGroup],
    err => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        connection.query(
          'SELECT * FROM typegroup  WHERE idtypegroup = ?',
          idTypeGroup,
          (error, records) => {
            if (error) {
              res.status(500).send(error.message)
            } else {
              const updatedTypeGroup = records[0]
              const { ...typegroup } = updatedTypeGroup
              const host = req.get('host')
              const location = `http://${host}${req.url}/${typegroup.id}`
              res.status(201).set('Location', location).json(typegroup)
            }
          }
        )
      }
    }
  )
})

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM typegroup WHERE idtypegroup = ?',
    [req.params.id],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send(err.message)
      } else {
        res.status(200).send('Groupe produit supprimé !')
      }
    }
  )
})

module.exports = router
