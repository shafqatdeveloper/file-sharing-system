import React from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const PDFViewer = ({ file }) => {
  return (
    <div className="flex w-full justify-center items-center">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => console.log(numPages)}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
