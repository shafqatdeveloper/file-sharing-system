import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import Loader from "../../Components/Loaders/Loader";
import axios from "axios";

const AddCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [companyName, setCompanyName] = useState("");
  const [companyPic, setCompanyPic] = useState(null);
  const [companyType, setCompanyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [customCompanyType, setCustomCompanyType] = useState("");

  const handleCompanyTypeChange = (e) => {
    setCompanyType(e.target.value);
    if (e.target.value !== "Other") {
      setCustomCompanyType("");
    }
  };

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("companyName", companyName);
    form.append("companyPic", companyPic);
    form.append(
      "companyType",
      companyType === "Other" ? customCompanyType : companyType
    );
    try {
      const response = await axios.post("/api/company/add/new", form);
      if (response.data.success) {
        navigate("/home?user=authenticated");
        toast(response.data.message);
        setCompanyName("");
        setCompanyType("");
        setCompanyPic(null);
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

  const handleCustomCompanyType = (e) => {
    setCustomCompanyType(e.target.value);
  };

  return (
    <div className="h-max  bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white cursor-pointer relative p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-md">
        <Link to={"/home?user=authenticated"}>
          <AiOutlineArrowLeft
            size={24}
            className="absolute left-4 top-[3.2rem]"
          />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Add Company
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#67C22A] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="companyPic"
              className="block text-sm font-medium text-gray-700"
            >
              Company Picture
            </label>
            <input
              type="file"
              id="companyPic"
              required
              accept="image/*"
              onChange={(e) => setCompanyPic(e.target.files[0])}
              className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#67C22A] focus:border-transparent"
            />
          </div>
          {companyPic && (
            <div className="w-full h-28">
              <img
                src={URL.createObjectURL(companyPic)}
                alt="Company Picture"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="companyType"
              className="block text-sm font-medium text-gray-700"
            >
              Company Type
            </label>
            <select
              id="companyType"
              value={companyType}
              onChange={handleCompanyTypeChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#67C22A] focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Dealership">Dealership</option>
              <option value="Homecare">Homecare</option>
              <option value="Billing Service">Billing Service</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
            {companyType === "Other" && (
              <div className="mt-4">
                <label
                  htmlFor="customCompanyType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Please specify other company Type
                </label>
                <input
                  id="customCompanyType"
                  type="text"
                  value={customCompanyType}
                  onChange={handleCustomCompanyType}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#67C22A] focus:border-transparent"
                  required
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center h-10 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#67C22A] hover:bg-[#57a21f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#67C22A]"
          >
            {loading ? (
              <Loader />
            ) : (
              <span className="flex items-center gap-2">
                <AiOutlinePlus /> Add Company
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
