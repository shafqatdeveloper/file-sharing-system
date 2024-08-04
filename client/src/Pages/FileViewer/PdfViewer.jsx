import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SuspenseLoader from "../../Components/Loaders/SuspenseLoader";
import { Document, Page } from "react-pdf";
import { useReactToPrint } from "react-to-print";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { toast } from "react-toastify";
import Loader from "../../Components/Loaders/Loader";

const FileViewer = () => {
  const { fileId } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileDetails, setPdfFileDetails] = useState(null);
  const location = useLocation();
  const [addComponentDropdownOpened, setAddComponentDropdownOpened] =
    useState(false);
  const [fileDropdownOpened, setFileDropdownOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const pdfViewerRef = useRef(null);
  const printRef = useRef();
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareOptions, setShareOptions] = useState({
    shareLink: true,
    shareFile: true,
    editable: false,
  });

  useEffect(() => {
    const handleResize = () => {
      if (pdfViewerRef.current) {
        const viewerWidth = pdfViewerRef.current.clientWidth;
        setPageWidth(viewerWidth * 0.75); // Set the width to 75% of the viewer width
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Fetch PDF File
  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/file/single/${fileId}`, {
          responseType: "blob",
          withCredentials: true,
          timeout: 0,
        });
        const url = URL.createObjectURL(response.data);
        setPdfFile(url);
      } catch (error) {
        console.error("Error fetching PDF file:", error);
      } finally {
        setLoading(false);
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
  const fetchFileDetails = async () => {
    try {
      const response = await axios.get(`/api/file/single/details/${fileId}`);
      setPdfFileDetails(response.data.file);
    } catch (error) {
      console.error("Error fetching PDF file details:", error);
    }
  };

  useEffect(() => {
    fetchFileDetails();
  }, [fileId]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFileDetails?.Name || "document.pdf";
    link.click();
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: pdfFileDetails?.Name || "document",
    pageStyle: `
      @page {
        size: auto;
        margin: 0mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: auto;
        }
      }
    `,
    removeAfterPrint: true,
  });

  // Handle Share
  const handleFileShare = async (e) => {
    e.preventDefault();
    closeShareModal();
    setShareLoading(true);
    try {
      const response = await axios.post(`/api/file/share/single`, {
        sharingFile: fileId,
        email: shareEmail,
        shareSetting: shareOptions,
      });
      if (response.data.success) {
        toast(response.data.message);
        setShared(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setShareLoading(false);
    }
  };

  // Open Share Modal
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  // Close Share Modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareEmail("");
    setShareOptions({ shareLink: false, shareFile: true, editable: false });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-4 mt-5 px-1">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center rounded-md bg-gray-800 w-full sm:w-3/4 p-4 text-black">
        <div className="text-white flex items-center gap-4">
          <Link to={`${location?.state?.from ? location?.state?.from : "/"}`}>
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
                  setAddComponentDropdownOpened(!addComponentDropdownOpened)
                }
                className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
              >
                Add
              </button>
              {addComponentDropdownOpened && (
                <div className="absolute z-20 left-0 md:right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white text-black">
                  <div className="py-1">
                    <button className="cursor-pointer px-4 py-2 text-sm text-gray-700">
                      Date
                    </button>
                    <button className="block px-4 py-2 text-sm text-gray-700">
                      Checkbox
                    </button>
                    <button className="block px-4 py-2 text-sm text-gray-700">
                      Full Name
                    </button>
                    <button className="block px-4 py-2 text-sm text-gray-700">
                      Text
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setFileDropdownOpened(!fileDropdownOpened)}
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
                    <button
                      className="block px-4 py-2 text-sm text-gray-700"
                      onClick={handleDownload}
                    >
                      Download
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700"
                      onClick={handlePrint}
                    >
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
            <button
              onClick={openShareModal}
              className={
                shareLoading
                  ? "bg-transparent w-24 h-10 rounded border-2 border-primaryDark flex items-center justify-center"
                  : "bg-green-500 w-24 hover:bg-green-700 text-white font-bold h-10 rounded"
              }
            >
              {shareLoading ? <Loader /> : " Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex w-full justify-center items-center">
        <div className="relative w-full h-full">
          <div className="w-full flex justify-center">
            {loading ? (
              <div className="flex items-center justify-center gap-20 flex-col">
                <h1 className="text-xl font-bold font-sans">
                  Please Wait While PDF is being Loaded
                </h1>
                <SuspenseLoader />
              </div>
            ) : (
              pdfFile && (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div
                    ref={pdfViewerRef}
                    className="w-full border-[1.5px] sm:w-4/5 md:w-3/4 border-primaryDark rounded-md"
                  >
                    <div ref={printRef}>
                      <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="w-full"
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <div
                            key={`page_${index + 1}`}
                            className="my-2 flex justify-center"
                          >
                            <Page pageNumber={index + 1} width={pageWidth} />
                          </div>
                        ))}
                      </Document>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white w-4/5 sm:h-3/5 rounded-md shadow-md flex flex-col h-max justify-center p-6">
              <h2 className="text-xl font-bold mb-4">Share File</h2>
              <form onSubmit={handleFileShare} className="w-full z-20">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="shareEmail"
                    className="block mb-2 text-sm font-medium"
                  >
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    id="shareEmail"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Share Settings
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="shareLink"
                      checked={shareOptions.shareLink}
                      onChange={(e) =>
                        setShareOptions({
                          ...shareOptions,
                          shareLink: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="shareLink" className="text-sm">
                      Share Link
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="shareFile"
                      checked={shareOptions.shareFile}
                      onChange={(e) =>
                        setShareOptions({
                          ...shareOptions,
                          shareFile: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="shareFile" className="text-sm">
                      Share File
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editable"
                      checked={shareOptions.editable}
                      onChange={(e) =>
                        setShareOptions({
                          ...shareOptions,
                          editable: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="editable" className="text-sm">
                      Editable
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeShareModal}
                    className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-gray-600 bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primaryDark"
                  >
                    Share
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
