import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            setName(user.name);
            setEmail(user.email);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profilePic", profilePic);
    formData.append("password", password);

    try {
      const response = await axios.put("/api/admin/update", formData);
      if (response.status === 200) {
        toast(response.data.message || "Admin info updated successfully!", {
          theme: "dark",
        });
        setName("");
        setEmail("");
        setPassword("");
        setProfilePic(null);
      } else {
        toast(response.data.message, { theme: "dark" });
      }
    } catch (error) {
      if (error.response) {
        toast(error.response.data.message || "An error occurred.", {
          theme: "dark",
        });
      } else if (error.request) {
        toast("No response received from the server.", { theme: "dark" });
      } else {
        toast("An error occurred while setting up the request.", {
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Update Admin Info</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Password for Verification"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdmin;
