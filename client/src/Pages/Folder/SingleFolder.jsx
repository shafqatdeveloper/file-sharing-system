import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { MdOutlinePersonOutline, MdPersonOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader from "../../Components/Loaders/Loader";

const SingleFolder = () => {
  const api_Url = import.meta.env.VITE_API_URL;
  const [folder, setFolder] = useState(null);
  const [documentUploader, setDocumentUploader] = useState(true);
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileUploadTrigger, setFileUploadTrigger] = useState(false);
  console.log(folder?.files);
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

  // Fetch LoggedIn User Folders
  useEffect(() => {
    const fetchSingleFolder = async () => {
      try {
        const response = await axios.get(`/api/user/folder/single/${folderId}`);
        setFolder(response.data.folder);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    };
    fetchSingleFolder();
  }, [fileUploadTrigger, folderId]);

  // Fetch loggedIn User
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/api/user/authenticate`, {
          withCredentials: true,
        });
        setLoggedInUserInfo(response.data.loggedInUser);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (uploadingFile) {
      handleFileUpload();
    }
  }, [uploadingFile]);

  const handleFileUpload = async (e) => {
    setUploadLoading(true);
    const form = new FormData();
    form.append("uploadingFile", uploadingFile);
    if (e) e.preventDefault();
    try {
      const response = await axios.post(
        `/api/user/document/upload/${folderId}`,
        form,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast(response.data.message);
        setUploadingFile(null);
        setFileUploadTrigger(!fileUploadTrigger);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadingFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{folder?.folderName}</h1>
            {folder && folder.folderType && (
              <div className="">
                <select
                  name="transaction-type"
                  className="text-xs font-medium text-primaryDark outline-none focus:outline-none uppercase "
                  id=""
                >
                  <option className="font-medium" value="">
                    Select Transaction Type
                  </option>
                  <option className="font-medium" value="Home Care Agent">
                    Home Care Agent
                  </option>
                  <option className="font-medium" value="Real Estate">
                    Real Estate
                  </option>
                  <option className="font-medium" value="Autos Agency">
                    Autos Agency
                  </option>
                  <option className="font-medium" value="Billing Agency">
                    Billing Agency
                  </option>
                  <option className="font-medium" value="Other">
                    Other
                  </option>
                </select>
              </div>
            )}
          </div>
          <div>
            <button className="text-primaryDark hover:underline">
              Activity Log
            </button>
          </div>
        </div>
        <div className="bg-gray-200 p-6 rounded-md flex justify-center items-center">
          <img
            src={`${api_Url}/uploads/${folder?.folderPic}`}
            alt="Folder"
            className="w-full max-w-md"
          />
        </div>
        <div className="mt-6">
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Documents</h2>
              <p className="text-gray-600">
                Anything you add is private until shared.
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark">
              <Link to={"/folder/add"}>+ Add a Folder</Link>
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <h1 className="font-bold font-sans text-lg">Folder</h1>
            <button
              onClick={() => setDocumentUploader(!documentUploader)}
              className="text-primaryDark rounded"
            >
              Add Document
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {uploadLoading ? (
              <div className="flex flex-col gap-2 items-center justify-center">
                <h1 className="text-lg font-bold font-sans">Uploading File</h1>
                <Loader />
              </div>
            ) : (
              <div
                className={
                  documentUploader
                    ? "mt-6 w-full transition-all border-b-[1px] pb-8 duration-300"
                    : "opacity-0 hidden transition-all border-b-[1px] pb-8 duration-300"
                }
              >
                <label
                  htmlFor="file-upload"
                  className="border border-primaryDark flex flex-col gap-1 items-center border-dashed bg-gray-100 py-14 rounded text-center cursor-pointer"
                >
                  <h3 className="text-primaryDark font-bold">BROWSE</h3>
                  <AiOutlineCloudUpload size={25} className="text-gray-500" />
                  <p>
                    Search and add any PDF from your computer into this folder.
                  </p>
                  <input
                    onChange={handleFileChange}
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                  />
                </label>
              </div>
            )}
            <h1 className="mt-4 border-b-[1.5px] text-xl font-semibold font-sans border-b-primaryDark">
              Uploaded File
            </h1>
            {folder && folder.files.length > 0 ? (
              <div className="flex flex-col gap-3">
                {folder.files.map((pdfFile, index) => {
                  const fileName = pdfFile.Name.replace(/\.pdf$/, "");
                  return (
                    <div
                      key={index}
                      className="flex flex-col bg-[#e2fcdf]  rounded-md p-2 gap-1 md:flex-row md:justify-between"
                    >
                      <Link
                        to={`/file/view/${pdfFile._id}`}
                        className="font-bold font-sans text-sm"
                      >
                        {fileName}
                      </Link>
                      <div className="flex items-center gap-0 md:gap-5 justify-between md:justify-normal">
                        <button className="text-primaryDark uppercase text-sm font-semibold">
                          share
                        </button>
                        {pdfFile.shared ? (
                          <span className="text-gray-400 font-semibold">
                            Shared
                          </span>
                        ) : (
                          <span className="text-gray-400 font-semibold">
                            Not Shared
                          </span>
                        )}
                        <button className="relative text-gray-400">
                          <span>
                            <MdOutlinePersonOutline size={25} />
                          </span>
                          <h1 className="absolute text-xs font-bold top-[-3px] right-[1px]">
                            0
                          </h1>
                        </button>
                        <button className="relative text-gray-400">
                          <span>
                            <BsThreeDotsVertical />
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h1 className="text-center font-medium py-5">
                No File Uploaded Yet!
              </h1>
            )}
          </div>

          {/* Add People */}
          <div className="my-5 flex flex-col gap-7">
            <div className="w-full flex sm:items-center sm:justify-between gap-2 sm:flex-row sm:gap-0 flex-col">
              <div>
                <h1 className="text-lg font-bold tracking-wide font-sans">
                  People
                </h1>
                <p className="text-xs w-full sm:w-2/3">
                  Invite your clients, vendors and even those on the other side
                  of the negotiation! No one can see who you invite.
                </p>
              </div>
              <span>
                <button className="w-full sm:inline-flex sm:w-max items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark">
                  Add Person
                </button>
              </span>
            </div>
            <div className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-2 sm:gap-0">
              {/* Name */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-400 w-8 h-8 text-white p-1 flex items-center justify-center rounded-full">
                  <MdPersonOutline />
                </div>
                <h1>Shafqat Rasool</h1>
                <h6>(you)</h6>
              </div>
              {/* Email */}
              <div>
                <h1 className="text-sm text-gray-400">
                  {loggedInUserInfo?.email}
                </h1>
              </div>
              {/* Role */}
              <div>
                <select
                  name="user-role"
                  className="text-xs font-medium text-primaryDark outline-none focus:outline-none uppercase "
                  id=""
                >
                  <option className="font-medium" value="None">
                    None
                  </option>
                  <option className="font-medium" value="Buying Agent">
                    Buying Agent
                  </option>
                  <option className="font-medium" value="Listing Agent">
                    Listing Agent
                  </option>
                  <option className="font-medium" value="Buyer">
                    Buyer
                  </option>
                  <option className="font-medium" value="Seller">
                    Seller
                  </option>
                  <option className="font-medium" value="Admin">
                    Admin
                  </option>
                  <option className="font-medium" value="Apraisel">
                    Apraisel
                  </option>
                  <option className="font-medium" value="Buyer's Attorney">
                    Buyer's Attorney
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFolder;
