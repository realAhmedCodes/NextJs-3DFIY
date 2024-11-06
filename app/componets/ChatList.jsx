/*import { useEffect, useState } from "react";
import axios from "axios";

const ChatList = ({ currentUser }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          `/api/socketIo/${currentUser}/chatList`
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [currentUser]);
console.log(chatRooms)
  return (
    <div className="w-1/4 bg-gray-200">
      <h2 className="p-4 text-lg font-bold text-center">Chats</h2>
      <ul>
        {chatRooms.map((room, index) => (
          <li
            key={index}
            onClick={() => selectChat(room.room_id)}
            className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-300"
          >
            <div className="flex items-center">
              
              <div>
                <p className="font-bold">{room.other_user_name}</p>
                <p className="text-sm text-gray-600 truncate">
                  {room.last_message}
                </p>
              </div>
            </div>
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;




*/

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import useSWR from "swr";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ChatList = ({ currentUser, onSelectChat }) => {
  const [socket, setSocket] = useState(null);

  // Fetch chat list using SWR
  const {
    data: chatRooms,
    mutate,
    error,
  } = useSWR(
    currentUser ? `/api/socketIo/${currentUser}/chatList` : null,
    fetcher
  );

  // Set up socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Listen for chat list updates
    newSocket.on("update_chat_list", () => {
      mutate(); // Re-fetch the chat list when the event is received
    });

    return () => {
      newSocket.disconnect();
    };
  }, [mutate]);

  const selectChat = (roomId, otherUserId) => {
    onSelectChat(roomId, otherUserId);
  };

  if (error) return <div className="text-red-500">Error loading chat list</div>;

  if (!chatRooms)
    return (
      <div className="flex items-center justify-center w-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="text-center">Chats</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <ul>
            {chatRooms.map((room, index) => (
              <li
                key={index}
                onClick={() => selectChat(room.room_id, room.other_user_id)}
                className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
              >
                <Avatar className="mr-3">
                  <AvatarFallback>
                    {room.other_user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{room.other_user_name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {room.last_message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatList;
