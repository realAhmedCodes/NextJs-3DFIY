// components/LoginForm.jsx

"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { toast } from "sonner";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";

const LoginModal = () => {
  // State management for form inputs and UI states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Toggle password visibility
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
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
        toast.error(data.detail);
      } else {
        dispatch(
          setUser({
            userId: data.user_id,
            sellerType: data.sellerType,
            sellerId: data.seller_id,
            email: data.email,
            isVerified: data.is_verified,
          })
        );
        setLoading(false);
        toast.success("Login successful!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error during login, please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <p>{error}</p>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="mt-1 relative">
              <Input
                id="password"
                name="password"
                type={passwordShown ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                aria-label={passwordShown ? "Hide password" : "Show password"}
              >
                {passwordShown ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>

          {/* Login with Google Button */}
          <div>
            <Button
              variant="outline"
              className="w-full py-3 px-6 rounded-lg shadow-lg transition duration-300"
              disabled
              onClick={() => {}}
            >
              <span>Login with Google</span>
            </Button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/pages/register"
            className="font-medium text-gray-700 hover:text-gray-800"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </>
  );
};

export default LoginModal;
