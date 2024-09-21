"use client";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [open, setOpen] = React.useState(true);
  const submitBtn = async (e) => {
    e.preventDefault();

    setError(null); // Reset error state on each submission
    setSuccess(null); // Reset success state on each submission

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        window.sessionStorage.setItem("token", data.token);
        setSuccess("Login successful!");
        console.log("Login successful");
        window.location.reload();
      }
    } catch (error) {
      setOpen(true);
      setError("Error during login, please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div className="w-[400px] mx-auto">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-8 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>

        {error && (
          <Alert color="red" open={open} onClose={() => setOpen(false)} className="mb-4 max-w-96 absolute bottom-0 right-0 m-4">
            {error}
          </Alert>
        )}

        {/* Alert for success */}
        {success && (
          <Alert color="green" open={open} onClose={() => setOpen(false)} className="mb-4">
            {success}
          </Alert>
        )}

        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "",
              }}
            />
          </div>
          <div className="mb-6">
            <Input
              size="lg"
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button
            color="gray"
            onClick={submitBtn}
            size="lg"
            className="mt-6"
            fullWidth
          >
            Sign In
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Not registered?{" "}
            <a href="#" className="font-medium text-gray-900">
              Create account
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
