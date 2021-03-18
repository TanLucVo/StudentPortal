const mongoose = require('mongoose')
const notificationModel = require('../models/notification')

async function getAllNotification(req, res) {
    await notificationModel.find({}, (err, data) => {
        if (err){
            res.status(403).json({err: err})
        } 
        else { 
            res.status(200).json({ data: data })
        } 
    })
}

async function postNotification(req, res) {
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {title, content, department} = req.body
        
        const newNofication = new Notification ({
            title: title,
            createAt: new Date().getTime(),
            content: content,
            department: department,
        })

        newNofication.save(function(err,data){ 
            if (err){ 
                return res.status(403).json({message:err})
            } 
            else { 
                io.emit('add-notification',{title : title, id:data._id})
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
}

module.exports = {getAllNotification, postNotification}