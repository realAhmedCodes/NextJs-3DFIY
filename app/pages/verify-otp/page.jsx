// pages/verify-otp.js
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log(router);
  
  console.log(email);
  

  useEffect(() => {
    if (!email) {
      toast("No email provided. Please request a new OTP.");
    }
  }, [email]);

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleVerifyOTP = async () => {
    if (!email) {
      toast("No email provided. Please request a new OTP.");
      return;
    }

    if (!otp) {
      toast("Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }), // Include email in the request body
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        // Redirect to reset password page
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred while verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Verify OTP</h2>
        <div className="mb-4">
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={handleVerifyOTP}
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Verifying OTP..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
