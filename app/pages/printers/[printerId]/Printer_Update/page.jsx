"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";

const printerOptions = {
  FDM: {
    name: "Fused Deposition Modeling",
    materials: [
      "PLA (Polylactic Acid)",
      "ABS (Acrylonitrile Butadiene Styrene)",
      "PETG (Polyethylene Terephthalate Glycol-modified)",
      "TPU (Thermoplastic Polyurethane)",
      "Nylon",
    ],
  },
  SLA: {
    name: "Stereolithography",
    materials: [
      "Standard Resin",
      "Tough Resin",
      "Flexible Resin",
      "Castable Resin",
    ],
  },
  SLS: {
    name: "Selective Laser Sintering",
    materials: [
      "Nylon (Polyamide)",
      "TPU (Thermoplastic Polyurethane)",
      "Glass-Filled Nylon",
      "Alumide",
    ],
  },
  DLP: {
    name: "Digital Light Processing",
    materials: ["Standard Resin", "Tough Resin", "Flexible Resin"],
  },
};

const UpdatePrinterPage = () => {
  const { printerId } = useParams(); // Get printerId from URL params
  const [printer, setPrinter] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [printerType, setPrinterType] = useState("");

  // Technical Specifications as Separate Numeric Fields
  const [printVolumeWidth, setPrintVolumeWidth] = useState("");
  const [printVolumeDepth, setPrintVolumeDepth] = useState("");
  const [printVolumeHeight, setPrintVolumeHeight] = useState("");
  const [layerResolutionMin, setLayerResolutionMin] = useState("");
  const [layerResolutionMax, setLayerResolutionMax] = useState("");
  const [printSpeedMax, setPrintSpeedMax] = useState("");
  const [nozzleDiameter, setNozzleDiameter] = useState("");
  const [filamentDiameter, setFilamentDiameter] = useState("");

  // Validation States
  const [errors, setErrors] = useState({});

  const { sellerId } = useSelector((state) => state.user);
  const router = useRouter();

  // Fetch printer details
  useEffect(() => {
    const fetchPrinterDetail = async () => {
      try {
        const response = await axios.get(
          `/api/printers/${printerId}/printerDetail`
        );
        const data = response.data;
        setPrinter(data);
        setName(data.printer_name);
        setDescription(data.description);
        setMaterials(data.materials || []);
        setSelectedMaterials(data.materials || []); // Assuming all existing materials are selected
        setLocation(data.user_location);
        setPrice(data.price);
        setPrinterType(data.printer_type);
        // Set technical specifications
        const specs = data.specifications;
        setPrintVolumeWidth(parseFloat(specs.printVolume.split(" x ")[0]));
        setPrintVolumeDepth(parseFloat(specs.printVolume.split(" x ")[1]));
        setPrintVolumeHeight(parseFloat(specs.printVolume.split(" x ")[2]));
        setLayerResolutionMin(
          parseFloat(specs.layerResolution.split(" - ")[0])
        );
        setLayerResolutionMax(
          parseFloat(specs.layerResolution.split(" - ")[1])
        );
        setPrintSpeedMax(parseFloat(specs.printSpeed));
        setNozzleDiameter(parseFloat(specs.nozzleDiameter));
        setFilamentDiameter(parseFloat(specs.filamentDiameter));
      } catch (error) {
        console.error("Failed to fetch printer details", error);
      }
    };

    if (printerId) {
      fetchPrinterDetail();
    }
  }, [printerId]);

  // Handle material selection
  const handleMaterialChange = (material) => {
    setSelectedMaterials((prevSelectedMaterials) =>
      prevSelectedMaterials.includes(material)
        ? prevSelectedMaterials.filter((m) => m !== material)
        : [...prevSelectedMaterials, material]
    );
  };

  // Regular Expressions for Validation
  const regexPatterns = {
    printVolumeWidth: /^\d+(\.\d+)?$/, // e.g., "20" or "20.5"
    printVolumeDepth: /^\d+(\.\d+)?$/, // e.g., "52" or "52.3"
    printVolumeHeight: /^\d+(\.\d+)?$/, // e.g., "65" or "65.1"
    layerResolutionMin: /^\d+(\.\d+)?$/, // e.g., "25" or "25.5"
    layerResolutionMax: /^\d+(\.\d+)?$/, // e.g., "63" or "63.2"
    printSpeedMax: /^\d+(\.\d+)?$/, // e.g., "150" or "150.5"
    nozzleDiameter: /^\d+(\.\d+)?$/, // e.g., "0.2" or "0.2"
    filamentDiameter: /^\d+(\.\d+)?$/, // e.g., "0.12" or "0.12"
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!regexPatterns.printVolumeWidth.test(printVolumeWidth)) {
      newErrors.printVolumeWidth = "Please enter a valid width (e.g., 20)";
    }

    if (!regexPatterns.printVolumeDepth.test(printVolumeDepth)) {
      newErrors.printVolumeDepth = "Please enter a valid depth (e.g., 52)";
    }

    if (!regexPatterns.printVolumeHeight.test(printVolumeHeight)) {
      newErrors.printVolumeHeight = "Please enter a valid height (e.g., 65)";
    }

    if (!regexPatterns.layerResolutionMin.test(layerResolutionMin)) {
      newErrors.layerResolutionMin =
        "Please enter a valid minimum resolution (e.g., 25)";
    }

    if (!regexPatterns.layerResolutionMax.test(layerResolutionMax)) {
      newErrors.layerResolutionMax =
        "Please enter a valid maximum resolution (e.g., 63)";
    }

    if (!regexPatterns.printSpeedMax.test(printSpeedMax)) {
      newErrors.printSpeedMax = "Please enter a valid print speed (e.g., 150)";
    }

    if (!regexPatterns.nozzleDiameter.test(nozzleDiameter)) {
      newErrors.nozzleDiameter =
        "Please enter a valid nozzle diameter (e.g., 0.2)";
    }

    if (!regexPatterns.filamentDiameter.test(filamentDiameter)) {
      newErrors.filamentDiameter =
        "Please enter a valid filament diameter (e.g., 0.12)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const formData = new FormData();
    formData.append("printer_owner_id", sellerId); // Assuming sellerId is the owner ID
    formData.append("price", price);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("printerType", printerType);
    formData.append("materials", JSON.stringify(selectedMaterials));
    formData.append("location", location);

    // Append Technical Specifications as Separate Numbers
    formData.append("printVolumeWidth", printVolumeWidth);
    formData.append("printVolumeDepth", printVolumeDepth);
    formData.append("printVolumeHeight", printVolumeHeight);
    formData.append("layerResolutionMin", layerResolutionMin);
    formData.append("layerResolutionMax", layerResolutionMax);
    formData.append("printSpeedMax", printSpeedMax);
    formData.append("nozzleDiameter", nozzleDiameter);
    formData.append("filamentDiameter", filamentDiameter);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`/api/printers/${printerId}/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        console.log("Error updating printer:", data.error);
        // Optionally, display error messages to the user
      } else {
        console.log("Printer updated successfully:", data);
        router.push(`/printers/${printerId}`); // Redirect to the updated printer's detail page
      }
    } catch (error) {
      console.error("Update failed:", error);
      // Optionally, display a generic error message to the user
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  if (!printer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Update Printer Details
          </CardTitle>
          <CardDescription>
            Modify the details of your printer below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Printer Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Printer Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter printer name"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Printer Type */}
            <div>
              <label
                htmlFor="printerType"
                className="block text-sm font-medium text-gray-700"
              >
                Select Printer Type
              </label>
              <Select
                value={printerType}
                onValueChange={(value) => setPrinterType(value)}
                required
              >
                <SelectTrigger className="mt-1 text-left">
                  <SelectValue placeholder="Select a printer type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(printerOptions).map((type) => (
                    <SelectItem key={type} value={type}>
                      {printerOptions[type].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Materials */}
            {materials.length > 0 && (
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Select Materials
                </span>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <label
                      key={material}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={() => handleMaterialChange(material)}
                      />
                      <span className="text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
                className="mt-1 block w-full"
                min="0"
                step="0.01"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {image && (
                <p className="mt-1 text-sm text-gray-500">
                  Current Image: {printer.image}
                </p>
              )}
            </div>

            {/* Technical Specifications */}
            <h3 className="text-lg font-semibold mb-4">
              Technical Specifications
            </h3>

            {/* Print Volume */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="printVolumeWidth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Print Volume Width (mm)
                </label>
                <Input
                  id="printVolumeWidth"
                  type="number"
                  value={printVolumeWidth}
                  onChange={(e) => setPrintVolumeWidth(e.target.value)}
                  placeholder="Width in mm (e.g., 20)"
                  required
                  className="mt-1 block w-full"
                  min="0"
                  step="0.01"
                />
                {errors.printVolumeWidth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.printVolumeWidth}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="printVolumeDepth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Print Volume Depth (mm)
                </label>
                <Input
                  id="printVolumeDepth"
                  type="number"
                  value={printVolumeDepth}
                  onChange={(e) => setPrintVolumeDepth(e.target.value)}
                  placeholder="Depth in mm (e.g., 52)"
                  required
                  className="mt-1 block w-full"
                  min="0"
                  step="0.01"
                />
                {errors.printVolumeDepth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.printVolumeDepth}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="printVolumeHeight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Print Volume Height (mm)
                </label>
                <Input
                  id="printVolumeHeight"
                  type="number"
                  value={printVolumeHeight}
                  onChange={(e) => setPrintVolumeHeight(e.target.value)}
                  placeholder="Height in mm (e.g., 65)"
                  required
                  className="mt-1 block w-full"
                  min="0"
                  step="0.01"
                />
                {errors.printVolumeHeight && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.printVolumeHeight}
                  </p>
                )}
              </div>
            </div>

            {/* Layer Resolution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="layerResolutionMin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Layer Resolution Min (microns)
                </label>
                <Input
                  id="layerResolutionMin"
                  type="number"
                  value={layerResolutionMin}
                  onChange={(e) => setLayerResolutionMin(e.target.value)}
                  placeholder="Min Resolution (e.g., 25)"
                  required
                  className="mt-1 block w-full"
                  min="0"
                  step="0.01"
                />
                {errors.layerResolutionMin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.layerResolutionMin}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="layerResolutionMax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Layer Resolution Max (microns)
                </label>
                <Input
                  id="layerResolutionMax"
                  type="number"
                  value={layerResolutionMax}
                  onChange={(e) => setLayerResolutionMax(e.target.value)}
                  placeholder="Max Resolution (e.g., 63)"
                  required
                  className="mt-1 block w-full"
                  min="0"
                  step="0.01"
                />
                {errors.layerResolutionMax && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.layerResolutionMax}
                  </p>
                )}
              </div>
            </div>

            {/* Print Speed */}
            <div>
              <label
                htmlFor="printSpeedMax"
                className="block text-sm font-medium text-gray-700"
              >
                Print Speed Max (mm/s)
              </label>
              <Input
                id="printSpeedMax"
                type="number"
                value={printSpeedMax}
                onChange={(e) => setPrintSpeedMax(e.target.value)}
                placeholder="Max Print Speed (e.g., 150)"
                required
                className="mt-1 block w-full"
                min="0"
                step="0.01"
              />
              {errors.printSpeedMax && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.printSpeedMax}
                </p>
              )}
            </div>

            {/* Nozzle Diameter */}
            <div>
              <label
                htmlFor="nozzleDiameter"
                className="block text-sm font-medium text-gray-700"
              >
                Nozzle Diameter (mm)
              </label>
              <Input
                id="nozzleDiameter"
                type="number"
                value={nozzleDiameter}
                onChange={(e) => setNozzleDiameter(e.target.value)}
                placeholder="Nozzle Diameter (e.g., 0.2)"
                required
                className="mt-1 block w-full"
                min="0"
                step="0.01"
              />
              {errors.nozzleDiameter && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nozzleDiameter}
                </p>
              )}
            </div>

            {/* Filament Diameter */}
            <div>
              <label
                htmlFor="filamentDiameter"
                className="block text-sm font-medium text-gray-700"
              >
                Filament Diameter (mm)
              </label>
              <Input
                id="filamentDiameter"
                type="number"
                value={filamentDiameter}
                onChange={(e) => setFilamentDiameter(e.target.value)}
                placeholder="Filament Diameter (e.g., 0.12)"
                required
                className="mt-1 block w-full"
                min="0"
                step="0.01"
              />
              {errors.filamentDiameter && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.filamentDiameter}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">
                Update Printer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePrinterPage;
