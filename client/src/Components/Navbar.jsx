import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get("/api/user/authenticate", {
        withCredentials: true,
      });
      const user = response.data.loggedInUser;
      if (user) {
        setLoggedIn(true);
        setUserRole(user.role);
      }
    };
    authorize();
  });

  const handleLogout = async () => {
    const confitmLogout = confirm("Are you sure to Logout");
    if (confitmLogout) {
      const response = await axios.get("/api/admin/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/login");
        toast("Logged Out", {
          theme: "dark",
        });
        setLoggedIn(false);
      }
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        {/* <img src={logo} alt="Logo" className="h-10 w-10 mr-3" /> */}
        <Link to={"/"}>
          <FaUserAlt />
        </Link>
      </div>
      {/* <h1 className="text-xl font-bold">
        {userRole === "admin" ? "Admin" : "User"} Dashboard
      </h1> */}
      {loggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          <FaSignOutAlt className="inline mr-2" />
          Admin Logout
        </button>
      ) : (
        <Link
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          to={"/login"}
        >
          <FaSignInAlt className="inline mr-2" />
          Admin Login
        </Link>
      )}
    </header>
  );
};

export default Navbar;
