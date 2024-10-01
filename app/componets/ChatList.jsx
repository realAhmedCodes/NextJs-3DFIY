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




import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client"; // Add socket.io-client
import useSWR from "swr"; // Add SWR for data fetching

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ChatList = ({ currentUser, onSelectChat }) => {
  const [socket, setSocket] = useState(null);

  // Fetch chat list using SWR
  const { data: chatRooms, mutate } = useSWR(
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
    onSelectChat(roomId, otherUserId); // Pass roomId and otherUserId to the parent component
  };

  if (!chatRooms) return <div>Loading...</div>;

  return (
    <div className="w-1/4 bg-gray-200">
      <h2 className="p-4 text-lg font-bold text-center">Chats</h2>
      <ul>
        {chatRooms.map((room, index) => (
          <li
            key={index}
            onClick={() => selectChat(room.room_id, room.other_user_id)} // Pass both room_id and other_user_id
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
