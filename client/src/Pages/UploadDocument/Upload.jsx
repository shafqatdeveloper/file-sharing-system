import React from "react";
import { useParams } from "react-router-dom";
import Uploader from "../../Components/Uploader";

const Upload = () => {
  const { id } = useParams();
  return (
    <>
      <Uploader id={id} />
    </>
  );
};

export default Upload;
