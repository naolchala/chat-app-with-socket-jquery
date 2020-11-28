// creating express app
const app = require('express')();
// Allowing cross origin request
const cors = require('cors');
app.use(cors());

// creating server
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// variables
let count = 0;
let messages = [];

// io
io.on("connection", (socket) => {
    count++;
    socket.on("send", (msg) => {
        messages.push(msg);
        io.emit("msg", msg);
    })

    socket.on("registerName", (name) => {
        io.emit("joinedUser", name);
        io.emit("count", count);
    })
    // when user Disconnects
    socket.on("disconnect", () => {
        count--;
        io.emit("count", count);
    })
})

app.get("/messages", (req, res) => {
    res.json(messages);
})

// Adding Listener
http.listen(3000, () => {
    console.log("Listening on 3000")
})