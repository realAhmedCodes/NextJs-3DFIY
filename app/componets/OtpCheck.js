"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import necessary hooks

const OtpCheck = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get the email from the query parameter

  const submitBtn = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }), // Send email along with OTP
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push("/"); // Redirect to a success page or dashboard
      } else {
        alert(data.message); // Show error message
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input
        onChange={(e) => setOtp(e.target.value)}
        type="text"
        name="otp"
        id="otp"
        placeholder="Enter OTP"
      />
      <button onClick={submitBtn}>Submit</button>
    </div>
  );
};

export default OtpCheck;
