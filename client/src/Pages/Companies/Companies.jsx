import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { CiFilter, CiSearch } from "react-icons/ci";
import { BsSortDown } from "react-icons/bs";
import { HiFolderAdd } from "react-icons/hi";
import { toast } from "react-toastify";
import axios from "axios";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Companies = () => {
  const api_Url = import.meta.env.VITE_API_URL;
  const [userCompanies, setUserCompanies] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch Companies of LoggedIn User

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/user/companies", {
          withCredentials: true,
        });
        setUserCompanies(response.data.companies);
      } catch (error) {
        toast(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center">
          <div className="text-2xl font-bold">Default Profile</div>
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primaryDark">
              <Link to={"/company/add"}>+ Add a Company</Link>
            </button>
          </div>
        </div>
      </header>
      <div>
        <h1 className="text-2xl font-bold font-sans text-center pt-3 w-max border-b-2 border-b-black tracking-wide">
          My Companies
        </h1>
      </div>
      <main className="flex-grow h-full w-full mx-auto py-6">
        <div className="shadow w-full h-full rounded-lg py-6 flex flex-col items-center px-5">
          <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative border border-gray-300 bg-white rounded-md w-full md:w-2/5 mb-4 md:mb-0 flex items-center">
              <CiSearch size={21} className="w-10 bg-transparent " />
              <input
                type="text"
                placeholder="Search by address, name, etc."
                className="w-full p-2 bg-transparent rounded-md outline-none focus:outline-none"
              />
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded flex items-center">
                <CiFilter className="mr-1" /> Filters (off)
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded flex items-center">
                <BsSortDown className="mr-1" /> Sort: Creation date
              </button>
            </div>
          </div>
          {userCompanies && userCompanies.length > 0 ? (
            <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ">
              {userCompanies.map((company, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white w-full shadow-lg shadow-black/10 rounded-lg overflow-hidden mb-5"
                  >
                    <div className="w-full h-36">
                      <Link
                        className="w-full h-full"
                        to={`/company/folders/${company._id}`}
                      >
                        <img
                          src={`${api_Url}/uploads/${company.companyPic}`}
                          alt="company Pic"
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <Link
                        to={`/company/view/${company._id}`}
                        className="font-bold text-lg"
                      >
                        {company.companyName}
                      </Link>
                      <div className="text-gray-600 flex items-center gap-2">
                        <strong>Type: </strong>
                        <span className="text-primaryDark flex items-center gap-1 cursor-pointer">
                          None <MdOutlineKeyboardArrowDown size={23} />
                        </span>
                      </div>
                      <div className="text-gray-600">
                        <strong>Created:</strong>{" "}
                        {String(company.createdAt).substring(0, 10)}{" "}
                        {/* {new Date(folder.createdAt).toLocaleTimeString()} */}
                      </div>
                      <div className="mt-2">
                        <button className="text-primaryDark hover:underline">
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-500 flex flex-col items-center gap-2">
                <HiFolderAdd size={50} />
                <div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Let's get started
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Companies are different locations of Offices to manage your
                    transactions. Use them to add folders and track your
                    progress.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark">
                  <Link to={"/company/add"}>+ Add a Company</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Companies;
