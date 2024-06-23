import axios from "axios";
import React, { useState } from "react";
import { FaUser, FaLock, FaFolderPlus } from "react-icons/fa";
import { GrOrganization } from "react-icons/gr";
import { toast } from "react-toastify";

const AddFolder = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [folderName, setFolderName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Username:", email);
    console.log("Password:", password);
    console.log("Profile Picture:", profilePic);

    const formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post("/api/admin/add/user", formData);
      if (response.status === 200) {
        toast(response.data.message);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-white shadow-md py-4 px-6 w-full flex justify-between items-center">
        <div className="flex items-center">
          <FaFolderPlus className="text-blue-500 text-4xl mr-3" />
          <h1 className="text-xl font-bold">Add Folder</h1>
        </div>
      </header>
      <main className="w-full max-w-lg mt-10 bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="folderName"
            >
              Organization or Person Name
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <GrOrganization className="text-gray-400 ml-2" />
              <input
                type="text"
                id="folderName"
                className="w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                placeholder="Enter Organization Nmae"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Organization Email
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <FaUser className="text-gray-400 ml-2" />
              <input
                type="email"
                id="email"
                className="w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                placeholder="Enter Organization Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <FaLock className="text-gray-400 ml-2" />
              <input
                type="password"
                id="password"
                className="w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="profilePic"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProfilePicChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddFolder;
