import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { toast } from "react-toastify";
import logo from "../assets//logo.png";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../Redux/Features/Auth/AuthSlice";
const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
    { name: "home", navLink: "/" },
    { name: "pricing", navLink: "/pricing" },
    { name: "team", navLink: "/team" },
    { name: "resources", navLink: "/resources" },
    { name: "login", navLink: "/login" },
  ];

  return (
    <header className="bg-white mb-0.5 py-5 shadow-md flex md:justify-center gap-12 justify-between px-5 items-center">
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
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Link
        to={"/contact/sales"}
        className="md:flex items-center hidden justify-center text-white font-semibold font-sans tracking-wide bg-primaryDark rounded-full px-3 py-2"
      >
        <button>Contact Sales</button>
      </Link>
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
            ? `md:hidden absolute top-16 left-0 right-0 transition-all duration-300 bg-white shadow-lg z-10`
            : "md:hidden absolute top-[-100%] left-0 right-0 transition-all duration-300 bg-white shadow-lg z-10"
        }
      >
        <div className="flex flex-col pl-5 uppercase tracking-wide space-y-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.navLink}
              className="text-gray-700 hover:text-gray-900 font-medium"
              onClick={toggleMenu}
            >
              {item.name}
            </Link>
          ))}
          <div className="w-full flex items-center gap-5 pr-10">
            <Link
              to={"/contact/sales"}
              onClick={toggleMenu}
              className="flex items-center w-full justify-center text-white font-semibold font-sans tracking-wide bg-primaryDark rounded-md px-3 py-2"
            >
              <button>Contact Sales</button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
