# routers/upload.py
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import trimesh
import io
from utils.cost_calculator import calculate_cost  # Ensure this path is correct

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    material: str = Form("PLA"),       # Default material
    color: str = Form("White"),        # Default color
    resolution: float = Form(0.1),     # Default resolution
    resistance: int = Form(50)         # Default resistance
):
    # Validate file extension
    if not (file.filename.endswith('.obj') or file.filename.endswith('.stl')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .obj and .stl files are supported.")

    # Validate material
    allowed_materials = {"PLA", "PETG", "ABS", "ASA", "TPU", "Nylon"}
    if material not in allowed_materials:
        raise HTTPException(status_code=400, detail=f"Invalid material. Choose from {', '.join(allowed_materials)}.")

    # Validate resolution
    if resolution <= 0:
        raise HTTPException(status_code=400, detail="Resolution must be a positive number.")

    # Validate resistance
    if not (0 <= resistance <= 100):
        raise HTTPException(status_code=400, detail="Resistance must be an integer between 0 and 100.")

    try:
        contents = await file.read()
        mesh = trimesh.load(io.BytesIO(contents), file_type=file.filename.split('.')[-1])

        if not isinstance(mesh, trimesh.Trimesh):
            raise ValueError("Invalid mesh data")

        surface_area = mesh.area
        volume = mesh.volume

        cost = calculate_cost(surface_area, volume, material, resolution, resistance)

        return JSONResponse(content={"cost": cost})
    except trimesh.exceptions.TrimeshError:
        raise HTTPException(status_code=400, detail="Failed to parse the 3D model. Ensure it's a valid .obj or .stl file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
