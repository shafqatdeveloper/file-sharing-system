import React from "react";

const TopBar = ({
  onAddOptionClick,
  onFileOptionClick,
  onSaveClick,
  onShareClick,
}) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <div className="flex space-x-4">
        <div className="relative inline-block text-left">
          <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
            Add
          </button>
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onAddOptionClick("date")}
              >
                Date
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onAddOptionClick("checkbox")}
              >
                Checkbox
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onAddOptionClick("fullName")}
              >
                Full Name
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onAddOptionClick("text")}
              >
                Text
              </button>
            </div>
          </div>
        </div>
        <div className="relative inline-block text-left">
          <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
            File
          </button>
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onFileOptionClick("save")}
              >
                Save
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onFileOptionClick("download")}
              >
                Download
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                onClick={() => onFileOptionClick("print")}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onSaveClick}
        >
          Save
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={onShareClick}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default TopBar;
