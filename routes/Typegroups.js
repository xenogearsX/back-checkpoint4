const express = require('express')
const connection = require('../config')
const router = express.Router()

router.get('/', (req, res) => {
  connection.query('SELECT * from typegroup', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error retrieving typegroup')
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
        res.status(500).send('Error retrieving typegroup')
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
        res.status(500).send('Error saving typegroup')
      }
      res.status(200).send('Successfully saved typegroup')
    }
  )
})

router.put('/:id', (req, res) => {
  const idTypeGroup = parseInt(req.params.id)
  const newTypeGroup = req.body

  connection.query(
    'UPDATE typegroup SET ? WHERE idtypegroup = ?',
    [newTypeGroup, idTypeGroup],
    err2 => {
      if (err2) {
        res.status(500).json({
          error: err2.message,
          sql: err2.sql
        })
      }

      connection.query(
        'SELECT * FROM typegroup  WHERE idtypegroup = ?',
        idTypeGroup,
        (err3, records) => {
          if (err3) {
            res.status(500).json({
              error: err3.message,
              sql: err3.sql
            })
          }

          const updatedTypeGroup = records[0]
          const { ...typegroup } = updatedTypeGroup
          const host = req.get('host')
          const location = `http://${host}${req.url}/${typegroup.id}`
          res.status(201).set('Location', location).json(typegroup)
        }
      )
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
        res.status(500).send('Error deleting data')
      } else {
        res.status(200).send('Typegroup successfully deleted !')
      }
    }
  )
})

module.exports = router
