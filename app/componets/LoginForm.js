"use client";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);


  const submitBtn = async (e) => {

    e.preventDefault();

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

        console.log("Login successful");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div className="w-[400px] mx-auto">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <Button color="gray" size="lg" className="mt-6" fullWidth>
            sign in
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
