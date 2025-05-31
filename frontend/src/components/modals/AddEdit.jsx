import React, { useState } from "react";
import close from '../../assets/Close.svg';
import LogoBorderS from '../../assets/LogoBorderS.svg';
import DropdownIcon from '../../assets/DropdownIcon.svg'
import axios from "axios";

const AddTask = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showTextureDropdown, setShowTextureDropdown] = useState(false);
  
  const token = localStorage.getItem("token");

  // Color
  const colors = [
    { value: "brown", label: "Brown" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "black", label: "Black" },
    { value: "gray", label: "Gray" },
  ];

  // Texture
  const textures = [
    { value: "separate hard lumps", label: "Separate hard lumps" },
    { value: "sausage shape with cracks surface", label: "Sausage shape with cracks surface" },
    { value: "soft blobs with clear-cut edges", label: "Soft blobs with clear-cut edges" },
    { value: "mushy consistency with ragged edges", label: "Mushy consistency with ragged edges" },
    { value: "liquid consistency with no solid pieces", label: "Liquid consistency with no solid pieces" },
  ];

  const saveTask = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Get existing tasks to count today's entries
      const responseCount = await axios.get(
        "http://localhost:3000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Count tasks created today
      const todayTasks = responseCount.data.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === today;
      });
      
      // Generate default title if empty
      const taskTitle = title.trim() || `Poop ${todayTasks.length + 1}`;

      const response = await axios.post(
        "http://localhost:3000/api/tasks",
        {
          Task_Title: taskTitle,
          Task_Description: description,
          Task_Color: selectedColor,
          Task_Texture: selectedTexture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear form after successful save
      setTitle("");
      setDescription("");
      setSelectedColor("");
      setSelectedTexture("");
      
      // Call callback function to close modal and update parent component
      if (onSave) {
        onSave(response.data);
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error("Error saving task:", JSON.stringify(error.response?.data, null, 2));
      alert("Failed to save task.");
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Function to save data and close modal
  const handleSave = () => {
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

  // Handle overlay click to close modal (don't save data)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div 
      className="fixed inset-0 bg-black bg-gray-400/40 flex items-center justify-center z-50 p-10 sm:p-4 overflow-hidden"
      onClick={handleOverlayClick}
    >
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-auto"
           onClick={(e) => e.stopPropagation()}>
        <div className="text-black-900 p-6">
          {/*Close Button*/}
          <div className="flex items-center justify-end">
            <img
              className="w-6 h-6 object-contain cursor-pointer"
              src={close}
              alt="close"
              onClick={handleClose}
            />
          </div>

          {/* Main Form */}
          <div className="w-full">
            {/* Logo */}
            <div className="flex justify-center ">
              <img
                src={LogoBorderS}
                alt="LogoBorderS"
                className="w-25 h-25 object-contain"
              />
            </div>

            {/* Title */}
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

            {/* Color and Texture Dropdowns - Side by Side */}
            <div className="flex gap-4 mb-4 font-poppins">
              {/* Color Dropdown */}
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

              {/* Texture Dropdown */}
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

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-poppins font-bold block mb-2">DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 text-sm font-poppins font-reg border p-3 border-black border-[1.5px] rounded-xl placeholder:text-[#A7A7A7] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Your description"
              ></textarea>
            </div>

            {/* Save and Cancel Buttons */}
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

export default AddTask;
