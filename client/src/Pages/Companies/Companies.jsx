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
import Modal from "react-modal";

const Companies = () => {
  const api_Url = import.meta.env.VITE_API_URL;
  const [userCompanies, setUserCompanies] = useState(null);
  const [isInviteFrindModalOpen, setisInviteFrindModalOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
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
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Archive Company Handler
  const handleArchiveCompany = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/company/archive/${id}`);
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
      fetchCompanies();
    }
  };

  // Update Company Type
  const handleCompanyUpdate = async (e, companyId) => {
    const updatedCompanyType = e.target.value;
    try {
      const response = await axios.put(
        `/api/company/type/update/${companyId}`,
        {
          updatedCompanyType,
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
      fetchCompanies();
    }
  };

  const openInviteFriendModal = () => {
    setisInviteFrindModalOpen(true);
  };

  // Close Share Modal
  const closeInviteFriendModal = () => {
    setisInviteFrindModalOpen(false);
  };

  // Handle Invite Friend
  const handleInviteFriend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/friend/invite`, {
        friendEmail,
      });
      if (response.data.success) {
        toast(response.data.message);
        closeInviteFriendModal();
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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center">
          <div className="text-2xl font-bold">Default Profile</div>
          <div className="flex items-center gap-3">
            <Link
              to={"/company/add"}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primaryDark"
            >
              <>+ Add a Company</>
            </Link>
            <button
              onClick={openInviteFriendModal}
              className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-full text-black bg-[#f3cb29]"
            >
              Invite Friend
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
                    className="bg-white w-full relative shadow-lg shadow-black/10 rounded-lg overflow-hidden mb-5"
                  >
                    {company.archived && (
                      <div className="absolute top-0 left-0 bg-black/70 text-white py-1 px-2 rounded-br-lg">
                        <h1>Archived</h1>
                      </div>
                    )}
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
                      <div>
                        <h1>
                          <strong className="text-gray-600">Admin:</strong>{" "}
                          <span>
                            {company.companyAdmin.fName +
                              " " +
                              company.companyAdmin.lName}
                          </span>
                        </h1>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <strong>Type: </strong>
                        <select
                          className="text-primaryDark font-medium outline-none focus:outline-none"
                          name="companyType"
                          onChange={(e) => handleCompanyUpdate(e, company._id)}
                          id="companyType"
                        >
                          <option value={company.companyType}>
                            {company.companyType}
                          </option>
                          <option
                            className={
                              company.companyType === "Dealership" && "hidden"
                            }
                            value="Dealership"
                          >
                            Dealership
                          </option>
                          <option
                            className={
                              company.companyType === "Homecare" && "hidden"
                            }
                            value="Homecare"
                          >
                            Homecare
                          </option>
                          <option
                            className={
                              company.companyType === "Billing Service" &&
                              "hidden"
                            }
                            value="Billing Service"
                          >
                            Billing Service
                          </option>
                          <option
                            className={
                              company.companyType === "Real Estate" && "hidden"
                            }
                            value="Real Estate"
                          >
                            Real Estate
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="text-gray-600">
                        <strong>Created:</strong>{" "}
                        {String(company.createdAt).substring(0, 10)}{" "}
                        {/* {new Date(folder.createdAt).toLocaleTimeString()} */}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={(e) => handleArchiveCompany(e, company._id)}
                          className="text-primaryDark hover:underline"
                        >
                          {company.archived ? "Unarchive" : "Archive"}
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

        <Modal
          isOpen={isInviteFrindModalOpen}
          onRequestClose={closeInviteFriendModal}
          contentLabel="Share File Modal"
          className="Modal w-3/5 sm:h-2/4 rounded-md shadow-md shadow-black/30 flex flex-col gap-5 h-max justify-center"
          ariaHideApp={false}
          overlayClassName="Overlay"
        >
          <h1 className="text-center font-bold py-2">Invite a Friend</h1>
          <form onSubmit={handleInviteFriend}>
            <div className="mb-4 w-full flex items-center flex-col gap-1 justify-center">
              <label htmlFor="memberEmail">Enter you Friend's Email</label>
              <div className="border-2 w-3/5 border-primaryDark rounded-md">
                <input
                  type="email"
                  value={friendEmail}
                  required
                  placeholder="Enter Member's Email here"
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="w-full p-2 outline-none focus:outline-none rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-center gap-5 pt-5">
              <button
                type="button"
                onClick={closeInviteFriendModal}
                className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-gray-100 w-24 bg-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm w-24 font-medium rounded-md text-white bg-primaryDark"
              >
                Invite
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Companies;
