import React from "react";
import Delete from "../../assets/Poop/Delete.svg";

const ConfirmModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="font-poppins font-bold fixed inset-0 bg-gray-400/40 flex items-center justify-center z-50"
      onClick={handleOverlayClick}  
    >
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 text-center w-65 h-50 sm:w-75 sm:h-52 relative">
        <div className="flex justify-center -mt-10 mb-2">
          <img
            src={Delete}
            alt="Delete"
            className="w23 h-23 mt-[3px] mr-5"
          />
        </div>

        <p className="text-[22px] mb-4">Are you sure ?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-honeyGold text-black text-[15px] rounded-md border-black border-2 hover:bg-[#FFE85B]"
          >
            Yes
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-poohShirt text-black text-[15px] rounded-md border-black border-2 hover:bg-[#FF5050]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;