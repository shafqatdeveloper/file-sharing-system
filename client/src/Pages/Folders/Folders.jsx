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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
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
  useEffect(() => {
    fetchFolders();
  }, []);

  // Update Folder Type

  const handleUpdateFolderType = async (e, folderId) => {
    const updatedFolderType = e.target.value;
    try {
      const response = await axios.put(`/api/folder/type/update/${folderId}`, {
        updatedFolderType,
      });
      if (response.data.success) {
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      fetchFolders();
    }
  };
  // Archive Folder

  const handleArchiveFolder = async (e, folderId) => {
    try {
      const response = await axios.put(`/api/folder/archive/${folderId}`);
      if (response.data.success) {
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      fetchFolders();
    }
  };

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
                    className="bg-white relative w-full shadow-lg shadow-black/10 rounded-lg overflow-hidden mb-5"
                  >
                    {folder.archived && (
                      <div className="absolute top-0 left-0 bg-black/70 text-white py-1 px-2 rounded-br-lg">
                        <h1>Archived</h1>
                      </div>
                    )}
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
                        <div className="text-gray-600 flex items-center gap-2">
                          <select
                            className="text-primaryDark font-medium outline-none focus:outline-none"
                            name="companyType"
                            onChange={(e) =>
                              handleUpdateFolderType(e, folder._id)
                            }
                            id="companyType"
                          >
                            <option value={folder.folderType}>
                              {folder.folderType}
                            </option>
                            <option
                              className={
                                folder.folderType === "Dealership" && "hidden"
                              }
                              value="Dealership"
                            >
                              Dealership
                            </option>
                            <option
                              className={
                                folder.folderType === "Homecare" && "hidden"
                              }
                              value="Homecare"
                            >
                              Homecare
                            </option>
                            <option
                              className={
                                folder.folderType === "Billing Service" &&
                                "hidden"
                              }
                              value="Billing Service"
                            >
                              Billing Service
                            </option>
                            <option
                              className={
                                folder.folderType === "Real Estate" && "hidden"
                              }
                              value="Real Estate"
                            >
                              Real Estate
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        <strong>Created:</strong>{" "}
                        {String(folder.createdAt).substring(0, 10)}{" "}
                        {/* {new Date(folder.createdAt).toLocaleTimeString()} */}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={(e) => handleArchiveFolder(e, folder._id)}
                          className="text-primaryDark hover:underline"
                        >
                          {folder.archived ? "Unarchive" : "Archive"}
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
