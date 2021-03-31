const express = require('express')
const { authenticateTokenAPI } = require('../config/token')
const router = express.Router()
const postNofiticationValidator = require('../validator/postNoffication')
const {validationResult}= require('express-validator')
const socketIO = require("../config/socketIO")
const Notification = require('../models/notification')
const Permission = require('../models/permission')
// GET
const io = socketIO.io;


router.get('/', authenticateTokenAPI, async (req, res) => {

    let {maphong} = req.query
    let condition = {}
    if (maphong) {
        condition = {department: maphong}
    }
    let { page, start, end, unread } = req.query
    if(unread) console.log("unread "+unread)
    if (!page) page = 1
    await Notification.find(condition).sort( { createAt : -1} ).exec( (err, data) => {
        
        if (err){ 
            res.status(403).json({err: err})
        } 
        else { 
            let dataFilter = data
            if(start && end ){
                dataFilter = dataFilter.filter(e => e.createAt >= start && e.createAt <= end)
            }
            dataFilter = dataFilter.slice((page - 1) * 10, page * 10)
            res.status(200).json({ data: dataFilter })
            console.log("log nay o notificationAPI")
            console.log(data)
            console.log(dataFilter)
        } 
    })
    
})
router.post('/',authenticateTokenAPI, postNofiticationValidator ,async (req,res)=>{
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {title, content, department} = req.body
        let author = req.user.name
        const permissionToAdd = await Permission.findOne({maphong: req.user.type})
        if(!permissionToAdd || !permissionToAdd.department.includes(department)){
            return res.status(404).json({message:"Không đủ thẩm quyền"})
        }
        const newNofication = new Notification ({
            title: title,
            createAt: new Date().getTime(),
            content: content,
            department: department,
            author:author
        })

        newNofication.save(function(err,data){ 
            if (err){ 
                return res.json({message:err})
            } 
            else { 
                io.emit('add-notification',{title : title, id:data._id, department:department, createAt: newNofication.createAt, departmentName:author})
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
        return res.json({message:message})
    }

})


module.exports = router