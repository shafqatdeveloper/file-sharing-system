import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { CiFilter, CiSearch } from "react-icons/ci";
import { BsSortDown } from "react-icons/bs";
import { HiFolderAdd } from "react-icons/hi";
import { toast } from "react-toastify";

const AuthHome = () => {
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
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center">
          <div className="text-2xl font-bold">Default Profile</div>
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primaryDark">
              <Link to={"/folder/add"}>+ Add a Folder</Link>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto py-6">
        <div className=" shadow rounded-lg py-6 flex flex-col items-center px-5">
          <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative border border-gray-300 bg-white rounded-md w-full md:w-2/5 mb-4 md:mb-0 flex items-center">
              <CiSearch size={21} className="w-10 bg-transparent " />
              <input
                type="text"
                placeholder="Search by address, title, etc."
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
          <div className="text-center">
            <div className="text-gray-500 flex flex-col items-center gap-2">
              <HiFolderAdd size={50} />
              <div>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Let's get started
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Folders are online workspaces to manage your transactions. Use
                  them to share documents and track your progress.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark">
                <Link to={"/folder/add"}>+ Add a Folder</Link>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthHome;
