import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TechnicalSpecs({ onNext, data }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data
  })

  return (
    <form id="form-step-1" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="printVolumeWidth">Print Volume Width (mm)</Label>
          <Input id="printVolumeWidth" type="number" {...register('printVolumeWidth', { required: 'Width is required', min: 0 })} placeholder="e.g., 200" />
          {errors.printVolumeWidth && <p className="text-sm text-destructive">{errors.printVolumeWidth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="printVolumeDepth">Print Volume Depth (mm)</Label>
          <Input id="printVolumeDepth" type="number" {...register('printVolumeDepth', { required: 'Depth is required', min: 0 })} placeholder="e.g., 200" />
          {errors.printVolumeDepth && <p className="text-sm text-destructive">{errors.printVolumeDepth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="printVolumeHeight">Print Volume Height (mm)</Label>
          <Input id="printVolumeHeight" type="number" {...register('printVolumeHeight', { required: 'Height is required', min: 0 })} placeholder="e.g., 200" />
          {errors.printVolumeHeight && <p className="text-sm text-destructive">{errors.printVolumeHeight.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="layerResolutionMin">Layer Resolution Min (microns)</Label>
          <Input id="layerResolutionMin" type="number" {...register('layerResolutionMin', { required: 'Min resolution is required', min: 0 })} placeholder="e.g., 50" />
          {errors.layerResolutionMin && <p className="text-sm text-destructive">{errors.layerResolutionMin.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="layerResolutionMax">Layer Resolution Max (microns)</Label>
          <Input id="layerResolutionMax" type="number" {...register('layerResolutionMax', { required: 'Max resolution is required', min: 0 })} placeholder="e.g., 300" />
          {errors.layerResolutionMax && <p className="text-sm text-destructive">{errors.layerResolutionMax.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="printSpeedMax">Print Speed Max (mm/s)</Label>
        <Input id="printSpeedMax" type="number" {...register('printSpeedMax', { required: 'Max print speed is required', min: 0 })} placeholder="e.g., 150" />
        {errors.printSpeedMax && <p className="text-sm text-destructive">{errors.printSpeedMax.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="nozzleDiameter">Nozzle Diameter (mm)</Label>
        <Input id="nozzleDiameter" type="number" {...register('nozzleDiameter', { required: 'Nozzle diameter is required', min: 0 })} placeholder="e.g., 0.4" step="0.1" />
        {errors.nozzleDiameter && <p className="text-sm text-destructive">{errors.nozzleDiameter.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="filamentDiameter">Filament Diameter (mm)</Label>
        <Input id="filamentDiameter" type="number" {...register('filamentDiameter', { required: 'Filament diameter is required', min: 0 })} placeholder="e.g., 1.75" step="0.01" />
        {errors.filamentDiameter && <p className="text-sm text-destructive">{errors.filamentDiameter.message}</p>}
      </div>
    </form>
  )
}

