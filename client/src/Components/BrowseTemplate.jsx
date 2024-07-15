import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const BrowseTemplate = ({ folderId }) => {
  return (
    <Link
      to={`/templates/browse?folder=${folderId}`}
      className="bg-green-100 h-64 rounded-md border border-primaryDark border-dashed flex flex-col items-center justify-center p-4"
    >
      <FaRegFileAlt className="text-primaryDark text-4xl mb-2" />
      <h2 className="text-primaryDark text-lg font-semibold">TEMPLATES</h2>
      <p className="text-gray-500 text-sm text-center pt-3">
        Add an interactive form by selecting one from templates.
      </p>
    </Link>
  );
};

export default BrowseTemplate;
