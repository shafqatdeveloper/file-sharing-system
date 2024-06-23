import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Loader from "../../Components/Loaders/Loader";
import { toast } from "react-toastify";

const PdfViewer = () => {
  const { fileId } = useParams();
  const [fileBuffer, setFileBuffer] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(window.innerWidth - 40);
  const [signer, setSigner] = useState(null);
  const [showSignatureSection, setShowSignatureSection] = useState(false);
  const sigCanvas = useRef(null);

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
    <div className="pdf-viewer-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
      {!showSignatureSection && (
        <button
          onClick={() => setShowSignatureSection(true)}
          className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        >
          Show Signature Section
        </button>
      )}
      {showSignatureSection && (
        <div className="signature-section w-full flex flex-col items-center mb-4">
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="signer"
                value="seller"
                onChange={() => setSigner("seller")}
              />
              Seller
            </label>
            <label>
              <input
                type="radio"
                name="signer"
                value="buyer"
                onChange={() => setSigner("buyer")}
              />
              Buyer
            </label>
          </div>
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: 500,
              height: 200,
              className: "sigCanvas border border-gray-300",
            }}
          />
          <div className="mt-4">
            <button
              onClick={handleClear}
              className="mr-4 bg-gray-500 text-white py-2 px-4 rounded"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="pdf-viewer flex-grow w-full mb-4">
        {fileBuffer && (
          <Document
            file={fileBuffer}
            loading={<Loader />}
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
  );
};

export default PdfViewer;
