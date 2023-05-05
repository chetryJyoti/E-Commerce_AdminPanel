import ClipLoader from "react-spinners/ClipLoader";
import React from "react";

const Loader = ({loadingWhat}) => {
  return (
    <div className=" mt-8 flex flex-col justify-center items-center ">
      <h1>{loadingWhat}</h1>
      <ClipLoader size={50} color={"#123abc"} />
    </div>
  );
};

export default Loader;
