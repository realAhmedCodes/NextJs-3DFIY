"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import useSWR from "swr";
import ChatList from "./ChatList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";

// Utility function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Component to display the date divider
const DateDivider = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex justify-center my-6">
      <Badge variant="secondary" className="text-gray-600 font-normal">
        {formattedDate}
      </Badge>
    </div>
  );
};

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
        // Sort messages by createdat in ascending order
        const sortedMessages = previousMessages.sort(
          (a, b) => new Date(a.createdat) - new Date(b.createdat)
        );
        setMessages(sortedMessages);
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
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
      setActiveOtherUser(null);
      setMessages([]);
    } else {
      setActiveRoomId(roomId);
      setActiveOtherUser(otherUserId);
      setMessages([]);
    }
  };

  return (
    // Only render the ChatComponent if a chat is active or if you want it always visible
    <div className="">
      

      <div className="flex w-full">
        <ChatList currentUser={currentUser} onSelectChat={handleSelectChat} />
        <Card className="w-full flex-grow rounded-l-none">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px] p-4">
            {activeRoomId ? (
              <>
                <ScrollArea className="flex-1 mb-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No messages yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((msg, index) => {
                        // Determine if a date divider should be shown before this message
                        const showDateDivider =
                          index === 0 ||
                          !isSameDay(
                            msg.createdat,
                            messages[index - 1].createdat
                          );

                        return (
                          <div key={index}>
                            {showDateDivider && (
                              <DateDivider date={msg.createdat} />
                            )}
                            <div
                              className={`flex ${
                                msg.sender_id === currentUser
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  msg.sender_id === currentUser
                                    ? "bg-primary text-white"
                                    : "bg-secondary text-gray-800"
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <div className="flex justify-between mt-1 text-xs opacity-70">
                                  <p>
                                    {new Date(msg.createdat).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
              </>
            ) : (
              // Optionally, you can show a placeholder or keep it empty when no chat is active
              <div className="w-full flex items-center justify-center">
                <p className="text-gray-500">
                  Select a chat to start messaging
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatComponent;
