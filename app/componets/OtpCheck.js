// components/OtpCheck.jsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const OtpCheck = () => {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleChange = (e, index) => {
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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const submitBtn = async (e) => {
    e.preventDefault();

    const otp = otpValues.join("");

    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.status === 200) {
        alert("OTP verified successfully!");
        router.push("/"); // Redirect to a success page or dashboard
      } else {
        const data = await response.json();
        alert(data.message || "OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during OTP verification. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            OTP Verification
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitBtn} className="space-y-6">
            <div>
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
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpCheck;