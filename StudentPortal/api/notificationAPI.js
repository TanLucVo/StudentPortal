const express = require('express')
const { authenticateTokenAPIAdmin } = require('../config/token')
const router = express.Router()

// GET


router.get('/',authenticateTokenAPIAdmin ,(req,res)=>{
    res.send('asdasdsad')
})
router.post('/',authenticateTokenAPIAdmin ,(req,res)=>{
    let {title, content, department} = req.body
    res.send('asdasdsad')
})


module.exports = router