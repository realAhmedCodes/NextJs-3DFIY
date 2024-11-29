import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ModelGallery({ img }) {
  return (
    <Card className="p-2">
      <Dialog> 
        <DialogTrigger className="overflow-hidden">
          <div className="relative rounded-lg w-full h-96">
            <Image
              src={img}
              alt="Model"
              width={800}
              height={600}
              className="object-cover rounded-lg"
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
