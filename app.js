const express = require("express") 
const server = express() 
const http = require("http").Server(server) 
const io = require("socket.io")(http) 
const port = process.env.PORT || 3000

server.use(express.static("public")) 

http.listen(port, () => {
    console.log("Listening on PORT:"+port) 
    console.log("http://localhost:"+port)
}) 

server.get("/public", function(req, res){
    res.sendFile(__dirname + "/index.html") 
}) 

io.on("connection", function (socket) {
    io.sockets.emit("user-joined", {clients : Object.keys(io.sockets.clients().sockets), count : io.engine.clientsCount, joinedUserId : socket.id}) 

    socket.on("signaling", function(data){
        io.to(data.toId).emit("signaling", { fromId: socket.id, ...data }) 
    }) 

    socket.on("disconnect", function(){
        io.sockets.emit("user-left", socket.id)
    })
}) 