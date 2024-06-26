import React from "react";
import { Link } from "react-router-dom";

const DevelopmentPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Page Under Development
        </h2>
        <p className="mt-4 text-gray-600">
          We are working hard to bring you this feature. Please check back
          later.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-primaryDark text-white font-bold rounded-md shadow-md transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default DevelopmentPage;
