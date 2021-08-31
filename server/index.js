import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io"; // Class from socket.io

const app = express();
app.use(cors());

const server = http.createServer(app);

// Connect socket.io server to our server
// Let socket.io know the react server will be making the calls
// Let socket.io what type of requests react server will make
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    }
});

// Listening for a "connection" event and will run the callback function
// socket - used to specifiy the user and allows us to listen to events
io.on("connection", (socket) => {

    // Listen for "join_room" event from frontend
    socket.on("join_room", (roomID) => {
        // Join based on ID given from frontend
        socket.join(roomID);
        console.log(`User with ID ${socket.id} joined room ${roomID}`)
    });

    // Listens for "send_message" event that contains
    // data - message, author, time, and room
    socket.on("send_message", (messageData) => {
        // Once we receive the message data from the frontend, 
        // We're gonna send the message data back to frontend
        // to display the messages to everyone who's listening for new messages
        socket.to(messageData.room).emit("receive_message", messageData);
    });

    // disconnect from server
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 3001;

// Starting server
server.listen(PORT, () => {
    console.log("Server is running");
});