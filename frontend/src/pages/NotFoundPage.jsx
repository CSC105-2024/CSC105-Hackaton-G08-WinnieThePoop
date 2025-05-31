import React from "react";
import { useNavigate } from "react-router-dom";
import LogoS from "../assets/LogoS.svg";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F55EBB] px-4 md:px-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] h-auto md:h-[80vh] flex flex-col md:flex-row items-center md:items-center justify-between px-6 md:px-20 py-12">
        
        {/* รูปแบด */}
        <div className="w-full md:w-1/2 flex justify-center items-center md:items-center md:justify-center mb-10 md:mb-0">
          <img
            src={LogoS}
            alt="Badminton racket and shuttle"
            className="w-[180px] sm:w-[240px] md:w-[420px] h-auto rotate-[10deg]"
          />
        </div>

        {/* ข้อความและปุ่ม */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center">
          <h1 className="text-[72px] sm:text-[100px] md:text-[150px] font-poppins font-bold text-black leading-none mb-2">
            404
          </h1>
          <p className="text-lg sm:text-2xl font-poppins font-semibold text-black mb-2">
            PAGE NOT FOUND :(
          </p>
          <p className="text-gray-600 font-poppins text-base sm:text-lg mb-6">
            It seems like this page does not exist!
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-8 sm:px-10 py-3 bg-[#E7FAD9] border-2 border-black rounded-md hover:bg-[#d6f2c8] 
                      transition-all font-poppins font-bold text-lg"
          >
            HOME
          </button>
        </div>

      </div>
    </div>
  );
}

export default NotFoundPage;