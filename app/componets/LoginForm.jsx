"use client"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/userSlice";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

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
              labelProps={{ className: "hidden" }}
            />
          </div>
          <div className="mb-6">
            <Input
              size="lg"
              placeholder="********"
              labelProps={{ className: "hidden" }}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisibility}>
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
            size="lg"
            className="mt-6"
            fullWidth
            onClick={submitBtn}
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
