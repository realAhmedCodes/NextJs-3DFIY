
"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import useSWR from "swr";
import ChatList from "./ChatList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";


const fetcher = (url) => fetch(url).then((res) => res.json());

const ChatComponent = ({ currentUser, roomId, otherUser, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [activeOtherUser, setActiveOtherUser] = useState(otherUser || null);

  // Use SWR to fetch the chat list
  const { mutate } = useSWR(
    currentUser ? `/api/socketIo/${currentUser}/chatList` : null,
    fetcher
  );

  // Set up socket connection and handle room changes
  useEffect(() => {
    if (activeRoomId) {
      const newSocket = io.connect("http://localhost:3001");

      // Join the selected room and fetch previous messages
      newSocket.emit("join_room", activeRoomId);
      setMessages([]); // Clear previous messages

      newSocket.on("previous_messages", (previousMessages) => {
        setMessages(previousMessages);
      });

      newSocket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect(); // Clean up on component unmount
      };
    }
  }, [activeRoomId]);

  // Listen for real-time chat list updates
  useEffect(() => {
    if (socket) {
      socket.on("update_chat_list", () => {
        mutate(); // Refresh the chat list when a new message is sent
      });
    }
  }, [socket, mutate]);

  const sendMessage = () => {
    if (!currentUser || !socket || message.trim() === "") return;

    const messageData = {
      room: activeRoomId,
      sender_id: currentUser,
      receiver_id: activeOtherUser,
      message,
      time: new Date(),
      createdat: new Date(),
    };

    // Emit the message to the server
    socket.emit("send_message", messageData);

    // Update local state to show the message immediately
    setMessages((prev) => [...prev, messageData]);

    // Clear the input field
    setMessage("");
  };

  const handleSelectChat = (roomId, otherUserId) => {
    setActiveRoomId(roomId);
    setActiveOtherUser(otherUserId);
    setMessages([]);
  };

  return (
    <div className="fixed top-24 right-4 w-[600px] z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-800 hover:text-gray-900"
        aria-label="Close chat"
      >
        <X className="w-6 h-6 " />
      </button>

      <div className="flex w-full">
        <ChatList currentUser={currentUser} onSelectChat={handleSelectChat} />
        <Card className="w-full flex-grow ml-4">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px] p-4">
            <ScrollArea className="flex-1 mb-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender_id === currentUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.sender_id === currentUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex justify-between mt-1 text-xs opacity-70">
                          <p>
                            {new Date(msg.createdat).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p>
                            {msg.sender_id === currentUser ? "You" : "Other"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="flex items-center">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message here..."
                className="mr-2 flex-grow"
              />
              <Button onClick={sendMessage} variant="default">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatComponent;
