import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon.svg";
import Hot from "../assets/Hot.svg";
import AddIcon from "../assets/AddIcon.svg";
import AddEditModal from "../components/modals/AddEdit";
import ConfirmDelete from "../components/modals/ConfirmDelete";
import DeleteIcon from "../assets/DeleteIcon.svg";
import EditIcon from "../assets/EditIcon.svg";
import prev1 from "../assets/prev1.svg";
import next from "../assets/next.svg";
import { addWeeks, subWeeks, format, startOfWeek, eachDayOfInterval, isSameWeek, parseISO } from "date-fns";
import Edit from "../components/modals/Edit";
import { useWindowSize } from '../components/hooks/useWindowSize';

const History = () => {
  const [poopings, setPoopings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPooping, setSelectedPooping] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const date = new Date();
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedDateElement, setSelectedDateElement] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ left: 0, width: 0 });
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(date, { weekStartsOn: 0 }));
  const currentMonth = format(new Date(currentWeekStart.getTime() + 3 * 86400000), "MMMM");
  
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: new Date(currentWeekStart.getTime() + 6 * 86400000),
  });

  const filteredPoopings = useMemo(() => {
  return poopings.filter((pooping) => {
    if (!pooping.RecordDate) return false;

    try {
      const poopingDate = format(parseISO(pooping.RecordDate), "yyyy-MM-dd");
      return poopingDate === selectedDate;
    } catch (error) {
      console.warn("Invalid date format in pooping:", pooping);
      return false;
    }
  });
}, [poopings, selectedDate]);


  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:3000/record", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data.records)) {
        setPoopings(data.records);
      } else {
        console.error("Expected data.records to be an array", data);
        setPoopings([data.records]);
      }
    } catch (error) {
      console.error("Error fetching records: ", error);
      setPoopings([]);
    }
  };

  useEffect(() => {
    fetchRecords();
}, [selectedDate]);

  const handleDateClick = (date, element) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setSelectedDateElement(element);
    updateBoxPosition(element);
  };

  const updateBoxPosition = (element) => {
    if (element && calendarRef.current) {
      const rect = element.getBoundingClientRect();
      const parentRect = calendarRef.current.getBoundingClientRect();
      setBoxPosition({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const isSelectedDateInView = selectedDate && isSameWeek(new Date(selectedDate), currentWeekStart);

  useEffect(() => {
    if (calendarRef.current && isSelectedDateInView) {
      const element = calendarRef.current.querySelector(`[data-date="${selectedDate}"]`);
      if (element) {
        updateBoxPosition(element);
        setSelectedDateElement(element);
      }
    } else {
      setSelectedDateElement(null);
    }
  }, [currentWeekStart, selectedDate, isSelectedDateInView]);

  useEffect(() => {
    const handleResize = () => {
      if (selectedDateElement) {
        updateBoxPosition(selectedDateElement);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedDateElement]);

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

  const handleAddNewPooping = (newPooping) => {
    const poopingWithDate = {
      ...newPooping,
      date: selectedDate,
      id: Math.max(...poopings.map((p) => p.id), 0) + 1,
    };
    setPoopings([...poopings, poopingWithDate]);
    handleCloseAddModal();
  };

  const handleEditPooping = () => {
    fetchRecords();
    setShowEditModal(false);
    setSelectedPooping(null);
};


  const handleDeletePooping = async () => {
  try {
    const response = await fetch(`http://localhost:3000/record/${deleteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete record');
    }
    setPoopings(poopings.filter((pooping) => pooping.RecordId !== deleteId));

    handleCloseDeleteModal();
  } catch (error) {
    console.error('Error deleting record:', error);
    alert('Failed to delete record, please try again.');
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6 font-poppins relative">
      <div className="flex items-center mb-6">
        <img src={BackIcon} alt="Back" className="w-7 h-7 mr-2 cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="text-[24px] font-bold">All pooping history</h1>
        <img src={Hot} alt="Hot" className="w-9 h-9 ml-3 cursor-pointer" />
      </div>

      {/* Weekly Calendar */}
      <div className="flex justify-center items-center flex-col font-poppins mb-6">
        <div className="text-center font-bold text-base sm:text-base md:text-lg lg:text-xl mb-2">
          {currentMonth.toUpperCase()}
        </div>
        <div className="flex items-center w-full justify-center">
          <button
            onClick={handlePrevWeek}
            className="p-2 sm:p-3 cursor-pointer hover:scale-105 hover:translate-x-[-5px] transition-all duration-200 flex-shrink-0 active:scale-95"
            aria-label="Previous Week"
          >
            <img src={prev1} alt="Previous Week" className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
          </button>

          <div
            ref={calendarRef}
            className="p-2 sm:p-4 relative mx-2 sm:mx-4 flex-1 max-w-[280px] sm:max-w-[320px] md:min-w-[390px] lg:min-w-[420px]"
          >
            {isSelectedDateInView && selectedDateElement && (
              <div
                className="absolute rounded-lg bg-babyblue blur-[4px] transition-all duration-300"
                style={{
                  left: `${boxPosition.left}px`,
                  width: "10%",
                  height: "60px",
                  top: "15%",
                  zIndex: -1,
                }}
              ></div>
            )}

            <div className="flex justify-center gap-4 sm:gap-2 md:gap-3 text-center font-bold">
              {weekDays.map((day, index) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isSelected = isSelectedDateInView && dateStr === selectedDate;

                return (
                  <div
                    key={index}
                    data-date={dateStr}
                    ref={(el) => isSelected && setSelectedDateElement(el)}
                    className={`cursor-pointer flex flex-col items-center p-1 w-6 sm:w-8 md:w-10 lg:w-12 ${isSelected ? "text-black" : ""} rounded transition-colors active:scale-95`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDateClick(day, e.currentTarget);
                    }}
                  >
                    <div className="text-[14px] sm:text-[14px] md:text-[16px]">{format(day, "EEE")}</div>
                    <div className="text-[16px] sm:text-[16px] md:text-[16px]">{format(day, "d")}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-2 sm:p-3 cursor-pointer hover:scale-105 hover:translate-x-[5px] transition-all duration-200 flex-shrink-0 active:scale-95"
            aria-label="Next Week"
          >
            <img src={next} alt="Next Week" className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
          </button>
        </div>
      </div>

      {/* Poopings List */}
      <div className="mt-6">
        {filteredPoopings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No records found for this date</div>
        ) : (
          filteredPoopings.map((pooping) => (
            <div
              key={pooping.id}
              className="bg-white border-2 border-black rounded-md p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <span className="text-black font-poppins text-lg font-medium">{pooping.RecordName}</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-black font-poppins text-lg">
                  {format(parseISO(pooping.RecordDate), "HH:mm")}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(pooping)}
                    className="p-2 hover:bg-[#FFF6BD] rounded transition-colors"
                  >
                    <img src={EditIcon} alt="edit" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(pooping.RecordId)}
                    className="p-2 hover:bg-[#FF9D9D] rounded transition-colors"
                  >
                    <img src={DeleteIcon} alt="delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

     {!isMobile && (
             <div className="fixed bottom-8 right-8 hidden sm:block md:block lg:block lg:h-30 lg:w-30 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-50">
               <img src={AddIcon} onClick={handleOpenAddModal} alt="Add Icon" />
             </div>
            )}
           

      {showAddModal && (
        <AddEditModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSave={handleAddNewPooping}
          isEditMode={false}
        />
      )}

      {showEditModal && (
        <Edit
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditPooping}
          initialData={selectedPooping}
        />
      )}

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