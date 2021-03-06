import { userInfo } from "os"
import { io } from "socket.io-client"

const joinRoomButton = document.getElementById("room-button")
const messageInput = document.getElementById("message-input")
const roomInput = document.getElementById("room-input")
const form = document.getElementById("form")

const socket = io("http://localhost:3000")
const userSocket = io("http://localhost:3000/user", { auth: { token: "Test" }})

userSocket.on("connect_error", error => {
  displayMessage(error)
})

socket.on("connect", () => {
  displayMessage(`You connected with id: ${socket.id}`)
})

socket.on("receive-message", message => {
  displayMessage(message)
})

socket.emit("custom-event", 10, "Hi", { a: "a" })

form.addEventListener("submit", event => {
  event.preventDefault()
  const message = messageInput.value
  const room = roomInput.value
  
  if (message === "") {
    return
  }

  displayMessage(message)
  socket.emit("send-message", message, room)

  messageInput.value = ""
})

joinRoomButton.addEventListener("click", event => {
  const room = roomInput.value

  socket.emit("join-room", room, message => {
    displayMessage(message)
  })
})

function displayMessage(message) {
  const div = document.createElement("div")
  div.textContent = message
  document.getElementById("message-container").append(div)
}