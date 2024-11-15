// components/ui/dropzone.js
import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

const Dropzone = ({ onFileUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    accept: {
      "application/octet-stream": [".stl", ".obj"],
    },
    maxSize: 32 * 1024 * 1024, // 32 MB
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-sm text-blue-500">Drop the files here...</p>
        ) : (
          <p className="text-sm text-gray-500">
            Drag & drop a file here, or click to select a file
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
