"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter hook

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [cnic_number, setCnic_number] = useState("");
  const [bio, setBio] = useState("");
  const [sellerType, setSellerType] = useState("Regular");
  const [profile_pic, setProfile_pic] = useState(null);
  const [nextComp, setNextComp] = useState(true);

  const router = useRouter(); // Initialize useRouter

  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const FILE_TYPES = ["image/jpeg", "image/png"];

  const [validName, setValidName] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  useEffect(() => {
    setValidName(name.trim() !== "");
  }, [name]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && FILE_TYPES.includes(file.type)) {
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const SubmitBtn = async (e) => {
    e.preventDefault();

    if (
      !validName ||
      !validUsername ||
      !validEmail ||
      !validPwd ||
      !validMatch
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !profile_pic
    ) {
      alert("Profile picture is required for Designer and Printer Owner.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", pwd);
    formData.append("location", location);
    formData.append("phoneNo", phoneNo);
    formData.append("sellerType", sellerType);
    formData.append("bio", bio);
    formData.append("cnic_number", cnic_number);
    if (profile_pic) formData.append("profile_pic", profile_pic);

    try {
      const otpResponse = await axios.post("/api/otp/generate", { email });
      await axios.post("/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registration successful!");
       router.push(`/pages/otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("There was an error!", error);
      alert("Registration failed.");
    }
  };

  const nextCompAsDesigner = () => {
    setSellerType("Designer");
    setNextComp(!nextComp);
  };

  const nextCompAsPrinterOwner = () => {
    setSellerType("Printer Owner");
    setNextComp(!nextComp);
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mt-14 mb-0">
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign up to get started
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {nextComp === true ? (
          <>
            <form className="space-y-6">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="profilePic">Profile Picture</label>
                <input
                  type="file"
                  id="profilePic"
                  onChange={(e) => handleFileChange(e, setProfile_pic)}
                  accept="image/jpeg,image/png"
                  required
                />
              </div>

              <div>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phoneNo">Phone Number</label>
                <input
                  type="number"
                  id="phoneNo"
                  placeholder="Enter Phone Number"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm_pwd">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_pwd"
                  value={matchPwd}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                />
              </div>

              <button onClick={SubmitBtn}>Submit</button>
              <div>
                <p>Become A Seller</p>
                <button onClick={nextCompAsPrinterOwner}>
                  As Printer Owner
                </button>
                <button onClick={nextCompAsDesigner}>As Model Designer</button>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <a
                  href="/pages/Login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Log In
                </a>
              </p>
            </form>
          </>
        ) : (
          <>
            <div>
              <div>
                <label htmlFor="bio">Bio</label>
                <input
                  type="text"
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="cnic_number">CNIC Number</label>
                <input
                  type="text"
                  id="cnic_number"
                  value={cnic_number}
                  onChange={(e) => setCnic_number(e.target.value)}
                  required
                />
              </div>

              <button onClick={SubmitBtn}>Submit</button>
              <button onClick={() => setNextComp(!nextComp)}>Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
