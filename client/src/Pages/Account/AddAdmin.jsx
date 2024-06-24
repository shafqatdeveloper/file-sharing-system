import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
  });

  const navigate = useNavigate();
  const [isAdminLoggedIn, setisAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("/api/user/authenticate", {
          withCredentials: true,
        });
        const user = response.data.loggedInUser;
        if (user) {
          if (user.role === "admin") {
            setisAdminLoggedIn(true);
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("profilePic", formData.profilePic);

    try {
      const response = await axios.post("/api/admin/add", data);
      if (response.status === 200) {
        toast(response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          profilePic: null,
        });
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        toast("No response received from the server.");
      } else {
        toast("An error occurred while setting up the request.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="profilePic"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={handleChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
