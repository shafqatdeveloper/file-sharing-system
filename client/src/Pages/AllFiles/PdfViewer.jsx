import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Loader from "../../Components/Loaders/Loader";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import { FaArrowCircleLeft } from "react-icons/fa";

const PdfViewer = () => {
  const { fileId } = useParams();
  const [fileBuffer, setFileBuffer] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(window.innerWidth - 40);
  const [signer, setSigner] = useState(null);
  const [showSignatureSection, setShowSignatureSection] = useState(false);
  const sigCanvas = useRef(null);
  const [components, setComponents] = useState([]);
  const [isAddDropdownOpen, setAddDropdownOpen] = useState(false);
  const [isFileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [dragging, setDragging] = useState(null);

  console.log(components);

  const handleStart = (id) => {
    setDragging(id);
  };

  const handleStop = (e, data, id) => {
    setDragging(null);
    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, x: data.x, y: data.y } : comp
      )
    );
  };

  const handleAddOptionClick = (option) => {
    const newComponent = {
      type: option,
      id: components.length,
      x: 0,
      y: 0,
    };
    setComponents([...components, newComponent]);
  };

  const handleRemoveComponent = (id) => {
    const confirmDelComponent = confirm("Are you sure to remove this element?");
    if (confirmDelComponent)
      setComponents(components.filter((comp) => comp.id !== id));
  };

  const handleFileOptionClick = (option) => {
    switch (option) {
      case "save":
        console.log("Save file");
        break;
      case "download":
        console.log("Download file");
        break;
      case "print":
        console.log("Print file");
        break;
      default:
        break;
    }
  };

  const handleSaveClick = () => {
    console.log("File saved");
  };

  const handleShareClick = () => {
    console.log("File shared");
  };

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`/api/file/single/${fileId}`);
        setFileBuffer(
          `data:application/pdf;base64,${response.data.file.buffer}`
        );
      } catch (error) {
        console.error("Error fetching PDF file:", error);
      }
    };

    fetchFile();
  }, [fileId]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - 40);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const handleSave = async () => {
    if (!signer) {
      alert("Please select if you are a seller or buyer.");
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature.");
      return;
    }

    const signatureData = sigCanvas.current.toDataURL();
    const data = {
      fileId,
      signer,
      signature: signatureData,
    };

    try {
      const response = await axios.put("/api/upload/sign", data);
      console.log(response.data);
      toast(response.data.message);

      // Clear the signature canvas after successful upload
      sigCanvas.current.clear();
    } catch (error) {
      console.error("Error saving signature:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast(error.response.data.message);
      } else {
        toast("An error occurred while saving the signature.");
      }
    }
  };

  return (
    <div className="pdf-viewer-container flex flex-col items-center w-full justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
      <div className="flex w-full flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 text-black">
        <div className="flex items-center gap-5 text-white">
          <Link to={"/back-link"}>
            <FaArrowCircleLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-sans w-max">Folder Name</h1>
            <h1>Edit in Private</h1>
          </div>
        </div>
        <div className="flex items-center flex-col sm:flex-row justify-center sm:justify-end w-full gap-5 mt-4 md:mt-0">
          <div className="flex space-x-4">
            <div
              className="relative inline-block text-left"
              onClick={() => setAddDropdownOpen(!isAddDropdownOpen)}
            >
              <button
                className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
                onClick={() => setAddDropdownOpen(!isAddDropdownOpen)}
              >
                Add
              </button>
              {isAddDropdownOpen && (
                <div className="absolute left-0 sm:right-0 top-12 mt-2 w-56 rounded-md shadow-lg z-20 bg-sky-600 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="block px-4 py-2 text-sm text-gray-100"
                      onClick={() => handleAddOptionClick("signature")}
                    >
                      Signature
                    </button>
                    <button
                      className="cursor-pointer px-4 py-2 text-sm text-gray-100"
                      onClick={() => handleAddOptionClick("date")}
                    >
                      Date
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-100"
                      onClick={() => handleAddOptionClick("checkbox")}
                    >
                      Checkbox
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-100"
                      onClick={() => handleAddOptionClick("fullName")}
                    >
                      Full Name
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-100"
                      onClick={() => handleAddOptionClick("text")}
                    >
                      Text
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative inline-block text-left"
              onClick={() => setFileDropdownOpen(!isFileDropdownOpen)}
            >
              <button
                className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
                onClick={() => setFileDropdownOpen(!isFileDropdownOpen)}
              >
                File
              </button>
              {isFileDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 rounded-md shadow-lg z-20 bg-sky-600 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button className="block px-4 w-24 py-2 text-sm text-gray-100">
                      Save
                    </button>
                    <button className="block px-4 w-24 py-2 text-sm text-gray-100">
                      Download
                    </button>
                    <button className="block px-4 w-24 py-2 text-sm text-gray-100">
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
      <div className="flex-1 flex justify-center w-full sm:w-2/3 items-center bg-gray-100">
        <div className="relative w-full h-full">
          {components.map((comp) => (
            <Draggable
              onStart={() => setDragging(true)}
              onStop={(e, data) => handleStop(e, data, comp.id)}
              key={comp.id}
            >
              <div className="absolute z-10">
                {comp.type === "signature" && (
                  <button
                    onDoubleClick={() => handleRemoveComponent(comp.id)}
                    className={`border-[2px] border-red-600 px-2 py-0.5 rounded-sm bg-green-500 ${
                      dragging && "cursor-grab"
                    }`}
                  >
                    Signature
                  </button>
                )}
                {comp.type === "date" && (
                  <input
                    type="date"
                    onDoubleClick={() => handleRemoveComponent(comp.id)}
                    className={`border-[2px] border-red-600 px-2 py-0.5 rounded-sm bg-red-200 ${
                      dragging && "cursor-grab"
                    }`}
                  />
                )}
                {comp.type === "checkbox" && (
                  <div
                    className={`bg-red-400 py-2 px-3 rounded-md ${
                      dragging && "cursor-grab"
                    }`}
                    onDoubleClick={() => handleRemoveComponent(comp.id)}
                  >
                    <input
                      type="checkbox"
                      className={`border-[2px] border-red-600 h-4 w-4 bg-red-200`}
                    />
                  </div>
                )}
                {comp.type === "fullName" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    onDoubleClick={() => handleRemoveComponent(comp.id)}
                    className={`border-[2px] border-red-600 px-2 py-0.5 rounded-sm bg-red-200 ${
                      dragging && "cursor-grab"
                    }`}
                  />
                )}
                {comp.type === "text" && (
                  <input
                    type="text"
                    onDoubleClick={() => handleRemoveComponent(comp.id)}
                    className={`border-[2px] border-red-600r px-2 py-0.5 rounded-sm bg-red-200 ${
                      dragging && "cursor-grab"
                    }`}
                  />
                )}
              </div>
            </Draggable>
          ))}
          <div className="pdf-viewer flex-grow w-full mb-4">
            {fileBuffer && (
              <Document
                file={fileBuffer}
                loading={
                  <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <h1 className="textxl font-bold font-sans">Loading PDF</h1>
                    <Loader />
                  </div>
                }
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={console.error}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="my-2 flex justify-center"
                  >
                    <Page pageNumber={index + 1} width={width} />
                  </div>
                ))}
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
