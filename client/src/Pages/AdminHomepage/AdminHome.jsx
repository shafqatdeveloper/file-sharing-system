import React from "react";
import { FaFolderPlus, FaFolderOpen, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="sm:h-[70vh] h-[80vh] p-2 bg-gray-100">
      <main className="flex flex-col items-center mt-10 px-4">
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to={"/admin/folder/add"}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <FaFolderPlus className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">Create Folder</h2>
          </Link>
          <Link
            to={"/admin/profile/manage"}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <FaUserAlt className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">Manage Profile</h2>
          </Link>
          <Link
            to={"/admin/folders/view/all"}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <FaFolderOpen className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">All Folders</h2>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
