// /app/users/[userId]/UpdateProfilePage.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const UpdateProfilePage = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Validation States
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/userDetail`);
        const data = response.data;
        setUser(data);
        setName(data.name);
        setUsername(data.username);
        setLocation(data.location);
        setEmail(data.email);
        setPhoneNo(data.phoneNo);
        setSellerType(data.sellerType);
        setIsVerified(data.is_verified);
        // Note: For security reasons, you typically wouldn't fetch the password.
        // Instead, provide a separate mechanism for password updates.
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  // Handle form validation
  const validateInputs = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      // Simple email regex for validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required.";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("location", location);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    //formData.append("sellerType", sellerType);
    //formData.append("is_verified", isVerified);

    if (password) {
      formData.append("password", password);
    }

    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      const response = await fetch(`/api/users/${userId}/updateUser`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        console.error("Error updating profile:", data.error);
        alert(`Error: ${data.error}`);
      } else {
        console.log("Profile updated successfully:", data);
        alert("Profile updated successfully!");
        router.push(`/pages/users/${userId}/UserProfile`); // Redirect to the user's profile page
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again later.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Profile</CardTitle>
          <CardDescription>Modify your profile details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="mt-1 block w-full"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="mt-1 block w-full"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 block w-full"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                id="phoneNo"
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="mt-1 block w-full"
              />
              {errors.phoneNo && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNo}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                required
                className="mt-1 block w-full"
              />
            </div>

          

           

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password (leave blank to keep unchanged)
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1 block w-full"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label
                htmlFor="profilePic"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture
              </label>
              <input
                id="profilePic"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {user.profile_pic && !profilePic && (
                <p className="mt-1 text-sm text-gray-500">
                  Current Image: {user.profile_pic}
                </p>
              )}
              {profilePic && (
                <p className="mt-1 text-sm text-gray-500">
                  New Image: {profilePic.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfilePage;
