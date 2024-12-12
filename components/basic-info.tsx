import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const printerTypes = {
  FDM: "Fused Deposition Modeling",
  SLA: "Stereolithography",
  SLS: "Selective Laser Sintering",
  DLP: "Digital Light Processing",
};

export function BasicInfo({ onNext, data }) {
  const {
    register,
    handleSubmit,
    setValue, // Use setValue to manually set the select value
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });

  // Handle select value manually
  const handleSelectChange = (value) => {
    setValue("printerType", value); // Set the selected value to printerType
  };

  return (
    <form
      id="form-step-0"
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Printer Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Printer name is required" })}
          placeholder="Enter printer name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register("description", { required: "Description is required" })}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location", { required: "Location is required" })}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="printerType">Printer Type</Label>
        <Select
          onValueChange={handleSelectChange} // Trigger manual change handler
        >
          <SelectTrigger>
            <SelectValue placeholder="Select printer type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(printerTypes).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.printerType && (
          <p className="text-sm text-destructive">
            {errors.printerType.message}
          </p>
        )}
      </div>
    </form>
  );
}
