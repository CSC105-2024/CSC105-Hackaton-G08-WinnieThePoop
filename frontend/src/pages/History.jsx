import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon.svg";
import Hot from "../assets/Hot.svg";
import AddIcon from "../assets/AddIcon.svg";
import AddEditModal from "../components/modals/AddEdit";
import ConfirmDelete from "../components/modals/ConfirmDelete";
import DeleteIcon from "../assets/DeleteIcon.svg";
import EditIcon from "../assets/EditIcon.svg";
import WeeklyCalendar from '../components/WeeklyCalendar.jsx';
import { format } from 'date-fns';

const mockPoopings = [
  {
    id: 4,
    name: "04",
    time: "12:00",
  },
  {
    id: 3,
    name: "03",
    time: "10:30",
  },
  {
    id: 2,
    name: "02",
    time: "08:30",
  },
  {
    id: 1,
    name: "01",
    time: "02:00",
  },
];

const History = () => {
  const [poopings, setPoopings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPooping, setSelectedPooping] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      return format(new Date(), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date formatting error:', error);
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setPoopings(mockPoopings);
    } catch (error) {
      console.error('Error setting poopings:', error);
    }
  }, []);

  // Handle date selection with error handling
  const handleDateSelect = (date) => {
    try {
      setSelectedDate(date);
    } catch (error) {
      console.error('Error selecting date:', error);
    }
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleOpenEditModal = (pooping) => {
    setSelectedPooping(pooping);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPooping(null);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // save new data
  const handleAddNewPooping = (newPooping) => {
    setPoopings([...poopings, newPooping]);
    handleCloseAddModal();
  };

  // save edited data
  const handleEditPooping = (editedPooping) => {
    setPoopings(poopings.map(pooping => 
      pooping.id === editedPooping.id ? editedPooping : pooping
    ));
    handleCloseEditModal();
  };

  // Delete pooping entry
  const handleDeletePooping = () => {
    setPoopings(poopings.filter(pooping => pooping.id !== deleteId));
    handleCloseDeleteModal();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-poppins relative">
      <div className="flex items-center mb-6">
        <img
          src={BackIcon}
          alt="Back"
          className="w-7 h-7 mr-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-bold">All pooping history</h1>
        <img
          src={Hot}
          alt="Hot"
          className="w-7 h-7 ml-2 cursor-pointer"
        />
      </div>

      <div className="h-[80vh] w-full overflow-y-auto overflow-x-hidden scrollbar-medium scrollbar-thumb-graycancle scrollbar-track-gray">
        {/* WeeklyCalendar component with error boundary */}
        {selectedDate && (
          <WeeklyCalendar 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect}
          />
        )}

        {/* Pooping entries list */}
        <div className="mt-6">
          {poopings.map((pooping) => (
            <div
              key={pooping.id}
              className="bg-white border-2 border-black rounded-md p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <span className="text-black font-poppins text-lg font-medium">
                  {pooping.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-black font-poppins text-lg">
                  {pooping.time}
                </span>
                <div className="flex items-center space-x-2">
                  {/* Edit Icon */}
                  <button
                    onClick={() => handleOpenEditModal(pooping)}
                    className="p-2 hover:bg-[#FFF6BD] rounded transition-colors"
                  >
                    <img src={EditIcon} alt="edit" className="w-6 h-6" />
                  </button>
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleOpenDeleteModal(pooping.id)}
                    className="p-2 hover:bg-[#FF9D9D] rounded transition-colors"
                  >
                    <img src={DeleteIcon} alt="delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button - Hidden on mobile */}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-[60px] right-[76px] flex hover:scale-105 transition-transform cursor-pointer hidden md:flex"
      >
        <img src={AddIcon} alt="add" className="w-20 h-20" />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <AddEditModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSave={handleAddNewPooping}
          isEditMode={false}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <AddEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleEditPooping}
          isEditMode={true}
          initialData={selectedPooping}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmDelete
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeletePooping}
        />
      )}
    </div>
  );
};

export default History;