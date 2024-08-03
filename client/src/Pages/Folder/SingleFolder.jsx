import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import { TiDocumentText } from "react-icons/ti";
import axios from "axios";
import {
  MdDeleteOutline,
  MdOutlinePersonOutline,
  MdPersonOutline,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader from "../../Components/Loaders/Loader";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import "./SingleFolder.css";
import BrowseTemplate from "../../Components/BrowseTemplate";

Modal.setAppElement("#root");

const SingleFolder = () => {
  const api_Url = import.meta.env.VITE_API_URL;
  const [folder, setFolder] = useState(null);
  const [documentUploader, setDocumentUploader] = useState(true);
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileUploadTrigger, setFileUploadTrigger] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [teamMemberEmail, setTeamMemberEmail] = useState("");
  const [shareOptions, setShareOptions] = useState({
    shareLink: true,
    shareFile: true,
    editable: false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [shareLoading, setShareLoading] = useState(false);
  const [singleShareLoading, setSingleShareLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [selectedFileToShare, setSelectedFileToShare] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(
    loggedInUserInfo?.teams[0]?.teamName
  );
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleTeamExpansion = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };
  console.log("Selected Team ID", selectedTeamId);
  // Select a Single File
  const handleSelectFile = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  // Set Selected Team ID
  useEffect(() => {
    // Update selectedTeamId if loggedInUserInfo or teams change
    if (loggedInUserInfo?.teams?.length > 0) {
      setSelectedTeamId(loggedInUserInfo.teams[0]._id);
    }
  }, [loggedInUserInfo]);

  // Select all FIles
  const handleSelectAll = () => {
    const allFileIds = folder.files.map((file) => file._id);
    setSelectedFiles((prevSelected) =>
      prevSelected.length === allFileIds.length ? [] : allFileIds
    );
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

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
  useEffect(() => {
    fetchSingleFolder();
    if (shared) {
      setShared(false);
    }
  }, [fileUploadTrigger, folderId, shared]);

  console.log("Logged In User", loggedInUserInfo);
  // Fetch loggedIn User
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
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (uploadingFile) {
      handleFileUpload();
    }
  }, [uploadingFile]);

  // File Upload
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

  // File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadingFile(file);
  };

  // Open Share Modal
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  // Open Add Member Modal
  const openAddMemberModal = () => {
    setAddMemberModalOpen(true);
  };

  // Close Share Modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareEmail("");
    setShareOptions({ shareLink: false, shareFile: true, editable: false });
  };

  // Close Add Member Modal

  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  // Handle Share
  const handleFileShare = async (e) => {
    e.preventDefault();
    closeShareModal();
    if (selectedFiles.length > 0) {
      setShareLoading(true);
      try {
        const response = await axios.post(`/api/file/share/multiple`, {
          sharingFiles: selectedFiles,
          email: shareEmail,
          shareSetting: shareOptions,
          folderId,
        });
        if (response.data.success) {
          toast(response.data.message);
          setShared(true);
          setSelectedFiles([]);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setShareLoading(false);
      }
    } else {
      setSingleShareLoading(true);
      try {
        const response = await axios.post(`/api/file/share/single`, {
          sharingFile: selectedFileToShare,
          email: shareEmail,
          shareSetting: shareOptions,
          folderId,
        });
        if (response.data.success) {
          toast(response.data.message);
          setShared(true);
          setSelectedFileToShare(null);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setSingleShareLoading(false);
      }
    }
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadingFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

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
      fetchSingleFolder();
    }
  };

  console.log("Current Location", location.pathname);
  // Update User Role

  const updateUserRoleHandler = async (e, userId) => {
    e.preventDefault();
    const updatedUserRole = e.target.value;
    try {
      const response = await axios.put(`/api/user/role/update/${userId}`, {
        updatedUserRole,
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
      fetchSingleFolder();
      fetchUserInfo();
    }
  };

  // Add Member to The TEAM
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/member/add-to-team/${selectedTeamId}`,
        {
          teamMemberEmail,
        }
      );
      if (response.data.success) {
        toast(response.data.message);
        closeAddMemberModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
    }
    fetchUserInfo();
  };

  // Delete Member from the TEAM

  const handleDeleteMember = async (teamId, memberId) => {
    const confirmRemoveMember = confirm("Are you sure to remove this member?");
    if (confirmRemoveMember) {
      try {
        const response = await axios.put(
          `/api/member/remove-from-team/${memberId}`,
          {
            teamId,
          }
        );
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
        fetchUserInfo();
      }
    }
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
                  className="text-primaryDark font-medium outline-none focus:outline-none"
                  name="companyType"
                  onChange={(e) => handleUpdateFolderType(e, folder._id)}
                  id="companyType"
                >
                  <option value={folder.folderType}>{folder.folderType}</option>
                  <option
                    className={folder.folderType === "Dealership" && "hidden"}
                    value="Dealership"
                  >
                    Dealership
                  </option>
                  <option
                    className={folder.folderType === "Homecare" && "hidden"}
                    value="Homecare"
                  >
                    Homecare
                  </option>
                  <option
                    className={
                      folder.folderType === "Billing Service" && "hidden"
                    }
                    value="Billing Service"
                  >
                    Billing Service
                  </option>
                  <option
                    className={folder.folderType === "Real Estate" && "hidden"}
                    value="Real Estate"
                  >
                    Real Estate
                  </option>
                  <option value="Other">Other</option>
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
              <Link to={`/folder/add/${folder?.parentCompany}`}>
                + Add a Folder
              </Link>
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
              <div className="grid grid-cols-1  sm:grid-cols-2 gap-2">
                <div
                  className={
                    documentUploader
                      ? " w-full transition-all  duration-300"
                      : "opacity-0 hidden transition-all border-b-[1px] pb-8 duration-300"
                  }
                >
                  <BrowseTemplate folderId={folderId} />
                </div>
                <div
                  className={
                    documentUploader
                      ? " w-full transition-all  duration-300"
                      : "opacity-0 hidden transition-all border-b-[1px] pb-8 duration-300"
                  }
                >
                  <div
                    {...getRootProps()}
                    className="border border-primaryDark h-64 flex flex-col gap-1 items-center border-dashed bg-green-100 py-14 rounded text-center cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <TiDocumentText className="text-primaryDark text-5xl" />
                    <h2 className="text-primaryDark text-lg font-semibold">
                      Browse
                    </h2>
                    <p className="text-sm w-2/3 pt-3 text-gray-500">
                      Drag and drop any PDF from your computer into this folder
                      or click to browse.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h1 className="mt-4 border-b-[1.5px] text-xl font-semibold font-sans border-b-primaryDark">
              Uploaded File
            </h1>
            <div>
              <div className="flex justify-end mb-3">
                <div className="flex items-center gap-3">
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={() => openShareModal()}
                      disabled={shareLoading ? true : false}
                      className={`${
                        shareLoading
                          ? "bg-transparent border-2 border-primaryDark"
                          : "bg-primaryDark text-white"
                      }  w-20 h-10 rounded-md  uppercase text-sm font-semibold`}
                    >
                      {shareLoading ? <Loader /> : "Share"}
                    </button>
                  )}
                  <button
                    onClick={handleSelectAll}
                    className="text-primaryDark uppercase text-sm font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedFiles.length === folder?.files?.length &&
                        selectedFiles.length > 0
                          ? true
                          : false
                      }
                      className="self-start w-8 cursor-pointer h-8 rounded-md"
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {folder &&
                  folder.files &&
                  folder.files.length > 0 &&
                  folder.files.map((pdfFile, index) => {
                    const fileName = pdfFile.Name.replace(/\.pdf$/, "");
                    const isSelected = selectedFiles.includes(pdfFile._id);
                    return (
                      <div
                        key={index}
                        className={`flex flex-col bg-white shadow-md shadow-black/20 p-2 gap-1 border-2 ${
                          isSelected
                            ? "border-primaryDark"
                            : "border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectFile(pdfFile._id)}
                          className="self-start w-4 h-4"
                        />
                        <Link
                          to={`/file/view/${pdfFile._id}`}
                          state={{ from: location.pathname }}
                          className="font-bold font-sans text-sm text-center py-1"
                        >
                          {fileName}
                        </Link>
                        <div className="flex items-center gap-2 justify-between mt-2">
                          <button
                            onClick={() => {
                              openShareModal();
                              setSelectedFileToShare(pdfFile._id);
                            }}
                            className={`${
                              singleShareLoading
                                ? "bg-transparent border-2 border-primaryDark"
                                : "bg-primaryDark text-white"
                            }  w-14 h-9 rounded-md  uppercase text-sm font-semibold`}
                          >
                            {singleShareLoading &&
                            pdfFile._id === selectedFileToShare ? (
                              <Loader />
                            ) : (
                              "Share"
                            )}
                          </button>
                          {pdfFile.shared ? (
                            <span className="text-gray-400 text-xs font-semibold">
                              Shared
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs font-semibold">
                              Not Shared
                            </span>
                          )}
                          <button className="relative text-gray-400">
                            <span>
                              <MdOutlinePersonOutline size={23} />
                            </span>
                            <h1 className="absolute text-xs font-bold top-[-3px] right-[0px]">
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
            </div>
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
              <button
                onClick={() => openAddMemberModal()}
                className="w-full sm:inline-flex sm:w-max items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark"
              >
                Add Contact
              </button>
            </div>
            <div className="flex flex-col gap-3 rounded-md">
              {loggedInUserInfo &&
              loggedInUserInfo.teams &&
              loggedInUserInfo.teams.length > 0 ? (
                loggedInUserInfo.teams.map((team) => {
                  const isExpanded = expandedTeam === team.teamName;
                  return (
                    <div key={team.teamName} className="flex flex-col gap-2">
                      <button
                        className="flex items-center justify-between p-3 bg-gray-200 rounded-md"
                        onClick={() => toggleTeamExpansion(team.teamName)}
                      >
                        <h1>TL: {team.teamName}</h1>
                        <span className="font-bold text-xl">
                          {isExpanded ? "-" : "+"}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="flex flex-col gap-2">
                          {team.teamMembers.map((member) => {
                            const memberName = `${member.fName} ${member.lName}`;
                            return (
                              <div
                                key={member._id}
                                className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-2 sm:gap-0"
                              >
                                {/* Name */}
                                <div className="flex items-center gap-2">
                                  <div className="bg-gray-400 w-8 h-8 text-white p-1 flex items-center justify-center rounded-full">
                                    <MdPersonOutline />
                                  </div>
                                  <h1>{memberName}</h1>
                                  <h6
                                    className={
                                      member._id === loggedInUserInfo._id
                                        ? "block"
                                        : "hidden"
                                    }
                                  >
                                    (you)
                                  </h6>
                                </div>
                                {loggedInUserInfo._id === team.teamLeader && (
                                  <div
                                    className={
                                      loggedInUserInfo?._id === member._id &&
                                      "opacity-0"
                                    }
                                  >
                                    <button
                                      onClick={(e) =>
                                        handleDeleteMember(team._id, member._id)
                                      }
                                      className="bg-red-600 text-white rounded-full p-1"
                                    >
                                      <MdDeleteOutline size={20} />
                                    </button>
                                  </div>
                                )}
                                {/* Email */}
                                <div>
                                  <h1 className="text-sm text-gray-400">
                                    {member.email}
                                  </h1>
                                </div>
                                {/* Role */}
                                <div>
                                  <select
                                    name="user-role"
                                    onChange={(e) =>
                                      updateUserRoleHandler(e, member._id)
                                    }
                                    className="text-xs font-medium text-primaryDark outline-none focus:outline-none uppercase"
                                    id=""
                                  >
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "None" && "hidden"
                                      }`}
                                      value={member.userRole}
                                    >
                                      {member.userRole}
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Buying Agent" &&
                                        "hidden"
                                      }`}
                                      value="Buying Agent"
                                    >
                                      Buying Agent
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Listing Agent" &&
                                        "hidden"
                                      }`}
                                      value="Listing Agent"
                                    >
                                      Listing Agent
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Buyer" && "hidden"
                                      }`}
                                      value="Buyer"
                                    >
                                      Buyer
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Seller" && "hidden"
                                      }`}
                                      value="Seller"
                                    >
                                      Seller
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Admin" && "hidden"
                                      }`}
                                      value="Admin"
                                    >
                                      Admin
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole === "Apraisel" &&
                                        "hidden"
                                      }`}
                                      value="Apraisel"
                                    >
                                      Apraisel
                                    </option>
                                    <option
                                      className={`font-medium ${
                                        member.userRole ===
                                          "Buyer's Attorney" && "hidden"
                                      }`}
                                      value="Buyer's Attorney"
                                    >
                                      Buyer's Attorney
                                    </option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No teams available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onRequestClose={closeShareModal}
        contentLabel="Share File Modal"
        className="Modal w-4/5 sm:h-3/4 rounded-md shadow-md shadow-black/30 flex flex-col h-max justify-center"
        ariaHideApp={false}
        overlayClassName="Overlay"
      >
        <h2 className="text-xl font-bold mb-4">Share File</h2>
        <form onSubmit={handleFileShare}>
          <div className="mb-4">
            <label
              htmlFor="shareEmail"
              className="block mb-2 text-sm font-medium"
            >
              Recipient Email
            </label>
            <input
              type="email"
              id="shareEmail"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Share Settings
            </label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="shareLink"
                checked={shareOptions.shareLink}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    shareLink: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="shareLink" className="text-sm">
                Share Link
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="shareFile"
                checked={shareOptions.shareFile}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    shareFile: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="shareFile" className="text-sm">
                Share File
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editable"
                checked={shareOptions.editable}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    editable: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="editable" className="text-sm">
                Editable
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeShareModal}
              className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-gray-600 bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark"
            >
              Share
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onRequestClose={closeAddMemberModal}
        contentLabel="Share File Modal"
        className="Modal w-3/5 sm:h-2/4 rounded-md shadow-md shadow-black/30 flex flex-col gap-5 h-max justify-center"
        ariaHideApp={false}
        overlayClassName="Overlay"
      >
        <h1 className="text-center font-bold py-2">Add Member</h1>
        <select
          onChange={(e) => setSelectedTeamId(e.target.value)}
          name=""
          className="w-2/3 place-self-center border border-primaryDark rounded-md p-0.5"
          id=""
        >
          {loggedInUserInfo &&
            loggedInUserInfo.teams &&
            loggedInUserInfo.teams.length > 0 &&
            loggedInUserInfo.teams.map((team) => {
              return (
                <option className="flex flex-col" value={team._id}>
                  {team.teamName} Team
                </option>
              );
            })}
        </select>
        <form onSubmit={handleAddMember}>
          <div className="mb-4 w-full flex items-center flex-col gap-1 justify-center">
            <label htmlFor="memberEmail">Member Email</label>
            <div className="border-2 w-3/5 border-primaryDark rounded-md">
              <input
                type="email"
                value={teamMemberEmail}
                required
                placeholder="Enter Member's Email here"
                onChange={(e) => setTeamMemberEmail(e.target.value)}
                className="w-full p-2 outline-none focus:outline-none rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-center gap-5 pt-5">
            <button
              type="button"
              onClick={closeAddMemberModal}
              className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-gray-100 w-24 bg-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm w-24 font-medium rounded-md text-white bg-primaryDark"
            >
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SingleFolder;
