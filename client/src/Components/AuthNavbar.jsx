import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { toast } from "react-toastify";
import logo from "../assets//logo.png";
import { useDispatch } from "react-redux";
import { checkAuth } from "../Redux/Features/Auth/AuthSlice";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegFolderOpen } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { RiTaskLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";

const AuthNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [profileSectionOpen, setProfileSectionOpen] = useState(false);
  const [mobileProfileSectionOpen, setMobileProfileSectionOpen] =
    useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileSection = () => {
    setProfileSectionOpen(!profileSectionOpen);
  };
  const toggleMobileProfileSection = () => {
    setMobileProfileSectionOpen(!mobileProfileSectionOpen);
  };

  const handleLogout = async () => {
    const confitmLogout = confirm("Are you sure to Logout");
    if (confitmLogout) {
      const response = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/");
        toast("Logged Out", {
          theme: "dark",
        });
        setIsOpen(!isOpen);
        dispatch(checkAuth());
        setLoggedIn(false);
      }
    }
  };

  const navItems = [
    {
      name: "folders",
      navLink: "/folders",
      icon: <FaRegFolderOpen size={22} />,
    },
    { name: "tasks", navLink: "/tasks", icon: <RiTaskLine size={22} /> },
    { name: "people", navLink: "/people", icon: <GoPeople size={22} /> },
  ];

  return (
    <header className="bg-white mb-0.5 py-5 shadow-md flex gap-12 justify-between px-5 sm:px-10 items-center">
      <div className="flex items-center">
        <Link to={"/"} className="text-2xl font-bold font-sans">
          <img src={logo} alt="ArchiSign" className="w-32" />
        </Link>
      </div>
      <div className="hidden md:flex space-x-6 lg:space-x-8 items-center uppercase text-sm">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.navLink}
            className={
              location.pathname === item.navLink
                ? "text-primaryDark font-bold flex flex-col items-center underline"
                : "text-gray-500 hover:text-gray-700 font-medium flex flex-col gap-0 items-center"
            }
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
        <div className="relative">
          <button
            onClick={toggleProfileSection}
            className="flex items-center w-52 justify-between text-black border-[1.5px] rounded-md font-semibold font-sans tracking-wide border-primaryDark px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="bg-primaryDark rounded-full w-8 h-8 flex items-center justify-center">
                <span>D</span>
              </div>
              <span className="font-semibold">Default Profile</span>
            </div>
            <MdKeyboardArrowDown
              size={23}
              className={
                profileSectionOpen
                  ? "rotate-180 transition-all duration-200"
                  : "transition-all duration-200"
              }
            />
          </button>
          {profileSectionOpen && (
            <div className="absolute top-16 bg-white py-2 shadow-md shadow-black/50 rounded-md w-80 right-0">
              <div className="border-b border-b-gray-300 pb-1">
                <div className="pl-3 flex flex-col gap-1 py-1">
                  <h1>
                    Member ID : <span className="font-medium">1234567</span>
                  </h1>
                  <h1>
                    Name : <span className="font-medium">Shadow Nix</span>
                  </h1>
                </div>
              </div>
              <div className="pb-2 border-b border-b-gray-300">
                <h1 className="uppercase pl-3 py-3 text-gray-400 font-bold">
                  My Profiles
                </h1>
                <div className="bg-[#d3fad3] flex items-center gap-3">
                  <div className="w-1 h-14 bg-primaryDark"></div>
                  <div className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryDark rounded-full w-8 h-8 flex items-center justify-center">
                        <span>D</span>
                      </div>
                      <span className="font-semibold">Default Profile</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b border-b-gray-300 py-4 flex flex-col gap-1 text-primaryDark font-bold tracking-wide font-sans">
                <div className="pl-3 flex flex-col gap-2">
                  <Link
                    onClick={toggleProfileSection}
                    className="underline"
                    to={"/help-center"}
                  >
                    Help Center
                  </Link>
                  <Link onClick={toggleProfileSection} className="underline">
                    Support +123345
                  </Link>
                </div>
              </div>
              <div className="mt-2 w-full">
                <button
                  onClick={handleLogout}
                  className="flex w-full hover:bg-red-100 p-3 font-bold font-sans text-red-500 items-center gap-1"
                >
                  <IoIosLogOut size={25} />
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-primaryDark focus:outline-none"
        >
          <GiHamburgerMenu size={25} />
        </button>
      </div>
      <div
        className={
          isOpen
            ? `md:hidden absolute h-screen top-16 left-0 right-0 transition-all duration-300 bg-white shadow-lg z-10`
            : "md:hidden absolute top-[-100%] left-0 right-0 transition-all duration-300 bg-white shadow-lg z-10"
        }
      >
        <div className="flex flex-col pl-5 uppercase tracking-wide space-y-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.navLink}
              className={
                location.pathname === item.navLink
                  ? "text-primaryDark font-medium flex items-center gap-1"
                  : "text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1"
              }
              onClick={toggleMenu}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 w-52">
            <div className="relative">
              <button
                onClick={toggleMobileProfileSection}
                className="flex items-center w-52 justify-between text-black border-[1.5px] rounded-md font-semibold font-sans tracking-wide border-primaryDark px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primaryDark rounded-full w-8 h-8 flex items-center justify-center">
                    <span>D</span>
                  </div>
                  <span className="font-semibold">Default Profile</span>
                </div>
                <MdKeyboardArrowDown
                  size={23}
                  className={
                    mobileProfileSectionOpen
                      ? "rotate-180 transition-all duration-200"
                      : "transition-all duration-200"
                  }
                />
              </button>
              {mobileProfileSectionOpen && (
                <div className="absolute top-14 bg-white py-2 shadow-md shadow-black/50 rounded-md w-64 left-0">
                  <div className="border-b border-b-gray-300 pb-1">
                    <div className="pl-3 flex flex-col gap-1 py-1">
                      <h1>
                        Member ID : <span className="font-medium">1234567</span>
                      </h1>
                      <h1>
                        Name : <span className="font-medium">Shadow Nix</span>
                      </h1>
                    </div>
                  </div>
                  <div className="pb-2 border-b border-b-gray-300">
                    <h1 className="uppercase pl-3 py-3 text-gray-400 font-bold">
                      My Profiles
                    </h1>
                    <div className="bg-[#d3fad3] flex items-center gap-3">
                      <div className="w-1 h-14 bg-primaryDark"></div>
                      <div className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-primaryDark rounded-full w-8 h-8 flex items-center justify-center">
                            <span>D</span>
                          </div>
                          <span className="font-semibold">Default Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-b-gray-300 py-4 flex flex-col gap-1 text-primaryDark font-bold tracking-wide font-sans">
                    <div className="pl-3 flex flex-col gap-2">
                      <Link
                        onClick={() => {
                          toggleMenu();
                          toggleMobileProfileSection();
                        }}
                        className="underline"
                        to={"/help-center"}
                      >
                        Help Center
                      </Link>
                      <Link
                        onClick={() => {
                          toggleMenu();
                          toggleMobileProfileSection();
                        }}
                        className="underline"
                      >
                        Support +123345
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 w-full">
                    <button
                      onClick={handleLogout}
                      className="flex w-full hover:bg-red-100 p-3 font-bold font-sans text-red-500 items-center gap-1"
                    >
                      <IoIosLogOut size={25} />
                      LOGOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
