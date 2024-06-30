import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Box, Typography } from "@mui/material";

const FolderPhoto = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onChange({ target: { files: event.dataTransfer.files } });
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        width: "100%",
        height: "250px",
        bgcolor: isDragging ? "#e0e0e0" : "#f5f5f5",
        cursor: "pointer",
        textAlign: "center",
        transition: "background-color 0.3s",
      }}
      component="label"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" hidden accept="image/*" onChange={onChange} />
      {!value && (
        <>
          <AiOutlineCloudUpload size={30} className="text-primaryDark" />
          <Typography variant="body1" sx={{ color: "#999" }}>
            Upload a photo
          </Typography>
        </>
      )}
      {value && (
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="body2">{value.name}</Typography>
          {preview && (
            <Box
              component="img"
              sx={{
                maxHeight: "50%",
                maxWidth: "50%",
                mt: 2,
                objectFit: "contain",
              }}
              alt="Preview"
              src={preview}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default FolderPhoto;
