"use client"
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: users, error } = useSWR(
    "/api/users/getUsers/getPrinterOwners",
    fetcher
  );
  const router = useRouter();

  if (error) return <div>Error loading users</div>;
  if (!users) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Printer Owners</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => {
          // Deriving the correct profile picture path
          const profilePicFilename = user.profile_pic?.split("\\").pop();
          const profilePicPath = profilePicFilename
            ? `/uploads/${profilePicFilename}`
            : null;

          return (
            <div
              key={user.user_id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() =>
                router.push(`/pages/users/${user.user_id}/profile`)
              }
            >
              {/* Image Section */}
              <div className="flex justify-center mt-4">
                {profilePicPath ? (
                  <div className="w-24 h-24 relative">
                    <Image
                      src={profilePicPath}
                      alt={user.name}
                      className="rounded-full object-cover"
                      layout="fill"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-6 text-center">
                <h2 className="text-lg font-semibold mb-2">{user.name}</h2>
                <p className="text-gray-600">{user.location}</p>
                <p className="text-gray-700 mt-2">Phone: {user.phoneNo}</p>
                <p className="text-gray-700 mt-2">
                  Verified: {user.is_verified ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-b-xl">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-sm hover:bg-blue-600 transition">
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
