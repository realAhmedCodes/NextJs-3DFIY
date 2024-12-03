import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export default function ModelGallery({ img }) {
  console.log(img, "model image" )
  return (
    <Card className="p-2">
      <Dialog> 
        <DialogTrigger className="overflow-hidden">
          <div className="relative rounded-lg  bg-black w-full h-96">
            <Image
              src={img}
              alt="Model"
              width={850}
              height={600}
              className="object-cover rounded-lg hover:opacity-70 duration-200 ease-in-out"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 text-white">
          <Image
            src={img}
            alt="Model"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
