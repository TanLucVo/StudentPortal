const express = require('express')
const { authenticateTokenAPIAdmin } = require('../config/token')
const router = express.Router()
const postNofiticationValidator = require('../validator/postNoffication')
const {validationResult}= require('express-validator')
const socketIO = require("../config/socketIO")
const Notification = require('../models/notification')
// GET
const io = socketIO.io;


router.get('/',authenticateTokenAPIAdmin ,async (req,res)=>{
    
    await Notification.find({}, (err, data) => {
        
        if (err){ 
            res.status(403).json({err: err})
        } 
        else { 
            res.status(200).json({ data: data })
        } 
    })
    
})
router.post('/',authenticateTokenAPIAdmin, postNofiticationValidator ,(req,res)=>{
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {title, content, department,author} = req.body
        
        const newNofication = new Notification ({
            title: title,
            createAt: new Date().getTime(),
            content: content,
            department: department,
            author:author
        })

        newNofication.save(function(err,data){ 
            if (err){ 
                return res.status(403).json({message:err})
            } 
            else { 
                io.emit('add-notification',{title : title, id:data._id, department:department})
                return res.status(200).json({message:"Thêm thành công", data: data})
            } 
        }) 

    }else{
        let messages =result.mapped()
        let message = ""
        for(m in messages){
            message = messages[m]
            break
        }
        return res.status(403).json({message:message})
    }

})


module.exports = router