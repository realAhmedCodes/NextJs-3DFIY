/*"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { jwtDecode } from "jwt-decode";
import ChatComponent from "@/componets/Chat";
import ChatList from "@/componets/ChatList";

const Page = () => {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {currentUser && (
        <ChatComponent currentUser={currentUser} otherUser={userId} />
      )}
      <ChatList currentUser={currentUser}></ChatList>
    </div>
  );
};

export default Page;
  */


"use client";
import React, { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
//import {jwtDecode} from "jwt-decode"; // Correct import
import ChatComponent from "@/app/componets/Chat";
import ChatList from "@/app/componets/ChatList";
import PendingOrder from "@/app/componets/PlaceOrder/PendingOrder"
import ActiveOrder from "@/app/componets/PlaceOrder/ActiveOrder";
import ModelOrder from "@/app/componets/PlaceOrder/Model_Order";
import { useSelector } from "react-redux";


const Page = () => {
  const { roomId, userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

  const [models, setModels] = useState([]);
 const [checkToken, setCheckToken] = useState("");
   const [activeRoomId, setActiveRoomId] = useState(roomId || null);
 const [otherUser, setOtherUser] = useState(userId || null);
 const [showChat, setShowChat]= useState(false)
const[ownUserId, setOwnUserId]= useState(null)

  
 
  const {  email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );
  setOwnUserId(userId)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/getUser`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();
        setUserDetail(userData);
        setModels(userData.models || []);
        setSellerType(userData.sellerType);
        setSellerId(userData.sellerId); // Set the sellerId
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  if (!userDetail) {
    return <p>Loading user details...</p>;
  }
    const handleStartNewChat = (otherUserId) => {
      const generatedRoomId = [currentUser, otherUserId].sort().join("-");
      setActiveRoomId(generatedRoomId);
      setOtherUser(otherUserId);
    };
  const handleSelectChat = (roomId, otherUserId) => {
    setActiveRoomId(roomId);
    setOtherUser(otherUserId);
  };


  const showChatBtn=()=>{
    setShowChat(!showChat)
  }
  const profilePicFilename = userDetail.profile_pic?.split("\\").pop();
  const profilePicPath = profilePicFilename
    ? `/uploads/${profilePicFilename}`
    : "";


    console.log("own id", ownUserId)

  return (
    <div className="flex">
      <div>
        <h1 className="text-2xl font-bold mb-4">{userDetail.name}</h1>
        <h1 className="text-2xl font-bold mb-4">{userDetail.location}</h1>
        <p className="text-xl">{userDetail.bio}</p>
        <p className="text-xl">{userDetail.ratings}</p>
        <p>{userDetail.sellerType}</p>
        {userDetail.profile_pic && (
          <img
            src={profilePicPath}
            alt={userDetail.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}

        {sellerType === "Designer" && (
          <div>
            <h2 className="text-xl font-bold mt-4">Uploaded Models</h2>
            {models.length > 0 ? (
              models.map((model) => (
                <div key={model.model_id} className="model-item">
                  <p>Name: {model.name}</p>
                  <p>Description: {model.description}</p>
                  <p>Price: {model.price}</p>
                  <img src={`/uploads/${model.image}`} alt={model.name} />
                </div>
              ))
            ) : (
              <p>No models uploaded yet.</p>
            )}
          </div>
        )}
      </div>
      <div>

        <PendingOrder
          userId={ownUserId}
          sellerType={sellerType}
          sellerId={sellerId}
        ></PendingOrder>
      </div>
      <div>
        <ActiveOrder
          userId={userId}
          sellerType={sellerType}
          sellerId={sellerId}
        ></ActiveOrder>
      </div>
      <div>
        <button>Place Order</button>
      </div>
      <div>
        <button onClick={showChatBtn}>Message</button>
      </div>
      <div>
        {sellerType === "Designer" ? (
          <>
            <ModelOrder sellerId={sellerId} userId={ownUserId}> </ModelOrder>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Page;

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