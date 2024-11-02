// components/LoginForm.jsx
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  const submitBtn = async (e) => {
    e.preventDefault();

    setError(null); // Reset error state on each submission

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        // Save non-sensitive user data in Redux store
        dispatch(
          setUser({
            userId: data.user_id,
            sellerType: data.sellerType,
            sellerId: data.seller_id,
            email: data.email,
            isVerified: data.is_verified,
          })
        );

        console.log("Login successful");
        router.push(`/`);
      }
    } catch (error) {
      setError("Error during login, please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">
            Enter your email and password to sign in
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <p>{error}</p>
            </Alert>
          )}
          <form className="space-y-6" onSubmit={submitBtn}>
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {passwordShown ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="flex items-center justify-between mt-4">
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
              <p className="text-sm text-gray-600">
                Not registered?{" "}
                <a
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create account
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
