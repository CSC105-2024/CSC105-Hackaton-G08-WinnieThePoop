import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmLogout({onClose }) {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className={`bg-white border-3 p-10 rounded-lg shadow-lg font-poppins text-center w-full max-w-md relative ${
            isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
            {/* Title */}
            <h2 className="text-xl font-poppins font-bold mb-4">Are you sure?</h2>
            <h3 className="text-sm font-poppins font-bold mb-4">Please don't go!</h3>

            {/* Action Buttons */}
            <div className="flex justify-between items-center w-full mt-2 gap-4">
            {/* Cancel button */}
            <button 
                onClick={closeModal} 
                className="text-sm font-black px-4 py-1 sm:px-4 sm:py-1 md:px-4 md:py-1 lg:px-4 lg:py-2 bg-gray-300 border-2 text-gray-600 
                rounded-lg hover:bg-gray-400 hover:scale-105 transition"
            >
                Cancel
            </button>

            {/* sign out */}
            <button 
                onClick={handleLogout} 
                className="text-sm font-black font-poppins px-4 py-1 sm:px-4 sm:py-1 md:px-4 md:py-1 lg:px-4 lg:py-2 bg-red-400 text-black 
                rounded-lg border-2 border-black hover:bg-red-600 hover:scale-105 transition"
            >
                Log out
            </button>

            {/* <button
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
          </button> */}
            

          </div>
                
        </div>
    </div>
  );
}

export default ConfirmLogout;