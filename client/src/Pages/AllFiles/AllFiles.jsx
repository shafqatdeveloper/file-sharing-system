import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { toast } from "react-toastify";
import Loader from "../../Components/Loaders/Loader";
const AllFiles = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  console.log(id);
  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get(`/api/files/all/${id}`);
        const files = response.data.pdfFiles.map((file) => ({
          ...file,
          buffer: `data:application/pdf;base64,${file.buffer}`,
        }));
        setPdfFiles(files);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfFiles();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleViewFile = (fileId) => {
    navigate(`/file/single/${fileId}`);
  };

  const handleShareFile = async (fileId) => {
    const receiver = prompt("Enter Receiver Email address");
    const response = await axios.post(`/api/file/share/${fileId}`, {
      receiver,
    });
    if (response.status === 200) {
      toast(response.data.message);
    } else {
      toast(response.data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">PDF Files</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pdfFiles.map((file) => (
          <div
            key={file._id}
            className="border rounded-lg shadow-md bg-white flex flex-col items-center justify-center relative h-80"
          >
            <div className="pdf-preview mx-auto p-2 h-72">
              <Document
                file={file.buffer}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <h1 className="textxl font-bold font-sans">Loading PDF</h1>
                    <Loader />
                  </div>
                }
                onLoadError={console.error}
              >
                <Page pageNumber={1} width={150} />
              </Document>
            </div>
            <div className="flex-grow absolute bottom-0 gap-3 flex items-center justify-center p-4">
              <button
                onClick={() => handleViewFile(file._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View File
              </button>
              <button
                onClick={() => handleShareFile(file._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Share File
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFiles;
