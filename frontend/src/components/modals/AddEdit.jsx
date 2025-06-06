import React, { useState } from "react";
import close from '../../assets/Close.svg';
import LogoBorderS from '../../assets/LogoBorderS.svg';
import DropdownIcon from '../../assets/DropdownIcon.svg'
import axios from "axios";

const AddEdit = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showTextureDropdown, setShowTextureDropdown] = useState(false);
  
  const token = localStorage.getItem("token");

  // Color options - Updated to match Prisma enum values
  const colors = [
    { value: "Brown", label: "Brown" },
    { value: "Yellow", label: "Yellow" },
    { value: "Green", label: "Green" },
    { value: "Red", label: "Red" },
    { value: "Black", label: "Black" },
    { value: "Gray", label: "Gray" },
  ];

  // Texture options - Updated to match Prisma enum values
  const textures = [
    { value: "HardLump", label: "Separate hard lumps" },
    { value: "Sausage", label: "Sausage shape with cracks surface" },
    { value: "SoftBlob", label: "Soft blobs with clear-cut edges" },
    { value: "Mushy", label: "Mushy consistency with ragged edges" },
    { value: "Liquid", label: "Liquid consistency with no solid pieces" },
  ];

  const saveTask = async () => {
    try {
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const today = new Date().toISOString();
      
      let todayRecordCount = 0;
      
      try {
        const responseCount = await axios.get(
          "http://localhost:3000/record",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Fetch records response:", responseCount.data);
        
        const records = responseCount.data.records || responseCount.data || [];

        const todayDateOnly = new Date().toISOString().split('T')[0];
        const todayRecord = records.filter(record => {
          const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
          return recordDate === todayDateOnly;
        });
        
        todayRecordCount = todayRecord.length;
      } catch (fetchError) {
        console.warn("Could not fetch existing records for counting:", fetchError);
      }
      const recordName = title.trim() || `Poop ${todayRecordCount + 1}`;

      const payload = {
        RecordName: recordName,
        RecordDescription: description,
        RecordColor: selectedColor,
        RecordTexture: selectedTexture,
        RecordStatus: "Normal"
      };

      console.log("Creating record with payload:", payload);

      const response = await axios.post(
        "http://localhost:3000/record",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Create record response:", response.data);

      setTitle("");
      setDescription("");
      setSelectedColor("");
      setSelectedTexture("");
      
      if (onSave) {
        onSave(response.data.record || response.data);
      }
      
      onClose();
      
    } catch (error) {
      console.error("Full error object:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        const errorMessage = error.response.data?.error || error.response.data?.message || "Server error occurred";
        alert(`Failed to save record: ${errorMessage}`);
      } else if (error.request) {
        
        console.error("Error request:", error.request);
        alert("Failed to save record: No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to save record: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {

    if (!selectedColor || !selectedTexture) {
      alert("Please select both color and texture.");
      return;
    }
    saveTask();
  };

  const toggleColorDropdown = () => {
    setShowColorDropdown(!showColorDropdown);
    setShowTextureDropdown(false);
  };

  const toggleTextureDropdown = () => {
    setShowTextureDropdown(!showTextureDropdown);
    setShowColorDropdown(false);
  };

  const selectColor = (color) => {
    setSelectedColor(color.value);
    setShowColorDropdown(false);
  };

  const selectTexture = (texture) => {
    setSelectedTexture(texture.value);
    setShowTextureDropdown(false);
  };

  const getSelectedColorObject = () => {
    return colors.find(color => color.value === selectedColor);
  };

  const getSelectedTextureObject = () => {
    return textures.find(texture => texture.value === selectedTexture);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-gray-400/40 flex items-center justify-center z-50 p-10 sm:p-4 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-auto"
           onClick={(e) => e.stopPropagation()}>
        <div className="text-black-900 p-6">
          <div className="flex items-center justify-end">
            <img
              className="w-6 h-6 object-contain cursor-pointer"
              src={close}
              alt="close"
              onClick={handleClose}
            />
          </div>

          <div className="w-full">
            <div className="flex justify-center ">
              <img
                src={LogoBorderS}
                alt="LogoBorderS"
                className="w-25 h-25 object-contain"
              />
            </div>

            <div className="mb-4 font-poppins">
              <p className="text-sm font-poppins font-bold mb-2">NAME</p>
              <input
                type="text"
                placeholder="What is your poop name?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg text-sm border-[1.5px] border-black placeholder:text-[#A7A7A7] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 mb-4 font-poppins">
              <div className="flex-1">
                <p className="text-sm font-poppins font-bold mb-2">COLOR</p>
                <div className="relative text-left">
                  <div
                    className="w-full p-3 rounded-lg border-[1.5px] border-black cursor-pointer flex items-center justify-between hover:bg-gray-50"
                    onClick={toggleColorDropdown}
                  >
                    <span className={`font-poppins text-sm ${selectedColor ? "text-black" : "text-[#A7A7A7]"}`}>
                      {selectedColor ? getSelectedColorObject()?.label : "Select Color"}
                    </span>
                    <img className="w-5 h-5" src={DropdownIcon} alt="Color dropdown" />
                  </div>
                  {showColorDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 text-gray-700 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-48 overflow-auto">
                      <div className="py-1">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => selectColor(color)}
                          >
                            {color.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-poppins font-bold mb-2">TEXTURE</p>
                <div className="relative">
                  <div
                    className="w-full p-3 rounded-lg border-[1.5px] border-black cursor-pointer flex items-center justify-between hover:bg-gray-50"
                    onClick={toggleTextureDropdown}
                  >
                    <span className={`font-poppins text-sm ${selectedTexture ? "text-black" : "text-[#A7A7A7]"}`}>
                      {selectedTexture ? getSelectedTextureObject()?.label : "Select Texture"}
                    </span>
                    <img className="w-5 h-5" src={DropdownIcon} alt="Texture dropdown" />
                  </div>
                  {showTextureDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 text-gray-700 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-48 overflow-auto">
                      <div className="py-1">
                        {textures.map((texture) => (
                          <button
                            key={texture.value}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 gap-1"
                            onClick={() => selectTexture(texture)}
                          >
                            {texture.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-poppins font-bold block mb-2">DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 text-sm font-poppins font-reg border p-3 border-black border-[1.5px] rounded-xl placeholder:text-[#A7A7A7] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Your description"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-[#FF6D6D] text-black text-sm rounded-md border-black border-2 hover:bg-[#FF5050] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#FFF19C] text-black text-sm rounded-md border-black border-2 hover:bg-[#FFE85B] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEdit;