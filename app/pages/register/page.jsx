import RegisterForm from "@/app/componets/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-primary">
        <div className="p-10">
          <Link href="/">
            <Image src="/3dify-white.png" alt="Logo" width={150} height={0} />
          </Link>
        </div>
      </div>
      <RegisterForm />
    </div>
  );
};

export default page;
