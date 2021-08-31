import React, { useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // When user clicks button, it's going to send 
    // data - room, author, message, time to backend
    const sendMessage = async () => {
        if(currentMessage) {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", messageData);
            setMessageList(prevMessageList => [...prevMessageList, messageData]);
            setCurrentMessage("");
        }
    }

    // Listens for event "receive_message"
    // This will run everytime there's a change in our socket server
    useEffect(() => {
        socket.on("receive_message", (messageData) => {
            setMessageList(prevMessageList => [...prevMessageList, messageData]);
        })
    }, [socket])

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {
                    messageList.map(messageData => {
                        return (
                            <div key={messageList.indexOf(messageData)} className="message" id={username === messageData.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>{messageData.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageData.time}</p>
                                        <p id="author">{messageData.author}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input 
                    type="text" 
                    placeholder="Write message ..." 
                    value={currentMessage} 
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={e => {e.key === "Enter" && sendMessage()}}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}
