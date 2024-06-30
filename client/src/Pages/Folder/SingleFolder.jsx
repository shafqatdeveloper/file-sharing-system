import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { toast } from "react-toastify";

const SingleFolder = () => {
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
  const { folderId } = useParams();
  return <div>{folderId}</div>;
};

export default SingleFolder;
