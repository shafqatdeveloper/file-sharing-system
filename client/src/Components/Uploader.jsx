import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./pdf-worker";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loaders/Loader";

function Uploader({ folderId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth * 0.9);
  console.log(folderId);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.9);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
    setNumPages(null);
  };

  const handleFileUpload = async (e) => {
    setUploadLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("folderId", folderId);
    formData.append("uploadingFile", selectedFile);
    const response = await axios.post(
      `/api/admin/document/upload/${folderId}`,
      formData
    );
    if (response.status === 200) {
      toast(response.data.message);
      setFileUrl(null);
      setSelectedFile(null);
      setUploadLoading(false);
    } else {
      setUploadLoading(false);
      toast(response.data.message);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleFileUpload}
        className="px-5 py-1 bg-green-500 rounded-md"
      >
        Upload
      </button>
      {fileUrl && (
        <Document
          loading={
            <div className="flex flex-col mt-10 gap-4">
              <h1 className="textxl font-bold font-sans">Loading PDF</h1>
              <Loader />
            </div>
          }
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="my-2">
              <Page pageNumber={index + 1} width={width} />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
}

export default Uploader;
