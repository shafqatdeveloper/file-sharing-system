import React from "react";
import { Link } from "react-router-dom";
import NotFoundImg from "../../assets/notFoundPic.png";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] sm:h-[85vh] pb-12">
      <div className="w-full flex items-center justify-center sm:w-1/3 px-2 sm:px-0">
        <img
          src={NotFoundImg} // Replace with a real image URL
          alt="404"
          className="mb-8"
        />
      </div>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8 px-2 sm:px-0 text-center">
        Oops! The page you're looking for doesn't exist.
      </h2>
      <Link to="/">
        <button className="px-6 py-3 bg-primaryDark text-white font-bold rounded-md shadow-md transition duration-300 ">
          Go back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
