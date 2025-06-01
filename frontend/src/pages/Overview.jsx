import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import next from "../assets/next.svg";
import prev1 from "../assets/prev1.svg";
import Please from "../assets/Poop/Please.svg";
import Good from "../assets/Poop/Good.svg";
import Sus from "../assets/Poop/Sus.svg";
import GoSeeDoc from "../assets/Poop/GoSeeDoc.svg";
import AddEditModal from "../components/modals/AddEdit.jsx";
import AddIcon from "../assets/AddIcon.svg";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const Overview = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().date());
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateStatuses, setDateStatuses] = useState({});
  const [recordCounts, setRecordCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  const fetchMonthData = async () => {
    setLoading(true);
    try {
      const yearMonth = currentDate.format("YYYY-MM");
      const daysInMonth = currentDate.daysInMonth();

      const statusPromises = [];
      const countPromises = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${yearMonth}-${day.toString().padStart(2, "0")}`;
        statusPromises.push(fetchStatus(date));
        countPromises.push(fetchRecordCount(date));
      }

      const statusResults = await Promise.all(statusPromises);
      const countResults = await Promise.all(countPromises);

      const newStatuses = {};
      const newCounts = {};

      statusResults.forEach((result, index) => {
        const date = `${yearMonth}-${(index + 1).toString().padStart(2, "0")}`;
        if (result) newStatuses[date] = result;
      });

      countResults.forEach((count, index) => {
        const date = `${yearMonth}-${(index + 1).toString().padStart(2, "0")}`;
        newCounts[date] = count;
      });

      setDateStatuses(newStatuses);
      setRecordCounts(newCounts);
    } catch (error) {
      console.error("Error fetching month data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:3000/record/status/${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.status; 
    } catch (error) {
      console.error("Error fetching status:", error);
      return null;
    }
  };

  const fetchRecordCount = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:3000/record/count/${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) return 0;
      const data = await response.json();

      return data.count; 
    } catch (error) {
      console.error("Error fetching record count:", error);
      return 0;
    }
  };

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const daysInPrevMonth = currentDate.subtract(1, "month").daysInMonth();

  const getCalendarDays = () => {
    let days = [];
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, currentMonth: true });
    }
    while (days.length % 7 !== 0) {
      days.push({
        date: days.length - (startDay + daysInMonth) + 1,
        currentMonth: false,
      });
    }
    return days;
  };
  const getStatusColor = (date) => {
    const dateString = currentDate.date(date).format("YYYY-MM-DD");
    const todayString = currentDate.format("YYYY-MM-DD");

    if (dateString > todayString) return "bg-gray-200";

    const status = dateStatuses[dateString];

    switch (status) {
      case "Normal":
        return "bg-[#C4F5C6]";
      case "Abnormal":
        return "bg-[#FF6D6D]";
      case "Worrisome":
        return "bg-[#FFF19C]";
      default:
        return "bg-gray-500";
    }
  };

  const getBoxColor = () => {
    const selectedDay = currentDate.date(selectedDate).format("YYYY-MM-DD");
    const status = dateStatuses[selectedDay];
    const recordCount = recordCounts[selectedDay] ?? 0;

    if (recordCount === 0) return "bg-gray-500";

    switch (status) {
      case "Normal":
        return "bg-[#C4F5C6]";
      case "Abnormal":
        return "bg-[#FF6D6D]";
      case "Worrisome":
        return "bg-[#FFF19C]";
      default:
        return "bg-gray-500";
    }
  };

  const getLatestStatus = () => {
    const selectedDay = currentDate.date(selectedDate).format("YYYY-MM-DD");
    const status = dateStatuses[selectedDay];
    const recordCount = recordCounts[selectedDay] ?? 0;

    if (recordCount === 0) {
      return {
        text: "Have you poop yet, Please tell us😔",
        icon: Please,
      };
    }

    switch (status) {
      case "Normal":
        return {
          text: "Everything is okay, Keep do it! 😛",
          icon: Good,
        };
      case "Abnormal":
        return {
          text: "You should go see a doctor!",
          icon: GoSeeDoc,
        };
      case "Worrisome":
        return {
          text: "Hmmm, Interesting... 🤔",
          icon: Sus,
        };
      default:
        return {
          text: "Have you poop yet, Please tell us😔",
          icon: Please,
        };
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddNewPooping = async (newPooping) => {
    try {
      const response = await fetch("http://localhost:3000/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newPooping,
          date: currentDate.date(selectedDate).format("YYYY-MM-DD"),
        }),
      });

      if (!response.ok) throw new Error("Failed to add record");

      // Refresh data after successful addition
      await fetchMonthData();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding new record:", error);
    }
  };

  const { text: displayedText, icon: statusIcon } = getLatestStatus();

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
    setSelectedDate(1);
  };

  const renderCalendarCell = (date, currentMonth) => (
    <td
      key={`${date}-${currentMonth}`}
      className={`border-2 align-top h-20 sm:h-24 p-0.5 sm:p-1 text-base relative ${
        currentMonth ? "text-black" : "text-gray"
      }`}
      onClick={() => currentMonth && setSelectedDate(date)}
    >
      {currentMonth && (
        <div
          className={`absolute top-9 left-0 w-full h-5 ${getStatusColor(date)}`}
        ></div>
      )}
      <div
        className={`ml-1 font-bold inline-block px-2 py-1 rounded-full ${
          currentMonth && date === selectedDate ? "bg-[#FFDAA1]" : ""
        }`}
      >
        {date}
      </div>
    </td>
  );

  const renderDesktopCalendar = () => (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <button onClick={handlePrevMonth}>
          <img src={prev1} alt="prev" />
        </button>
        <h2 className="text-2xl font-bold font-poppins uppercase tracking-wide">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button onClick={handleNextMonth}>
          <img src={next} alt="next" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse w-full text-[10px] sm:text-sm md:text-base">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="bg-[#CFE6F6] text-[15px] sm:text-sm md:text-base font-poppins font-bold border-2 border-gray p-1 sm:p-2 w-[14.28%]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCalendarDays()
              .reduce((rows, day, index) => {
                if (index % 7 === 0) rows.push([]);
                rows[rows.length - 1].push(day);
                return rows;
              }, [])
              .map((week, i) => (
                <tr key={i}>
                  {week.map(({ date, currentMonth }) =>
                    renderCalendarCell(date, currentMonth)
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex flex-col lg:flex-row justify-around items-center mt-10 gap-6 lg:gap-0">
          <div className="order-1 lg:order-2 w-full max-w-xl">
            <div
              className={`text-2xl font-bold text-center border-4 w-full h-24 rounded-lg flex items-center justify-center px-4 transition-colors duration-300 ${getBoxColor()}`}
            >
              {displayedText}
            </div>
          </div>
          <div className="order-2 lg:order-1">
            <img src={statusIcon} alt="Status Icon" className="w-32 sm:w-36" />
          </div>
        </div>
      </div>
    </>
  );

  const renderMobileCalendar = () => (
    <>
      <div className="flex justify-start items-center gap-2 mb-2 bg-white p-2 rounded-lg">
        <button onClick={handlePrevMonth}>
          <img src={prev1} alt="prev" className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold font-poppins tracking-wide">
          {currentDate.format("MMMM YYYY").toUpperCase()}
        </h2>
        <button onClick={handleNextMonth}>
          <img src={next} alt="next" className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto bg-white">
        <table className="table-fixed border-collapse w-full text-xs">
          <thead>
            <tr>
              {shortDaysOfWeek.map((day) => (
                <th
                  key={day}
                  className="bg-[#CFE6F6] font-poppins text-black border-2 border-gray p-1 w-[14.28%]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCalendarDays()
              .reduce((rows, day, index) => {
                if (index % 7 === 0) rows.push([]);
                rows[rows.length - 1].push(day);
                return rows;
              }, [])
              .map((week, i) => (
                <tr key={i}>
                  {week.map(({ date, currentMonth }) => (
                    <td
                      key={`mobile-${date}-${currentMonth}`}
                      className={`border-2 border-gray align-top h-12 p-0.5 text-xs font-poppins relative cursor-pointer ${
                        !currentMonth ? "text-gray" : ""
                      }`}
                      onClick={() => currentMonth && setSelectedDate(date)}
                    >
                      {currentMonth && (
                        <div
                          className={`absolute top-1 left-0 w-full h-2 ${getStatusColor(
                            date
                          )}`}
                        ></div>
                      )}
                      <div className="flex flex-col items-center justify-center h-full">
                        <div
                          className={`inline-block px-1 rounded-full w-4 h-4 flex items-center justify-center ${
                            currentMonth && date === selectedDate
                              ? "bg-[#FFDAA1]"
                              : ""
                          }`}
                        >
                          {date}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex flex-col items-center justify-center mt-6 gap-4 px-2">
          <div
            className={`text-lg sm:text-xl font-bold text-center border-4 border-black w-full max-w-xs sm:max-w-sm md:max-w-md h-20 sm:h-24 rounded-lg flex items-center justify-center px-2 transition-colors duration-300 ${getBoxColor()}`}
          >
            {displayedText}
          </div>
          <img src={statusIcon} alt="Status Icon" className="w-24 sm:w-28" />
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto font-poppins flex justify-center items-center h-screen">
        <div className="text-xl">Loading calendar data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto font-poppins relative">
      {isMobileView ? renderMobileCalendar() : renderDesktopCalendar()}
      <div className="fixed bottom-8 right-8 hidden sm:block md:block lg:block lg:h-30 lg:w-30 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-50">
        <img src={AddIcon} onClick={handleOpenAddModal} alt="Add Icon" />
      </div>
      {/* Add Modal */}
      {showAddModal && (
        <AddEditModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSave={handleAddNewPooping}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default Overview;