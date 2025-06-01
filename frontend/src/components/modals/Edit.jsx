import React, { useState, useEffect } from "react";
import close from '../../assets/Close.svg';
import LogoBorderS from '../../assets/LogoBorderS.svg';
import DropdownIcon from '../../assets/DropdownIcon.svg';
import axios from "axios";

const Edit = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showTextureDropdown, setShowTextureDropdown] = useState(false);

  const token = localStorage.getItem("token");

  const colors = [
    { value: "Brown", label: "Brown" },
    { value: "Yellow", label: "Yellow" },
    { value: "Green", label: "Green" },
    { value: "Red", label: "Red" },
    { value: "Black", label: "Black" },
    { value: "Gray", label: "Gray" },
  ];

  const textures = [
    { value: "HardLump", label: "Separate hard lumps" },
    { value: "Sausage", label: "Sausage shape with cracks surface" },
    { value: "SoftBlob", label: "Soft blobs with clear-cut edges" },
    { value: "Mushy", label: "Mushy consistency with ragged edges" },
    { value: "Liquid", label: "Liquid consistency with no solid pieces" },
  ];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.RecordName || "");
      setDescription(initialData.RecordDescription || "");
      setSelectedColor(initialData.RecordColor || "");
      setSelectedTexture(initialData.RecordTexture || "");
    }
  }, [initialData]);

  const updateTask = async () => {
    try {
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const payload = {
        RecordName: title.trim(),
        RecordDescription: description,
        RecordColor: selectedColor,
        RecordTexture: selectedTexture,
      };

      const response = await axios.put(
        `http://localhost:3000/record/${initialData.RecordId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (onSave) {
        onSave(response.data.record || response.data);
      }

      onClose();

    } catch (error) {
      console.error("Error updating record:", error);
      const message =
        error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Failed to update record: ${message}`);
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
    updateTask();
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
    return colors.find((c) => c.value === selectedColor);
  };

  const getSelectedTextureObject = () => {
    return textures.find((t) => t.value === selectedTexture);
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
            <div className="flex justify-center">
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
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => selectColor(color)}
                        >
                          {color.label}
                        </button>
                      ))}
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
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                      {textures.map((texture) => (
                        <button
                          key={texture.value}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          onClick={() => selectTexture(texture)}
                        >
                          {texture.label}
                        </button>
                      ))}
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

export default Edit;
