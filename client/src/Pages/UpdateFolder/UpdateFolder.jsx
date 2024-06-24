import axios from "axios";
import React, { useState } from "react";
import { FaUser, FaLock, FaFolderPlus } from "react-icons/fa";
import { GrOrganization } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateFolder = () => {
  const [folderName, setFolderName] = useState("");
  const { folderId } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`/api/admin/folder/update/${folderId}`, {
        folderName,
      });
      if (response.status === 200) {
        toast(response.data.message);
        setFolderName("");
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
          <h1 className="text-xl font-bold">Update Folder</h1>
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
                required
                className="w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                placeholder="Enter Organization Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
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

export default UpdateFolder;
