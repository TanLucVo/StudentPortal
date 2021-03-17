const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( client ) {
    console.log("Client "+client.id+" da ket noi")
    let users=Array.from(io.sockets.sockets.values()).map(socket => ({id:socket.id}))
    console.log(users)

    client.on('disconnect', ()=> console.log("Client "+client.id+" da thoat"))
    client.emit('list-users',users)
});
// end of socket.io logic

module.exports = socketIO;