"use client"
import React,{useState, useEffect} from 'react'
import { useRouter } from "next/navigation"; 
const page = () => {
  const [users, setUsers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/getUsers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const Data = await response.json();
      
        // Ensure modelsData is an array
        if (Array.isArray(Data)) {
          setUsers(Data);
        } else if (Data) {
          // Wrap the single object in an array
          setUsers([Data]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);
  //const profilePicFilename = users.profile_pic.split("\\").pop();
  //const profilePicPath = `/uploads/${profilePicFilename}`;
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Latest Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {users.map((user) => (
          <div
            key={user.user_id}
            /// onClick={() => router.push(`/pages/ModelDetail/${model.model_id}`)}
            //onClick={() => router.push(`/pages/model`)}onClick={() => router.push(`/model/${model.model_id}`)}
            onClick={() => router.push(`/pages/users/${user.user_id}/profile`)}
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
          >
            <p>{user.name}</p>
            <p>{user.location}</p>
           
          </div>
        ))}
      </div>
    </div>
  );
};


export default page