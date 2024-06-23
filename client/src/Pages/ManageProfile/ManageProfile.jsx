import React from "react";
import { FaUserPlus, FaLock, FaUserEdit } from "react-icons/fa";

const ManageProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-white shadow-md py-4 px-6 w-full flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Manage Profile</h1>
        </div>
      </header>
      <main className="w-full max-w-4xl mt-10 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
            <FaUserPlus className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">Add an Admin</h2>
          </div>
          <div className="bg-gray-50 shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
            <FaLock className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>
          <div className="bg-gray-50 shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
            <FaUserEdit className="text-blue-500 text-4xl mb-4" />
            <h2 className="text-lg font-semibold">Change Admin Info</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageProfile;
