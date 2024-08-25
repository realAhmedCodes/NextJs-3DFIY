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

const ChatList = ({ currentUser, onSelectChat }) => {
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

const selectChat = (roomId, otherUserId) => {
  onSelectChat(roomId, otherUserId); // Pass roomId and otherUserId to the parent component
};


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
