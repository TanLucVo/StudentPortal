const express = require('express')
const passport = require('passport')
const router = express.Router()
const {createStatus, getAllStatus, getStatusId} = require('../controllers/statusController')
const {authenticateToken} = require('../config/token')
// api status: GET POST PUT DELETE

// GET

router.get('/', getAllStatus, authenticateToken)

router.get('/:statusId',getStatusId ,authenticateToken, function(req, res) {
    console.log(req.params.statusId)
})

// POST

router.post('/',createStatus, authenticateToken)

// PUT

router.put('/:statusId',authenticateToken, function(req, res) {

})

// DELETE

router.delete('/:statusId',authenticateToken, function(req, res) {
    
})

module.exports = router