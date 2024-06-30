import React from "react";

const api_Url = import.meta.env.VITE_API_URL;
const FinishFolderCreation = ({ folderData }) => (
  <div className=" mx-auto bg-white shadow-md shadow-black/20 rounded-lg overflow-hidden">
    <div className="bg-primaryDark w-max rounded-tl-lg rounded-br-lg text-white text-sm font-bold px-4 py-2">
      New
    </div>
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-center">
        <img
          src={`${api_Url}/uploads/${folderData.folderPic}`}
          alt="Illustration"
          className="h-32"
        />
      </div>
      {console.log(`${api_Url}/uploads/${folderData.folderPic}`)}
      <div className="flex flex-col gap-1.5">
        <p className="">{folderData.folderName}</p>
        <p className=" text-gray-500">
          <span>Created: </span>
          {String(folderData.createdAt).substring(0, 10)}
        </p>
        <div className="flex items-center">
          <span className="text-gray-600 text-sm">Type: </span>
          <button className="text-primaryDark text-sm ml-1">None</button>
        </div>
      </div>
    </div>
  </div>
);

export default FinishFolderCreation;
