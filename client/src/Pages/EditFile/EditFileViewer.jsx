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
import "./EditFileViewer.css";
import { toast } from "react-toastify";
import Loader from "../../Components/Loaders/Loader";

const EditFileViewer = () => {
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
  // Getting Sender Id From Params
  const searchParams = new URLSearchParams(location.search);
  const senderId = searchParams.get("sender");
  const [sender, setSender] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareOption, setShareOption] = useState("sender");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [fileShareLoading, setFileShareLoading] = useState(false);

  // Function to handle modal opening
  const handleShareClick = () => {
    setModalOpen(true);
  };

  // Function to handle modal closing
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (pdfViewerRef.current) {
        const viewerWidth = pdfViewerRef.current.clientWidth;
        setPageWidth(viewerWidth * 0.75);
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

  //   Get Sender Details
  useEffect(() => {
    const fetchSenderDetails = async () => {
      try {
        const response = await axios.get(
          `/api/user/single/details/${senderId}`
        );
        setSender(response.data.singleUser);
      } catch (error) {
        console.error("Error fetching PDF file details:", error);
      }
    };
    fetchSenderDetails();
  }, []);

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

  // File Share Handler
  const handleFileShare = async (e) => {
    e.preventDefault();
    setModalOpen(false);
    setFileShareLoading(true);
    try {
      const response = await axios.post("/api/file/share/by-receiver", {
        fileId,
        email: shareOption === "sender" ? sender.email : receiverEmail,
        sendingBackToSender: shareOption === "sender" ? true : false,
      });
      if (response.data.success) {
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFileShareLoading(false);
    }
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
              onClick={handleShareClick}
              disabled={fileShareLoading ? true : false}
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-20 h-10 rounded"
            >
              {fileShareLoading ? <Loader /> : "Share"}
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div className={modalOpen ? "Overlay z-50" : "hidden"}>
        <div className="Modal w-[80%] sm:w-2/3 z-50 shadow-md shadow-black/40 flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold font-sans">Share File To</h2>
          <div>
            <div className="flex flex-col no-select gap-1">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="shareOption"
                  value="sender"
                  checked={shareOption === "sender"}
                  onChange={() => setShareOption("sender")}
                />
                Sender
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="shareOption"
                  value="other"
                  checked={shareOption === "other"}
                  onChange={() => setShareOption("other")}
                />
                Other
              </label>
            </div>
            {shareOption === "sender" ? (
              <div>
                <h1 className="text-sm my-5">
                  <span>Sender: </span>{" "}
                  <strong className="text-lg">
                    {sender?.fName} {sender?.lName}{" "}
                  </strong>
                </h1>
                <div className="flex items-center justify-center">
                  <button
                    disabled={!sender?.email ? true : false}
                    onClick={handleFileShare}
                    className="bg-primaryDark text-white px-4 py-1 rounded-md"
                  >
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="border-[1px] w-72 p-1 my-5 border-primaryDark rounded-md">
                  <input
                    required
                    type="email"
                    name=""
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    placeholder="Enter Receiver Email"
                    className="w-full outline-none focus:outline-none"
                    id=""
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleFileShare}
                    disabled={receiverEmail === "" ? true : false}
                    className="bg-primaryDark text-white px-4 py-1 rounded-md"
                  >
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={closeModal}
            className="bg-red-500 px-3.5 py-1 text-white rounded-md"
          >
            Close
          </button>
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
                        <div className="my-2 flex justify-center">
                          <Page pageNumber={pageNumber} width={pageWidth} />
                        </div>
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

export default EditFileViewer;
