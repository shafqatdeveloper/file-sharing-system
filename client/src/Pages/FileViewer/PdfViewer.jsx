import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SuspenseLoader from "../../Components/Loaders/SuspenseLoader";
import { Document, Page } from "react-pdf";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

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
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);

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
    documentTitle: "",
    pageStyle: () => "@page { size: auto; margin: 10mm; }",
  });

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
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Share
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
                  <div className="flex justify-center gap-5 py-5">
                    <button
                      className="p-2 rounded-full bg-gray-200"
                      onClick={() => setPageNumber(pageNumber - 1)}
                      disabled={pageNumber === 1}
                    >
                      <AiOutlineArrowLeft />
                    </button>
                    <button
                      className="p-2 rounded-full bg-gray-200"
                      onClick={() => setPageNumber(pageNumber + 1)}
                      disabled={pageNumber === numPages}
                    >
                      <AiOutlineArrowRight />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
