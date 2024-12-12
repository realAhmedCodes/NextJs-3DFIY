import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";

const printerMaterials = {
  FDM: ["PLA", "ABS", "PETG", "TPU", "Nylon"],
  SLA: ["Standard Resin", "Tough Resin", "Flexible Resin", "Castable Resin"],
  SLS: ["Nylon", "TPU", "Glass-Filled Nylon", "Alumide"],
  DLP: ["Standard Resin", "Tough Resin", "Flexible Resin"],
};

export function MaterialsAndColors({ onNext, data }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      materials: data.materials || [],
      colors: data.colors || [""],
      printerType: data.printerType,
    },
  });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const printerType = watch("printerType");
  const availableMaterials = printerMaterials[printerType] || [];

  const handleMaterialChange = (material: string, checked: boolean) => {
    const currentMaterials = watch("materials");
    
    if (checked) {
      // If checked, add to materials array
      setValue("materials", [...currentMaterials, material]);
    } else {
      // If unchecked, remove from materials array
      setValue("materials", currentMaterials.filter(m => m !== material));
    }
  };

  return (
    <form
      id="form-step-2"
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label>Materials</Label>
        <div className="grid grid-cols-2 gap-4">
          {availableMaterials.map((material) => (
            <label key={material} className="flex items-center space-x-2">
              <Checkbox
                checked={watch("materials").includes(material)}
                onCheckedChange={(checked) => handleMaterialChange(material, checked)}
              />
              <span>{material}</span>
            </label>
          ))}
        </div>
        {errors.materials && (
          <p className="text-sm text-destructive">{errors.materials.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Colors</Label>
        {colorFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Input
              {...register(`colors.${index}`, {
                required: "Color is required",
              })}
              placeholder={`Color ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeColor(index)}
              disabled={colorFields.length === 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendColor("")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>
    </form>
  );
}