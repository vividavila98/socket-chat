import './App.css';
import io from "socket.io-client"; 
import { useState } from 'react';
import Chat from './components/Chat';

// Establish a connection with our node server
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [displayChat, setDisplayChat] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      // Send a "join_room" event for the backend to receive
      // with the room ID
      socket.emit("join_room", room);
      setDisplayChat(true);
    }
  }

  return (
    <div className="App">
      {
        !displayChat ? 
     ( 
      <div className="joinChatContainer">
        <h1>Join Chat</h1>
        <input type="text" placeholder="Name" value={username} onChange={e => setUsername(e.target.value)}/>
        <input type="text" placeholder="Room ID" value={room} onChange={e => setRoom(e.target.value)}/>
        <button onClick={joinRoom}>Join</button>
      </div>
        )
      : (
        <Chat socket={socket} username={username} room={room}/>
      )
    }
    </div>
  );
}

export default App;
