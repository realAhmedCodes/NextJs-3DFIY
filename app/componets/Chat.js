/*"use client"
import { useState, useEffect } from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatComponent = ({ currentUser, otherUser }) => {
  const [showChat, setShowChat] = useState(false);
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const initiateChat = () => {
    if (!currentUser) return;

    const newSocket = io.connect("http://localhost:3001");
    const sortedUserIds = [currentUser, otherUser].sort().join("-");
    setRoom(sortedUserIds);

    newSocket.emit("join_room", sortedUserIds);
    setShowChat(true);

    newSocket.on("previous_messages", (messages) => {
      setMessages(messages);
    });

    newSocket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);
  };

  const sendMessage = () => {
    if (!currentUser || !socket) return;

    const messageData = {
      room,
      sender_id: currentUser,
      receiver_id: otherUser,
      message,
      time: new Date(),
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Other User:", otherUser);
    console.log("Room:", room);
  }, [currentUser, otherUser, room]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!showChat ? (
        <button
          onClick={initiateChat}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Message
        </button>
      ) : (
        <div className="flex flex-col w-full max-w-2xl p-4 bg-white rounded shadow-lg">
          <div className="p-2 text-lg font-bold text-center text-white bg-blue-500 rounded">
            Live Chat
          </div>
          <ScrollToBottom className="flex-1 p-2 my-2 overflow-y-auto bg-gray-50 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender_id === currentUser
                    ? "justify-end"
                    : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded ${
                    msg.sender_id === currentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <div className="flex justify-between mt-1 text-xs">
                    <p>{msg.createdat}</p>
                    <p>{msg.sender_id === currentUser ? "You" : "Other"}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollToBottom>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 mr-2 border rounded focus:outline-none focus:ring"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              &#9658;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
*/


import { useState, useEffect } from "react";
import io from "socket.io-client";


const ChatComponent = ({ currentUser, roomId, otherUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (roomId) {
      const newSocket = io.connect("http://localhost:3001");

      newSocket.emit("join_room", roomId);

      newSocket.on("previous_messages", (messages) => {
        setMessages(messages);
      });

      newSocket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId]); // Fetch previous messages when roomId changes

  const sendMessage = () => {
    if (!currentUser || !socket) return;

    const messageData = {
      room: roomId,
      sender_id: currentUser,
      receiver_id: otherUser, // Use otherUser for first-time chats
      message,
      time: new Date(),
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl p-4 bg-white rounded shadow-lg">
      <div className="p-2 text-lg font-bold text-center text-white bg-blue-500 rounded">
        Live Chat
      </div>
      <div className="flex-1 p-2 my-2 overflow-y-auto bg-gray-50 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender_id === currentUser ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded ${
                msg.sender_id === currentUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="flex justify-between mt-1 text-xs">
                <p>{new Date(msg.createdat).toLocaleTimeString()}</p>
                <p>{msg.sender_id === currentUser ? "You" : "Other"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 mr-2 border rounded focus:outline-none focus:ring"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;










/*
import { useState, useEffect } from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatComponent = ({
  currentUser,
  roomId,
  otherUser,
  onNewChatInitiate,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isNewChat, setIsNewChat] = useState(true);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");

    newSocket.emit("join_room", roomId);

    newSocket.on("previous_messages", (messages) => {
      if (messages.length > 0) {
        setMessages(messages);
        setIsNewChat(false);
      }
    });

    newSocket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
      setIsNewChat(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!currentUser || !socket) return;

    const messageData = {
      room: roomId,
      sender_id: currentUser,
      receiver_id: otherUser,
      message,
      time: new Date(),
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
    setIsNewChat(false);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl p-4 bg-white rounded shadow-lg">
      <div className="p-2 text-lg font-bold text-center text-white bg-blue-500 rounded">
        Live Chat
      </div>
      <ScrollToBottom className="flex-1 p-2 my-2 overflow-y-auto bg-gray-50 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender_id === currentUser ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded ${
                msg.sender_id === currentUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="flex justify-between mt-1 text-xs">
                <p>{new Date(msg.createdat).toLocaleTimeString()}</p>
                <p>{msg.sender_id === currentUser ? "You" : "Other"}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollToBottom>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 mr-2 border rounded focus:outline-none focus:ring"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          &#9658;
        </button>
      </div>
      {isNewChat && (
        <button
          onClick={() => onNewChatInitiate(otherUser)}
          className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Start Chat
        </button>
      )}
    </div>
  );
};

export default ChatComponent;
*/