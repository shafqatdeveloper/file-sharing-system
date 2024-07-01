import React, { useEffect, useState } from "react";
import PDFViewer from "../../Components/PdfViewer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Draggable from "react-draggable";
import { MdOutlineArrowLeft, MdOutlineKeyboardArrowLeft } from "react-icons/md";

const FileViewer = () => {
  const { fileId } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileDetails, setPdfFileDetails] = useState(null);
  const location = useLocation();
  const [addComponentDropdownOpened, setaddComponentDropdownOpened] =
    useState(false);
  const [fileDropdownOpened, setfileDropdownOpened] = useState(false);

  // Fetch PDF File
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`/api/file/single/${fileId}`, {
          responseType: "blob",
          withCredentials: true,
        });
        const url = URL.createObjectURL(response.data);
        setPdfFile(url);
      } catch (error) {
        console.error("Error fetching PDF file:", error);
      }
    };

    fetchFile();
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [fileId]);

  // Fetch Pdf File Details
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`/api/file/single/details/${fileId}`);
        setPdfFileDetails(response.data.file);
      } catch (error) {
        console.error("Error fetching PDF file:", error);
      }
    };

    fetchFileDetails();
  }, [fileId]);

  const [components, setComponents] = useState([]);

  const handleAddOptionClick = (option) => {
    const newComponent = {
      type: option,
      id: components.length,
    };
    setComponents([...components, newComponent]);
    setaddComponentDropdownOpened(false);
  };

  const handleComponentDelete = (id) => {
    const confirmDelete = confirm("Are You sure to delete this Component");
    if (confirmDelete) {
      setComponents(components.filter((comp) => comp.id !== id));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-4 mt-5 px-1">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center rounded-md bg-gray-800 w-full sm:w-3/4 p-4 text-black">
        <div className="text-white flex items-center gap-4">
          <Link to={`${location?.state?.from}`}>
            <MdOutlineKeyboardArrowLeft
              className="text-primaryDark"
              size={30}
            />
          </Link>
          <div>
            <div className="flex flex-col gap-1 text-xs uppercase">
              <h1 className="font-bold font-sans">
                {String(pdfFileDetails?.Name).replace(/\.pdf$/, "")}
              </h1>
              <Link
                to={"/edit/private"}
                className="text-primaryDark font-bold font-sans"
              >
                Edit in Private
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex space-x-4">
            <div className="relative inline-block text-left">
              <button
                onClick={() =>
                  setaddComponentDropdownOpened(!addComponentDropdownOpened)
                }
                className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
              >
                Add
              </button>
              {addComponentDropdownOpened && (
                <div className="absolute z-20 left-0 md:right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white text-black">
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
              )}
            </div>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setfileDropdownOpened(!fileDropdownOpened)}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
              >
                File
              </button>
              {fileDropdownOpened && (
                <div className="absolute z-20 left-0 md:right-0 top-12 mt-2 w-40 rounded-md shadow-lg bg-white text-black">
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
              )}
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
      </div>
      <div className="flex-1 flex w-full justify-center items-center">
        <div className="relative w-full h-full">
          {components.map((comp) => (
            <Draggable key={comp.id}>
              <div
                onDoubleClick={() => handleComponentDelete(comp.id)}
                className="absolute z-10"
              >
                {comp.type === "date" && (
                  <input
                    type="date"
                    className="border-2 rounded-md outline-none focus:outline-none p-2 border-primaryDark"
                  />
                )}
                {comp.type === "checkbox" && (
                  <input
                    type="checkbox"
                    className="border-2 rounded-md outline-none focus:outline-none p-2 border-primaryDark"
                  />
                )}
                {comp.type === "fullName" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border-2 rounded-md outline-none focus:outline-none p-2 border-primaryDark"
                  />
                )}
                {comp.type === "text" && (
                  <input
                    type="text"
                    className="border-2 rounded-md outline-none focus:outline-none p-2 border-primaryDark"
                  />
                )}
              </div>
            </Draggable>
          ))}
          <div className="w-full flex items-center justify-center">
            <PDFViewer file={pdfFile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
