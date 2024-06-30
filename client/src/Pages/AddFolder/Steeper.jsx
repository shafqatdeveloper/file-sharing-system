import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { styled } from "@mui/material/styles";
import FolderName from "./FolderName";
import FolderPhoto from "./FolderPhoto";
import FinishFolderCreation from "./FinishFolderCreation";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import ButtonLoader from "../../Components/Loaders/ButtonLoader";

const steps = ["Folder Name", "Photo", "Finish"];

const CustomStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-root .Mui-completed": {
    color: "#67C22A",
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "#67C22A",
  },
  "& .MuiStepConnector-line": {
    borderColor: "#67C22A",
  },
}));

const StepperPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [folderName, setFolderName] = useState("");
  const [folderData, setFolderData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const validationErrors = validateStep(activeStep);
    if (Object.keys(validationErrors).length === 0) {
      if (activeStep === steps.length - 2) {
        await submitData();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    const validationErrors = {};
    if (step === 0 && !folderName.trim()) {
      validationErrors.folderName = "Folder name is required";
      toast.error("Folder name is required");
    } else if (step === 1 && !photo) {
      validationErrors.photo = "Photo is required";
      toast.error("Photo is required");
    }
    return validationErrors;
  };

  const submitData = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("folderName", folderName);
    form.append("folderPic", photo);
    try {
      const response = await axios.post("/api/folder/add", form);
      if (response.data.success) {
        setFolderData(response.data.createdFolder);
        toast(response.data.message);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FolderName
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              setErrors((prev) => ({ ...prev, folderName: "" }));
            }}
            error={errors.folderName}
          />
        );
      case 1:
        return (
          <FolderPhoto
            value={photo}
            onChange={(e) => {
              setPhoto(e.target.files[0]);
              setErrors((prev) => ({ ...prev, photo: "" }));
            }}
            error={errors.photo}
          />
        );
      case 2:
        return <FinishFolderCreation folderData={folderData} />;
      default:
        return "Unknown step";
    }
  };

  const resetForm = () => {
    setFolderName("");
    setPhoto(null);
    setFolderData(null);
    setErrors({});
    setActiveStep(0);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please Login to access this page");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full sm:w-2/3 px-3">
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            bgcolor: "background.default",
            py: 4,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Add a new Folder
          </Typography>
          <CustomStepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </CustomStepper>
          <Box sx={{ mt: 3 }}>
            {getStepContent(activeStep)}
            <Box className="flex flex-col mt-5 sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0">
              {activeStep === steps.length - 1 ? (
                <Link
                  className="underline text-primaryDark w-full sm:w-auto text-center"
                  to={"/folders"}
                >
                  Back to my Folders
                </Link>
              ) : (
                <Button
                  sx={{
                    color: "#67C22A",
                    "&:hover": { color: "darkgreen" },
                  }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
              )}
              <Box className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-2">
                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={resetForm}
                    sx={{
                      color: "white",
                      backgroundColor: "#67C22A",
                      borderRadius: "9999px",
                      "&:hover": { backgroundColor: "darkgreen" },
                    }}
                    className="w-full sm:w-auto"
                  >
                    Create another Folder
                  </Button>
                ) : (
                  <Button
                    sx={{
                      color: "#67C22A",
                      "&:hover": { color: "darkgreen" },
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Link to={"/folders"}>Cancel</Link>
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Link
                    className="text-white bg-primaryDark rounded-full p-2 w-full sm:w-auto text-center"
                    to={`/folder/my/view/${folderData._id}`}
                  >
                    View Folder
                  </Link>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#67C22A",
                      color: "white",
                      "&:hover": { backgroundColor: "darkgreen" },
                    }}
                    onClick={handleNext}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <ButtonLoader />
                    ) : activeStep === steps.length - 2 ? (
                      "Create"
                    ) : (
                      "Continue"
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default StepperPage;
