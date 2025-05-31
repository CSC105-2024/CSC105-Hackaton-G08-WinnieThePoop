import React from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="font-poppins font-bold fixed inset-0 bg-gray-400/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 text-center w-65 h-38 sm:w-75 sm:h-35">
      <p className="text-[22px] mb-4">Are you sure ?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#FF9BDB] text-black text-[15px] rounded-md border-black border-2 hover:bg-[#F55EBB]"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#E6FFD7] text-black text-[15px] rounded-md border-black border-2 hover:bg-lime-200"
          >
            Yes
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
