# routers/cost_estimation.py
# routers/cost_estimation.py
# routers/cost_estimation.py
'''
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import trimesh

router = APIRouter()

UPLOAD_DIRECTORY = "uploaded_files"

def calculate_cost(volume_cm3: float, material: str, resolution_mm: float, infill_percentage: float) -> float:
    # Latest average material costs per kg in USD
    material_cost_per_kg = {
        "PLA": 25,
        "PETG": 30,
        "ABS": 28,
        "ASA": 35,
        "TPU": 40,
        "Nylon": 45
    }

    # Material densities in g/cm³
    material_density = {
        "PLA": 1.24,
        "PETG": 1.27,
        "ABS": 1.04,
        "ASA": 1.07,
        "TPU": 1.21,
        "Nylon": 1.15
    }

    # Get material cost and density
    cost_per_kg = material_cost_per_kg.get(material, 25)  # Default to $25/kg if material not found
    density_g_per_cm3 = material_density.get(material, 1.24)  # Default to PLA density

    # Calculate material cost
    material_weight_g = volume_cm3 * density_g_per_cm3 * (infill_percentage / 100)
    material_cost = (material_weight_g / 1000) * cost_per_kg

    # Estimate print time (in hours)
    # Assumption: print time increases with volume and inversely with layer height (resolution)
    base_print_speed = 50  # mm/s
    layer_height_mm = resolution_mm
    estimated_print_time_hours = (volume_cm3 * 1000) / (base_print_speed * 3600 * layer_height_mm)

    # Machine cost per hour (includes electricity, depreciation, maintenance)
    machine_cost_per_hour = 5  # USD/hour

    # Labor cost per hour
    labor_cost_per_hour = 15  # USD/hour

    # Total operational cost
    operational_cost = (machine_cost_per_hour + labor_cost_per_hour) * estimated_print_time_hours

    # Overhead cost percentage
    overhead_percentage = 0.2  # 20% overhead

    # Total cost before overhead
    total_cost_before_overhead = material_cost + operational_cost

    # Final cost with overhead
    final_cost = total_cost_before_overhead * (1 + overhead_percentage)

    # Minimum cost to cover small prints
    minimum_cost = 5.0  # USD
    final_cost = max(final_cost, minimum_cost)

    return round(final_cost, 2)

@router.post("/cost-estimate")
async def cost_estimate(payload: dict):
    file_id = payload.get("file_id")
    material = payload.get("material", "PLA")
    color = payload.get("color", "Default")  # Not used in cost calculation but can be stored
    resolution = payload.get("resolution", "0.1")
    infill = payload.get("resistance", "100")  # Assuming 'resistance' is infill percentage

    if not file_id:
        raise HTTPException(status_code=400, detail="file_id is required.")

    # Locate the file
    file_path = None
    for extension in ['.stl', '.obj']:
        potential_path = os.path.join(UPLOAD_DIRECTORY, f"{file_id}{extension}")
        if os.path.exists(potential_path):
            file_path = potential_path
            break

    if not file_path:
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        # Load the mesh from the file
        mesh = trimesh.load(file_path)

        # Get volume in cm³ (trimesh reports volume in mm³ by default)
        volume_mm3 = mesh.volume
        volume_cm3 = volume_mm3 / 1000  # Convert mm³ to cm³

        # Convert resolution to mm if it's in another unit
        resolution_mm = float(resolution)  # Assuming resolution is provided in mm

        # Convert infill percentage
        infill_percentage = float(infill)  # Ensure it's a float

        # Calculate cost
        cost = calculate_cost(volume_cm3, material, resolution_mm, infill_percentage)

        # Optionally, delete the file after processing
        # os.remove(file_path)  # Commented out to retain the file

        return JSONResponse(content={"cost": cost, "currency": "USD"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during cost estimation: {str(e)}")
'''
# routers/cost_estimation.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import trimesh

router = APIRouter()

UPLOAD_DIRECTORY = "uploaded_files"

def calculate_cost(volume_cm3: float, material: str, resolution_mm: float, infill_percentage: float) -> float:
    # Latest average material costs per kg in USD
    material_cost_per_kg = {
        "PLA": 25,
        "PETG": 30,
        "ABS": 28,
        "ASA": 35,
        "TPU": 40,
        "Nylon": 45
    }

    # Material densities in g/cm³
    material_density = {
        "PLA": 1.24,
        "PETG": 1.27,
        "ABS": 1.04,
        "ASA": 1.07,
        "TPU": 1.21,
        "Nylon": 1.15
    }

    # Get material cost and density
    cost_per_kg = material_cost_per_kg.get(material, 25)  # Default to $25/kg if material not found
    density_g_per_cm3 = material_density.get(material, 1.24)  # Default to PLA density

    # Calculate material cost
    material_weight_g = volume_cm3 * density_g_per_cm3 * (infill_percentage / 100)
    material_cost = (material_weight_g / 1000) * cost_per_kg

    # Estimate print time (in hours)
    # Assumption: print time increases with volume and inversely with layer height (resolution)
    base_print_speed = 50  # mm/s
    layer_height_mm = resolution_mm
    estimated_print_time_hours = (volume_cm3 * 1000) / (base_print_speed * 3600 * layer_height_mm)

    # Machine cost per hour (includes electricity, depreciation, maintenance)
    machine_cost_per_hour = 5  # USD/hour

    # Labor cost per hour
    labor_cost_per_hour = 15  # USD/hour

    # Total operational cost
    operational_cost = (machine_cost_per_hour + labor_cost_per_hour) * estimated_print_time_hours

    # Overhead cost percentage
    overhead_percentage = 0.2  # 20% overhead

    # Total cost before overhead
    total_cost_before_overhead = material_cost + operational_cost

    # Final cost with overhead
    final_cost = total_cost_before_overhead * (1 + overhead_percentage)

    # Minimum cost to cover small prints
    minimum_cost = 5.0  # USD
    final_cost = max(final_cost, minimum_cost)

    return round(final_cost, 2)

@router.post("/cost-estimate")
async def cost_estimate(payload: dict):
    file_id = payload.get("file_id")
    material = payload.get("material", "PLA")
    color = payload.get("color", "Default")  # Not used in cost calculation but can be stored
    resolution = payload.get("resolution", "0.1")
    infill = payload.get("resistance", "100")  # Assuming 'resistance' is infill percentage

    if not file_id:
        raise HTTPException(status_code=400, detail="file_id is required.")

    # Locate the file
    file_path = None
    for extension in ['.stl', '.obj']:
        potential_path = os.path.join(UPLOAD_DIRECTORY, f"{file_id}{extension}")
        if os.path.exists(potential_path):
            file_path = potential_path
            break

    if not file_path:
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        # Load the mesh from the file
        mesh = trimesh.load(file_path)

        # Get volume in cm³ (trimesh reports volume in mm³ by default)
        volume_mm3 = mesh.volume
        volume_cm3 = volume_mm3 / 1000  # Convert mm³ to cm³

        # Convert resolution to mm if it's in another unit
        resolution_mm = float(resolution)  # Assuming resolution is provided in mm

        # Convert infill percentage
        infill_percentage = float(infill)  # Ensure it's a float

        # Calculate cost
        cost = calculate_cost(volume_cm3, material, resolution_mm, infill_percentage)

        # Optionally, delete the file after processing
        # os.remove(file_path)  # Commented out to retain the file

        return JSONResponse(content={"cost": cost, "currency": "USD"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during cost estimation: {str(e)}")
