const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const path = require("path");

const http = require("http");
const socketIO = require("socket.io");
const { log } = require("console");
const server = http.createServer(app);
const io = socketIO(server);



let waitingusers = [];
let rooms = {
    "dnsndnjsdnjndsjnjdnjs": ["nsdjdjjsdjndn","svdxjshbdbdnxsm"]
}

io.on("connection", function(socket){
    socket.on("joinroom",function(){
       if(waitingusers.length > 0){
        let partner = waitingusers.shift();
        const roomname = `${socket.id}--${partner.id}`;
        socket.join(roomname);
        partner.join(roomname);
        
        io.to(roomname).emit("joined", roomname)
       }else{
        waitingusers.push(socket);
       }
        
    });

    socket.on("signalingMesaage", function (data){
      socket.broadcast.to(data.room).emit("signalingMessage",data.message)
    });

    socket.on("message",function(data){
        socket.broadcast.to(data.room).emit("message",data.message)
    })

    socket.on("message",function(data){
        socket.broadcast.to(data.room).emit("message",data.message)
    })

    socket.on("rejectCall",function({room}){
        socket.broadcast.to(room).emit("Call rejected");
    })


    socket.on("acceptCall",function({room}){
        socket.broadcast.to(room).emit("callAccepted");
    })
    socket.on("disconnect",function(){
       let index =  waitingusers.findIndex(waitingusers => waitingusers.id === socket.id);
       waitingusers.splice(index,1);
    })

})


// Setting up the view engine to use EJS
app.set("view engine", "ejs");
app.use(express.json()); // Corrected: add parentheses to invoke express.json()
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Use the indexRouter for the root route
app.use("/", indexRouter);

// Start the server
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
