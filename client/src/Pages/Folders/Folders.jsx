import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { CiFilter, CiSearch } from "react-icons/ci";
import { BsSortDown } from "react-icons/bs";
import { HiFolderAdd } from "react-icons/hi";
import { toast } from "react-toastify";
import axios from "axios";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Folders = () => {
  const api_Url = import.meta.env.VITE_API_URL;
  const [userFolders, setUserFolders] = useState(null);
  console.log("USers Folders", userFolders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  console.log("Company Id", companyId);
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch Folders of Current Company

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`/api/company/folders/${companyId}`, {
          withCredentials: true,
        });
        setUserFolders(response.data.folders);
      } catch (error) {
        toast(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    };
    fetchFolders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center">
          <div className="text-2xl font-bold">My Folders</div>
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primaryDark">
              <Link to={`/folder/add/${companyId}`}>+ Add a Folder</Link>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow h-full w-full mx-auto py-6">
        <div className="shadow w-full h-full rounded-lg py-6 flex flex-col items-center px-5">
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
          {userFolders && userFolders.length > 0 ? (
            <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ">
              {userFolders.map((folder, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white w-full shadow-lg shadow-black/10 rounded-lg overflow-hidden mb-5"
                  >
                    <div className="w-full h-36">
                      <Link
                        className="w-full h-full"
                        to={`/folder/view/${folder._id}`}
                      >
                        <img
                          src={`${api_Url}/uploads/${folder.folderPic}`}
                          alt="Folder Pic"
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <Link
                        to={`/folder/view/${folder._id}`}
                        className="font-bold text-lg"
                      >
                        {folder.folderName}
                      </Link>
                      <div className="text-gray-600 flex items-center gap-2">
                        <strong>Type: </strong>
                        <span className="text-primaryDark flex items-center gap-1 cursor-pointer">
                          None <MdOutlineKeyboardArrowDown size={23} />
                        </span>
                      </div>
                      <div className="text-gray-600">
                        <strong>Created:</strong>{" "}
                        {String(folder.createdAt).substring(0, 10)}{" "}
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
                    Folders are online workspaces to manage your transactions.
                    Use them to share documents and track your progress.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark">
                  <Link to={`/folder/add/${companyId}`}>+ Add a Folder</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Folders;
