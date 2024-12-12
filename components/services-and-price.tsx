import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from 'lucide-react'

export function ServicesAndPrice({ onNext, data }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      services: data.services || [''],
      price: data.price || '',
    }
  })

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: "services",
  })

  return (
    <form id="form-step-3" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <Label>Services</Label>
        {serviceFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Input {...register(`services.${index}`, { required: 'Service is required' })} placeholder={`Service ${index + 1}`} />
            <Button type="button" variant="outline" size="icon" onClick={() => removeService(index)} disabled={serviceFields.length === 1}>
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendService('')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price (per hour)</Label>
        <Input id="price" type="number" {...register('price', { required: 'Price is required', min: 0 })} placeholder="e.g., 50" step="0.01" />
        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
      </div>
    </form>
  )
}

