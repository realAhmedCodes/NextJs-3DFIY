// components/RegisterForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    pwd: "",
    matchPwd: "",
    location: "",
    phoneNo: "",
    cnic_number: "",
    bio: "",
    sellerType: "Regular",
    profile_pic: null,
  });
  const [nextComp, setNextComp] = useState(true);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));

  const router = useRouter();

  // Validation regex patterns
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const FILE_TYPES = ["image/jpeg", "image/png"];

  // Validation states
  const [validName, setValidName] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  useEffect(() => {
    setValidName(formData.name.trim() !== "");
  }, [formData.name]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(formData.username));
  }, [formData.username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(formData.email));
  }, [formData.email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.pwd));
    setValidMatch(formData.pwd === formData.matchPwd);
  }, [formData.pwd, formData.matchPwd]);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "profile_pic") {
      const file = files[0];
      if (file && FILE_TYPES.includes(file.type)) {
        setFormData({ ...formData, profile_pic: file });
      } else {
        setFormData({ ...formData, profile_pic: null });
        alert("Invalid file type. Only JPEG and PNG are allowed.");
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const SubmitBtn = async (e) => {
    e.preventDefault();

    const {
      name,
      username,
      email,
      pwd,
      matchPwd,
      location,
      phoneNo,
      cnic_number,
      bio,
      sellerType,
      profile_pic,
    } = formData;

    // Basic validation
    if (
      !validName ||
      !validUsername ||
      !validEmail ||
      !validPwd ||
      !validMatch
    ) {
      alert("Please fill out the form correctly.");
      return;
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !profile_pic
    ) {
      alert("Profile picture is required for Designer and Printer Owner.");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("username", username);
    data.append("email", email);
    data.append("password", pwd);
    data.append("location", location);
    data.append("phoneNo", phoneNo);
    data.append("sellerType", sellerType);
    data.append("bio", bio);
    data.append("cnic_number", cnic_number);
    if (profile_pic) data.append("profile_pic", profile_pic);

    try {
      // Generate OTP
      await axios.post("/api/otp/generate", { email });

      // Sign up the user
      await axios.post("/api/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Open OTP dialog
      setIsOtpDialogOpen(true);
    } catch (error) {
      console.error("There was an error!", error);
      alert("Registration failed.");
    }
  };

  // OTP Input Functions
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = val;
      setOtpValues(newOtpValues);

      // Move focus to next input
      if (val && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const otp = otpValues.join("");

    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const response = await axios.post("/api/otp/verify", {
        email: formData.email,
        otp,
      });

      if (response.status === 200) {
        alert("OTP verified successfully!");
        setIsOtpDialogOpen(false);
        router.push("/"); // Redirect to a success page or dashboard
      } else {
        alert("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed. Please try again.");
    }
  };

  const nextCompAsDesigner = () => {
    setFormData({ ...formData, sellerType: "Designer" });
    setNextComp(false);
  };

  const nextCompAsPrinterOwner = () => {
    setFormData({ ...formData, sellerType: "Printer Owner" });
    setNextComp(false);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign up to get started
            </h2>
          </CardHeader>
          <CardContent>
            {nextComp ? (
              <form className="space-y-6" onSubmit={SubmitBtn}>
                {/* Name */}
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {!validName && (
                    <p className="text-red-500 text-sm">Name is required.</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  {!validUsername && (
                    <p className="text-red-500 text-sm">
                      Username must be 4-24 characters, start with a letter.
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {!validEmail && (
                    <p className="text-red-500 text-sm">
                      Enter a valid email address.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="pwd">Password</Label>
                  <Input
                    id="pwd"
                    type="password"
                    placeholder="********"
                    value={formData.pwd}
                    onChange={handleInputChange}
                    required
                  />
                  {!validPwd && (
                    <p className="text-red-500 text-sm">
                      Password must be 8-24 characters, include uppercase and
                      lowercase letters, a number, and a special character.
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="matchPwd">Confirm Password</Label>
                  <Input
                    id="matchPwd"
                    type="password"
                    placeholder="********"
                    value={formData.matchPwd}
                    onChange={handleInputChange}
                    required
                  />
                  {!validMatch && (
                    <p className="text-red-500 text-sm">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNo">Phone Number</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Seller Type Selection */}
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700">Become a Seller:</p>
                  <Button variant="outline" onClick={nextCompAsDesigner}>
                    As Model Designer
                  </Button>
                  <Button variant="outline" onClick={nextCompAsPrinterOwner}>
                    As Printer Owner
                  </Button>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Submit
                </Button>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?
                  <a
                    href="/pages/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {" "}
                    Log In
                  </a>
                </p>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={SubmitBtn}>
                {/* Profile Picture */}
                <div>
                  <Label htmlFor="profile_pic">Profile Picture</Label>
                  <Input
                    id="profile_pic"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write your bio here"
                    value={formData.bio}
                    onChange={handleInputChange}
                  ></Textarea>
                </div>

                {/* CNIC Number */}
                <div>
                  <Label htmlFor="cnic_number">CNIC Number</Label>
                  <Input
                    id="cnic_number"
                    type="text"
                    placeholder="Enter CNIC"
                    value={formData.cnic_number}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* OTP Verification Dialog */}
        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOtpSubmit}>
              <div className="space-y-4">
                <Label htmlFor="otp">
                  Enter the 6-digit OTP sent to your email
                </Label>
                <div className="mt-4 flex justify-center space-x-2">
                  {otpValues.map((value, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl"
                      value={value}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    />
                  ))}
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterForm;

/*
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Input, Typography } from "@material-tailwind/react";

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
      // Generate OTP
      const otpResponse = await axios.post("/api/otp/generate", { email });
      
      // Sign up the user
      await axios.post("/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redirect to OTP page
      alert("Registration successful! Please verify OTP.");
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
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="username">Username</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
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
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="file"
                  id="profilePic"
                  onChange={(e) => handleFileChange(e, setProfile_pic)}
                  accept="image/jpeg,image/png"
                  required
                />
              </div>

              <div>
                <label htmlFor="location">Location</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phoneNo">Phone Number</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="number"
                  id="phoneNo"
                  placeholder="Enter Phone Number"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
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
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="password"
                  placeholder="********"
                  id="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm_pwd">Confirm Password</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="password"
                  placeholder="********"
                  id="confirm_pwd"
                  value={matchPwd}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                />
              </div>

              <Button onClick={SubmitBtn}>Submit</Button>
              <div>
                <p>Become A Seller</p>
                <Button onClick={nextCompAsPrinterOwner}>
                  As Printer Owner
                </Button>
                <Button onClick={nextCompAsDesigner}>As Model Designer</Button>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <a
                  href="/pages/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  {" "}
                  Log In
                </a>
              </p>
            </form>
          </>
        ) : sellerType === "Designer" ? (
          <>
            <form className="space-y-6">
              <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  id="bio"
                  placeholder="Write your bio here"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label htmlFor="cnic_number">CNIC Number</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="number"
                  id="cnic_number"
                  placeholder="Enter CNIC"
                  value={cnic_number}
                  onChange={(e) => setCnic_number(e.target.value)}
                />
              </div>

              <Button onClick={SubmitBtn}>Submit</Button>
            </form>
          </>
        ) : (
          <>
            <form className="space-y-6">
              <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  id="bio"
                  placeholder="Write your bio here"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label htmlFor="cnic_number">CNIC Number</label>
                <Input
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  size="lg"
                  type="number"
                  id="cnic_number"
                  placeholder="Enter CNIC"
                  value={cnic_number}
                  onChange={(e) => setCnic_number(e.target.value)}
                />
              </div>

              <Button onClick={SubmitBtn}>Submit</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
*/
