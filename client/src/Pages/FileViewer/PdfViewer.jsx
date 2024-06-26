import React, { useState } from "react";
import pdfFile from "../../assets/wfm_custom_template.pdf";
import TopBar from "../../Components/Topbar";
import PDFViewer from "../../Components/PdfViewer";

const FileViewer = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center bg-gray-800 p-4 text-black">
        <div className="flex space-x-4">
          <div className="relative inline-block text-left">
            <button className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
              Add
            </button>
            <div className=" right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white text-black">
              <div className="py-1">
                <button
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleAddOptionClick("date")}
                >
                  Date
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleAddOptionClick("checkbox")}
                >
                  Checkbox
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleAddOptionClick("fullName")}
                >
                  Full Name
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleAddOptionClick("text")}
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
                <button className="block px-4 py-2 text-sm text-gray-700">
                  Save
                </button>
                <button className="block px-4 py-2 text-sm text-gray-700">
                  Download
                </button>
                <button className="block px-4 py-2 text-sm text-gray-700">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Share
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <div className="relative w-full h-full">
          {components.map((comp) => (
            <Draggable key={comp.id}>
              <div className="absolute z-10">
                {comp.type === "date" && (
                  <input type="date" className="border p-2" />
                )}
                {comp.type === "checkbox" && (
                  <input type="checkbox" className="border p-2" />
                )}
                {comp.type === "fullName" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border p-2"
                  />
                )}
                {comp.type === "text" && (
                  <input type="text" className="border p-2" />
                )}
              </div>
            </Draggable>
          ))}
          <PDFViewer file={pdfFile} />
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
