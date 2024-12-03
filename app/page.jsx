"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BoomBox, Star, Box, PenTool, TrendingUp, Boxes } from "lucide-react";
import PriceEstimate from "./componets/PriceEstimate";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [file, setFile] = useState(null);
  const router = useRouter();
  const [data, setData] = useState({
    topDesigners: [],
    topPrinterOwners: [],
    topModels: [],
  });

  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  const fetchTopData = async () => {
    try {
      const response = await fetch("/api/getLandingPageData");
      if (!response.ok) {
        console.error("Failed to fetch data");
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTopData();
  }, []);

  console.log(data);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Navigate to the upload page and pass the file through the router state
      router.push(
        {
          pathname: "/upload",
          query: { file: formData.get("file").name }, // Just passing the file name for simplicity
        },
        {
          state: { file: selectedFile },
        }
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                  Join 3Dify - <br />
                  Design. Print. Create.
                </h1>
                <p className="mt-6 text-lg leading-8">
                  Library with over exclusive 10,000 3D Models, <br />
                  1,000+ Designers worldwide and 100+ Local Printers
                </p>
              </div>
              <div className="mt-10 flex items-center gap-x-4">
                <Link href="/pages/users/userProfiles/designers">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Connect with Designers
                  </Button>
                </Link>
                <Link href="/pages/printers/ViewPrinter">
                  <Button
                    variant="outline"
                    className="bg-transparent  text-white hover:bg-white"
                  >
                    Print Models
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* File Upload & Order Section */}
        <PriceEstimate />

        {/* Popular Categories */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container  mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Popular Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: Box, name: "3D Models" },
                { icon: Boxes, name: "3D Printing" },
                { icon: PenTool, name: "Custom Designs" },
                { icon: Boxes, name: "Printed Models" },
              ].map((category, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <category.icon className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Top Sellers */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Top Designers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.topDesigners.map((seller, index) => (
                <Card key={index} className="flex flex-col items-center p-6">
                  <Image
                    alt={`${seller.Users.name}'s profile`}
                    className="rounded-full mb-4"
                    height={100}
                    src={
                      seller.Users.profile_pic
                        ? seller.Users.profile_pic
                        : `/placeholder.svg`
                    }
                    style={{
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <h3 className="text-lg font-semibold capitalize">
                    {seller.Users.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {seller.Users.sellerType}
                  </p>
                  <div className="flex items-center">
                    <span className="ml-1 text-sm font-medium">
                      {seller.ratings !== null && (
                        <div className="flex items-center justify-center">
                          {[...Array(seller.ratings)].map((_, index) => (
                            <Star
                              className={"fill-yellow-400 text-yellow-400 mr-1"}
                              size={20}
                            />
                          ))}

                          {[...Array(5 - seller.ratings)].map((_, index) => (
                            <Star className={"mr-1 text-gray-300"} size={20} />
                          ))}
                        </div>
                      )}
                    </span>
                  </div>
                  <Link href={`/pages/users/${seller.user_id}/profile`}>
                    <Button className="w-full mt-2" size="sm" variant="ghost">View Profile</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Top Sellers */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Top Printer Owners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.topPrinterOwners.map((seller, index) => (
                <Card key={index} className="flex flex-col items-center p-6">
                  <Image
                    alt={`${seller.Users.name}'s profile`}
                    className="rounded-full mb-4"
                    height={100}
                    src={
                      seller.Users.profile_pic
                        ? seller.Users.profile_pic
                        : `/placeholder.svg`
                    }
                    style={{
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <h3 className="text-lg font-semibold capitalize">
                    {seller.Users.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {seller.Users.sellerType}
                  </p>
                  <div className="flex items-center">
                    <span className="ml-1 text-sm font-medium">
                      {seller.ratings !== null && (
                        <div className="flex items-center justify-center  mt-2">
                          {[...Array(seller.ratings)].map((_, index) => (
                            <Star
                              className={"fill-yellow-400 text-yellow-400 mr-1"}
                              size={20}
                            />
                          ))}

                          {[...Array(5 - seller.ratings)].map((_, index) => (
                            <Star className={"mr-1 text-gray-300"} size={20} />
                          ))}
                        </div>
                      )}
                    </span>
                  </div>
                  <Link href={`/pages/users/${seller.user_id}/profile`}>
                    <Button className="w-full mt-2" size="sm" variant="ghost">View Profile</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Top Sellers */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Popular 3D Models
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.topModels.map((seller, index) => (
                <Card key={index} className="flex flex-col items-center p-6">
                  <Image
                    alt={`${seller.name}'s profile`}
                    className="rounded-full mb-4"
                    height={100}
                    src={
                      seller.image
                        ? `/uploads/${seller.image}`
                        : `/placeholder.svg`
                    }
                    style={{
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <h3 className="text-lg font-semibold capitalize">
                    {seller.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    ${seller.price}
                  </p>
                  <div className="flex items-center">
                    
                  </div>
                  <Link href={`/pages/users/${seller.user_id}/profile`}>
                    <Button className="w-full mt-2" size="sm" variant="ghost">View Model</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Find",
                  description:
                    "Browse through thousands of 3D models or find the perfect designer/printer",
                },
                {
                  title: "Order",
                  description:
                    "Purchase a model, request a custom design, or order a 3D print",
                },
                {
                  title: "Receive",
                  description:
                    "Get your digital files or have your 3D printed item shipped to you",
                },
              ].map((step, index) => (
                <Card key={index} className="flex flex-col items-center p-6">
                  <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-2xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-center text-gray-500">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-20 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join 3Dify today and start exploring the world of 3D printing
                  and design
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/pages/register">
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    Sign Up Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="bg-primary text-white border-white hover:bg-white/90"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
