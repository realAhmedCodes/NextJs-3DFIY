# routers/file_upload.py
'''
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uuid
import os

router = APIRouter()

UPLOAD_DIRECTORY = "uploaded_files"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    if not (file.filename.endswith('.obj') or file.filename.endswith('.stl')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .stl and .obj files are supported.")

    try:
        contents = await file.read()
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIRECTORY, f"{file_id}{file_extension}")

        with open(file_path, "wb") as f:
            f.write(contents)

        return JSONResponse(content={"file_id": file_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''
# routers/file_upload.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uuid
import os

router = APIRouter()

UPLOAD_DIRECTORY = "uploaded_files"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    if not (file.filename.endswith('.obj') or file.filename.endswith('.stl')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .stl and .obj files are supported.")

    try:
        contents = await file.read()
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIRECTORY, f"{file_id}{file_extension}")

        with open(file_path, "wb") as f:
            f.write(contents)

        return JSONResponse(content={"file_id": file_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
