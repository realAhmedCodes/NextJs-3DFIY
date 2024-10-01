"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr"; // Import useSWR
import ChatComponent from "@/app/componets/Chat";
import ChatList from "@/app/componets/ChatList";
import PendingOrder from "@/app/componets/PlaceOrder/PendingOrder";
import ActiveOrder from "@/app/componets/PlaceOrder/ActiveOrder";
import ModelOrder from "@/app/componets/PlaceOrder/Model_Order";
import { useSelector } from "react-redux";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { roomId, profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [otherUser, setOtherUser] = useState(profileUserId || null);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [ModelOrderShow, setModelOrderShow] = useState(false);

  const { userId, email, isVerified } = useSelector((state) => state.user);

  useEffect(() => {
    setCurrentUser(userId);
  }, [userId]);

  // Use SWR to fetch user data
  const {
    data: userDetail,
    error,
    isLoading,
  } = useSWR(
    profileUserId ? `/api/users/${profileUserId}/getUser` : null,
    fetcher
  );

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Failed to load user details.</p>;

  const generatedRoomId = [currentUser, otherUser].sort().join("-");

  const handleSelectChat = (roomId, otherUser) => {
    setActiveRoomId(roomId);
    setOtherUser(otherUser);
  };

  const showChatBtn = () => {
    setShowChat(!showChat);
  };

  const ModelOrderShowFunc = () => {
    setModelOrderShow(!ModelOrderShow);
  };

  const profilePicFilename = userDetail?.profile_pic?.split("\\").pop();
  const profilePicPath = profilePicFilename
    ? `/uploads/${profilePicFilename}`
    : "";

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50">
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-4">{userDetail?.name}</h1>
        <h2 className="text-xl text-gray-600 mb-2">{userDetail?.location}</h2>
        <p className="text-lg text-gray-700 mb-4">{userDetail?.bio}</p>
        <p className="text-lg font-bold text-blue-500 mb-4">
          Rating: {userDetail?.ratings}
        </p>
        <p className="text-lg mb-4">Seller Type: {userDetail?.sellerType}</p>
        {userDetail?.profile_pic && (
          <img
            src={profilePicPath}
            alt={userDetail?.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}

        {userDetail?.sellerType === "Designer" && (
          <div>
            <h2 className="text-xl font-semibold mt-6">Uploaded Models</h2>
            {userDetail?.models?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {userDetail.models.map((model) => (
                  <div
                    key={model.model_id}
                    className="bg-gray-100 rounded-lg p-4 shadow"
                  >
                    <p className="font-bold">Name: {model.name}</p>
                    <p>Description: {model.description}</p>
                    <p>Price: {model.price}</p>
                    <img
                      src={`/uploads/${model.image}`}
                      alt={model.name}
                      className="w-full h-auto rounded-md mt-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No models uploaded yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex-grow bg-white rounded-lg shadow-lg p-6">
        <PendingOrder profileUserId={profileUserId} />
        <ActiveOrder profileUserId={profileUserId} />

        <div className="mt-6 flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={ModelOrderShowFunc}
          >
            Place Order
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={showChatBtn}
          >
            Message
          </button>
        </div>

        {ModelOrderShow && userDetail?.sellerType === "Designer" && (
          <div className="mt-6">
            <ModelOrder sellerId={userDetail?.sellerId} userId={currentUser} />
          </div>
        )}

        {showChat && currentUser && (
          <div className="mt-6">
           
            <ChatComponent
              currentUser={currentUser}
              roomId={generatedRoomId}
              otherUser={otherUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;


/* <ChatList
              currentUser={currentUser}
              onSelectChat={handleSelectChat}
            /> */

/*
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import ChatComponent from "@/componets/Chat";
import ChatList from "@/componets/ChatList";

const Page = () => {
  const { roomId, userId } = useParams(); // Extract roomId and userId from URL if they exist
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null); // Manage active roomId
  const [otherUser, setOtherUser] = useState(userId || null); // Set otherUser from params or null for new chats

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setCurrentUser(userId);
      } catch (error) {
        console.error("Invalid token");
      }
    }
    setLoading(false);
  }, []);

  const handleStartNewChat = (otherUserId) => {
    const generatedRoomId = [currentUser, otherUserId].sort().join("-");
    setActiveRoomId(generatedRoomId);
    setOtherUser(otherUserId); // Keep track of other user for first-time chat
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      {currentUser && (
        <>
          <ChatList
            currentUser={currentUser}
            onSelectChat={(roomId, otherUserId) => {
              setActiveRoomId(roomId);
              setOtherUser(otherUserId);
            }}
          />
          {activeRoomId && (
            <ChatComponent
              currentUser={currentUser}
              roomId={activeRoomId}
              otherUser={otherUser}
              onNewChatInitiate={handleStartNewChat}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Page;
*/

/* {showChat === false ? (
        <></>
      ) : (
        <>
         
          {currentUser && (
            <>
              <ChatList
                currentUser={currentUser}
                onSelectChat={handleSelectChat}
              />
              <ChatComponent
                currentUser={currentUser}
                roomId={activeRoomId}
                otherUser={otherUser}
              />
            </>
          )}
        </>
      )}*/
