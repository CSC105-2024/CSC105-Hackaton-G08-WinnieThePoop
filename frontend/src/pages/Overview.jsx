
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import next from "../assets/next.svg";
import prev1 from "../assets/prev1.svg";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const Overview = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().date());
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const renderCalendarCell = (date, currentMonth) => (
    <td
      key={`${date}-${currentMonth}`}
      className={`border-2 align-top h-20 sm:h-24 p-0.5 sm:p-1 text-xs ${
        currentMonth ? "text-black" : "text-gray-400"
      }`}
      onClick={() => currentMonth && setSelectedDate(date)}
    >
      <div
        className={`ml-1 font-semibold inline-block px-2 py-1 rounded-full ${
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
        <button onClick={handlePrevMonth}><img src={prev1} alt="prev" /></button>
        <h2 className="text-2xl font-bold font--poppins uppercase tracking-wide">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={handleNextMonth}><img src={next} alt="next" /></button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse w-full text-[10px] sm:text-sm md:text-base">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day} className="bg-[#e7f1a8] text-[10px] sm:text-sm md:text-base font-poppins font-medium text-black border-2 border-gray p-1 sm:p-2 w-[14.28%]">{day}</th>
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
                  {week.map(({ date, currentMonth }) => renderCalendarCell(date, currentMonth))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderMobileCalendar = () => (
    <>
      <div className="flex justify-start items-center gap-2 mb-2 bg-white p-2 rounded-lg">
        <button onClick={handlePrevMonth} ><img src={prev1} alt="prev" className="w-4 h-4" /></button>
        <h2 className="text-xl font-bold font-poppins tracking-wide">{currentDate.format("MMMM YYYY").toUpperCase()}</h2>
        <button onClick={handleNextMonth}><img src={next} alt="next" className="w-4 h-4" /></button>
      </div>
      <div className="overflow-x-auto bg-white ">
        <table className="table-fixed border-collapse w-full text-xs">
          <thead>
            <tr>
              {shortDaysOfWeek.map((day) => (
                <th key={day} className="bg-[#e7f1a8] font-poppins font-medium text-black border border-gray p-1 w-[14.28%]">{day}</th>
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
                       className={`border border-gray align-top h-12 p-0.5 text-xs relative cursor-pointer ${
                          !currentMonth ? "text-gray" : ""
                      }`}
                      onClick={() => currentMonth && setSelectedDate(date)}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <div
                          className={`inline-block rounded-full w-4 h-4 flex items-center justify-center ${
                            currentMonth && date === selectedDate ? "bg-[#FFDAA1]" : ""
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
      </div>
    </>
  );

  return (
    <div className="p-4 max-w-5xl mx-auto font-poppins relative">
      {isMobileView ? renderMobileCalendar() : renderDesktopCalendar()}
    </div>
  );
};

export default Overview;
