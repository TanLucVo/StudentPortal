const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log("Server : clientID",socket.id);
});
// end of socket.io logic

module.exports = socketIO;