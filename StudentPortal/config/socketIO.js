const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (client) {
    console.log("Client "+client.id+" da ket noi")
    let users=Array.from([])
    
    client.on('disconnect', () => console.log("Client " + client.id + " da thoat"))
    client.on('register-id', data => {
        let { socketId, userId } = data;
        client.id = socketId
        client.broadcast.emit('register-id', { socketId: socketId.id, userId: userId })
        users.push({ socketId: socketId, userId: userId })
        console.log(users)
    })
    client.emit('list-users', users)
});
// end of socket.io logic

module.exports = socketIO;