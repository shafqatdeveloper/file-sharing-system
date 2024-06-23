// src/pdf-worker.js
import { pdfjs } from "react-pdf";

// The path to the worker script
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
