"use client";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
// New fetching logic
const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: users, error } = useSWR("/api/users/getUsers", fetcher);
  const router = useRouter();

  if (error) return <div>Error loading users</div>;
  if (!users) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Latest Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {users.map((user) => (
          <div
            key={user.user_id}
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

export default Page;
