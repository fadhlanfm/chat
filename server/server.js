const { instrument } = require("@socket.io/admin-ui")

const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
  },
})

const userIo = io.of("/user")
userIo.on("connection", socket => {
  console.log("connected to user namespace")
})

io.on("connection", socket => {
  console.log(socket.id)
  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message)
    } else {
      socket.to(room).emit("receive-message", message)
    }
  })

  socket.on("join-room", (room, cb) => {
    socket.join(room)
    cb(`joined ${room}`)
  })
})

instrument(io, { auth: false })