import React from "react";
import { Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "#67C22A",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#67C22A",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#999",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: "#999",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#67C22A",
  },
}));

const FolderName = ({ value, onChange }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <CustomTextField
        label="Property Address or MLS#"
        variant="outlined"
        fullWidth
        required
        helperText="Put in your client's name for now. you can always change it later."
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default FolderName;
