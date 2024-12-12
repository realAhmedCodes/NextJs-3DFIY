// pages/forgot-password.js
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { set } from "date-fns";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const router = useRouter();
  const formData = new FormData();

  formData.append("email", email);
  formData.append("name", name);

  console.log("Form Data:", formData);
  

  const handleOTPRequest = async () => {
    if (!email || !name) {
      toast("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/otp/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        setOtpModal(true);
      } else {
        toast(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred while sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

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

    console.log("OTP:", otp, email);
    
    try {
      const response = await axios.post("/api/otp/verify", {
        email: email,
        otp,
      });

      

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setOtpModal(false);
        router.push("/pages/reset-password");
      } else {
        toast.warning("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.warning("Please enter the correct OTP.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-8">
        <div className="w-full max-w-md mb-12">
          <div className="mb-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Button
              onClick={handleOTPRequest}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={otpModal}>
        <DialogContent className={otpModal && "fixed"}>
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
    </>
  );
};

export default ForgotPassword;
