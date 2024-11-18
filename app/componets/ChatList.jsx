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

  const handleSelectChat = (roomId, otherUserId) => {
    onSelectChat(roomId, otherUserId);
  };
  if (!chatRooms)
    return (
      <div className="bg-white p-4 w-80 flex items-center justify-center text-center shadow border z-10">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  if (error && !chatRooms)
    return (
      <div className="bg-white p-4 w-80 flex items-center justify-center text-center shadow border z-10">
        <div className="text-red-500">Error loading chat list</div>
      </div>
    );

  return (
    <Card className="w-80 rounded-r-none">
      <CardHeader>
        <CardTitle className="text-center">Chats</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <ul>
            {chatRooms.map((room) => (
              <li
                key={room.room_id} // Use a unique key instead of index
                onClick={() =>
                  handleSelectChat(room.room_id, room.other_user_id)
                } // Correctly wrapped in an arrow function
                className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
              >
                <Avatar className="mr-3">
                  <AvatarFallback>
                    {room.other_user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold capitalize">{room.other_user_name}</p>
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
