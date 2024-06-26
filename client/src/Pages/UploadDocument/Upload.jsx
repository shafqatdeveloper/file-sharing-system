import React from "react";
import { useParams } from "react-router-dom";
import Uploader from "../../Components/Uploader";

const Upload = () => {
  const { folderId } = useParams();
  return (
    <>
      <Uploader folderId={folderId} />
    </>
  );
};

export default Upload;
