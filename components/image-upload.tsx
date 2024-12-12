import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ImageUpload({ onSubmit, data }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data
  })

  return (
    <form id="form-step-4" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Printer Image</Label>
        <Input id="image" type="file" {...register('image', { required: 'Image is required' })} accept="image/*" />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message as string}</p>}
      </div>
    </form>
  )
}

