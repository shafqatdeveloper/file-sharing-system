import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const PDFViewer = ({ file }) => {
  const [width, setWidth] = useState(600);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const viewerWidth = document.getElementById("pdf-viewer").clientWidth;
      setWidth(viewerWidth);
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

  return (
    <div
      id="pdf-viewer"
      className="flex w-[95%] sm:w-3/4 justify-center items-center border-[1.5px] border-primaryDark rounded-md flex-col"
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            className={"py-1 rounded-md"}
            pageNumber={index + 1}
            width={width}
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
