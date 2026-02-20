import React from "react";

const ImageCard = () => {
  return (
    <div className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 flex items-center justify-center min-h-[250px] sm:min-h-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-800">
      
      <button className=" text-[#fff] px-6 py-2 rounded-lg text-5xl font-bold hover:bg-white/10  transition-all duration-200">
        View Gallery
      </button>

    </div>
  );
};

export default ImageCard;