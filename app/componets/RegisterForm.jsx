// components/RegisterForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [submitting, setSubmiting] = useState(false);

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
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValidName(formData.name.trim() !== "");
  }, [formData.name]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(formData.username));
  }, [formData.username, USER_REGEX]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(formData.email));
  }, [formData.email, EMAIL_REGEX]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.pwd));
    setValidMatch(formData.pwd === formData.matchPwd);
  }, [formData.pwd, formData.matchPwd, PWD_REGEX]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && FILE_TYPES.includes(file.type)) {
      setFormData({ ...formData, profile_pic: file });
    } else {
      setFormData({ ...formData, profile_pic: null });
    }
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched({ ...touched, [id]: true });
  };

  const SubmitBtn = async (e) => {
    e.preventDefault();

    setSubmiting(true);

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
      toast.warning("Please fill out the form correctly.");
      return;
    }

    if (
      (sellerType === "Designer" || sellerType === "Printer Owner") &&
      !profile_pic
    ) {
      toast.warning(
        "Profile picture is required for Designer and Printer Owner."
      );
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
      await axios.post("/api/otp/generate", { email, name });

      // Sign up the user
      await axios.post("/api/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmiting(false);
      // Open OTP dialog
      setIsOtpDialogOpen(true);
    } catch (error) {
      toast.error("There was an error! " + error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
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
      toast.warning("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const response = await axios.post("/api/otp/verify", {
        email: formData.email,
        otp,
      });

      if (response.status === 200) {
        toast.success("Registration Completed. Please login to continue.");
        setIsOtpDialogOpen(false);
        router.push("/pages/Login");
      } else {
        toast.warning("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.warning("Please enter the correct OTP.");
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate Step 1
      if (validName && validUsername && validEmail) {
        setCurrentStep(2);
      } else {
        setTouched({
          ...touched,
          name: true,
          username: true,
          email: true,
        });
        toast.warning("Please fill out the form correctly before proceeding.");
      }
    } else if (currentStep === 2) {
      // Validate Step 2
      if (validPwd && validMatch) {
        setCurrentStep(3);
      } else {
        setTouched({
          ...touched,
          pwd: true,
          matchPwd: true,
        });
        toast.warning("Please fill out the form correctly before proceeding.");
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Sign Up to Get Started
          </h2>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="mt-1"
                />
                {touched.name && !validName && (
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
                  onBlur={handleBlur}
                  className="mt-1"
                />
                {touched.username && !validUsername && (
                  <p className="text-red-500 text-sm">
                    Username must be 4-24 characters, start with a letter, and
                    can include letters, numbers, underscores, and hyphens.
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
                  onBlur={handleBlur}
                  className="mt-1"
                />
                {touched.email && !validEmail && (
                  <p className="text-red-500 text-sm">
                    Enter a valid email address.
                  </p>
                )}
              </div>

              {/* Next Button */}
              <Button type="button" onClick={handleNext} className="w-full">
                Next
              </Button>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <a
                  href="/pages/Login"
                  className="font-semibold text-gray-600 hover:text-gray-800"
                >
                  {" "}
                  Log In
                </a>
              </p>
            </form>
          )}

          {currentStep === 2 && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {/* Password */}
              <div>
                <Label htmlFor="pwd">Password</Label>
                <Input
                  id="pwd"
                  type="password"
                  placeholder="********"
                  value={formData.pwd}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="mt-1"
                />
                {touched.pwd && !validPwd && (
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
                  onBlur={handleBlur}
                  className="mt-1"
                />
                {touched.matchPwd && !validMatch && (
                  <p className="text-red-500 text-sm">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form className="space-y-6" onSubmit={SubmitBtn}>
              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1"
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
                  className="mt-1"
                />
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
                  className="mt-1"
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
                  className="mt-1"
                ></Textarea>
              </div>

              {/* Seller Type Selection */}
              <div>
                <Label>Become a Seller</Label>
                <RadioGroup
                  value={formData.sellerType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sellerType: value })
                  }
                  className="mt-2 flex gap-8"
                >
                  <div className="flex items-center space-x-4 mt-2">
                    <RadioGroupItem value="Designer" id="designer" />
                    <Label htmlFor="designer" className="cursor-pointer">
                      Model Designer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <RadioGroupItem value="Printer Owner" id="printerOwner" />
                    <Label htmlFor="printerOwner" className="cursor-pointer">
                      Printer Owner
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Profile Picture */}
              {(formData.sellerType === "Designer" ||
                formData.sellerType === "Printer Owner") && (
                <div>
                  <Label htmlFor="profile_pic">Profile Picture</Label>
                  <Input
                    id="profile_pic"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {!formData.profile_pic && (
                    <p className="text-red-500 text-sm">
                      Profile picture is required.
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen}>
        <DialogContent className={isOtpDialogOpen && "fixed"}>
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
  );
};

export default RegisterForm;
