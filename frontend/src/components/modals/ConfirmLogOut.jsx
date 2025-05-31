import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cry from "../../assets/Poop/Cry.svg";

function ConfirmLogout({ onClose }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    // Check if the click is on the backdrop (not the modal content)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white border-3 p-7 rounded-lg shadow-lg font-poppins text-center w-65 h-50 sm:w-90 sm:h-45 relative ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from bubbling to backdrop
      >
        <img
          src={Cry}
          alt="Cry"
          className="absolute -top-18 sm:-top-20 -right-[-5px] w-25 h-25 sm:w-30 sm:h-30"
        />

        {/* Title */}
        <h2 className="text-xl font-poppins font-bold mb-3">Are you sure?</h2>
        <h3 className="text-[13px] font-poppins font-bold mb-5 text-honeyPot">Please don't go!</h3>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-honeyGold text-black text-[15px] rounded-md border-black border-3 hover:bg-[#FFE85B]"
          >
            Yes
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-poohShirt text-black text-[15px] rounded-md border-black border-3 hover:bg-[#FF5050]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogout;