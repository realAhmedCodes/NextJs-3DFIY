"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BasicInfo } from "./basic-info";
import { TechnicalSpecs } from "./technical-specs";
import { MaterialsAndColors } from "./materials-and-colors";
import { ServicesAndPrice } from "./services-and-price";
import { ImageUpload } from "./image-upload";
import { Printer, Cog, Palette, DollarSign, Image } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const steps = [
  { title: "Basic Info", icon: Printer, component: BasicInfo },
  { title: "Technical Specs", icon: Cog, component: TechnicalSpecs },
  { title: "Materials & Colors", icon: Palette, component: MaterialsAndColors },
  { title: "Services & Price", icon: DollarSign, component: ServicesAndPrice },
  { title: "Image Upload", icon: Image, component: ImageUpload },
];

export default function PrinterUploadForm({ initialSellerId }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ sellerId: initialSellerId });

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data) => {
    const formData = new FormData();
    const finalData = { ...formData, ...data, sellerId: initialSellerId };

    // Append the form fields
    formData.append("printer_owner_id", finalData.sellerId);
    formData.append("name", finalData.name);
    formData.append("description", finalData.description);
    formData.append("printerType", finalData.printerType);
    formData.append("materials", JSON.stringify(finalData.materials)); // Materials as a JSON string
    formData.append("colors", JSON.stringify(finalData.colors)); // Colors as a JSON string
    formData.append("services", JSON.stringify(finalData.services)); // Services as a JSON string
    formData.append("price", finalData.price);
    formData.append("location", finalData.location);
    formData.append("image", finalData.image[0]);
    formData.append("printVolumeWidth", finalData.printVolumeWidth);
    formData.append("printVolumeDepth", finalData.printVolumeDepth);
    formData.append("printVolumeHeight", finalData.printVolumeHeight);
    formData.append("layerResolutionMin", finalData.layerResolutionMin);
    formData.append("layerResolutionMax", finalData.layerResolutionMax);
    formData.append("printSpeedMax", finalData.printSpeedMax);
    formData.append("nozzleDiameter", finalData.nozzleDiameter);
    formData.append("filamentDiameter", finalData.filamentDiameter);

    

    try {
      console.log("form Data:", formData);
      const response = await fetch("/api/printers/printerUpload", {
        method: "POST",
        body: formData, 
      });

      const responseData = await response.json();
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        toast.success("Printer uploaded successfully:", responseData);
        router.push('/pages/printers/viewPrinter');
      }
    } catch (error) {
      console.error(error);
      console.log("Server Error");
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Upload a New Printer
          </CardTitle>
          <CardDescription>
            Complete the form to add your 3D printer to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Progress
              value={(currentStep / (steps.length - 1)) * 100}
              className="w-full"
            />
          </div>
          <div className="flex justify-center mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center mx-4 ${
                  index === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="mt-2 text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <CurrentStepComponent
            onNext={handleNext}
            onSubmit={handleSubmit}
            data={formData}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 && (
            <Button form={`form-step-${currentStep}`} type="submit">
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              form={`form-step-${currentStep}`}
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
