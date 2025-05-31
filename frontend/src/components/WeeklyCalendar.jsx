import React, { useState, useRef, useEffect } from 'react';
import { addWeeks, subWeeks, format, startOfWeek, eachDayOfInterval, isSameWeek } from 'date-fns';
import prev1 from '../assets/prev1.svg';
import next from '../assets/next.svg';
import History from '../pages/History';

const WeeklyCalendar = ({ selectedDate, onDateSelect }) => {
  const date = new Date();
  const calendarRef = useRef(null);
  const [selectedDateElement, setSelectedDateElement] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ left: 0, width: 0 });
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(date, { weekStartsOn: 0 }));
  const currentMonth = format(new Date(currentWeekStart.getTime() + 3 * 24 * 60 * 60 * 1000), 'MMMM');
  const [loading] = useState(false);

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000) 
  });

  const handleDateClick = (date, element) => {
    onDateSelect(format(date, 'yyyy-MM-dd'));
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
      const element = calendarRef.current.querySelector(
        `[data-date="${selectedDate}"]`
      );
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDateElement]);

  return (
    <div className="flex justify-center items-center flex-col font-poppins">
      <div className="text-center font-bold text-base sm:text-base md:text-lg lg:text-xl mb-2">
        {currentMonth.toUpperCase()}
      </div>
      <div className="flex items-center">
        <button onClick={handlePrevWeek} className="p-2 cursor-pointer hover:scale-105 hover:translate-x-[-5px] transition-all duration-200">
          <img src={prev1} alt="Previous Week" className='w-[20px] h-[20px]'/>
        </button>
        
        <div ref={calendarRef} className="p-4 relative mx-4 md:min-w-[390px] lg:min-w-[420px]">
          {isSelectedDateInView && selectedDateElement && (
            <div
              className="absolute rounded-lg bg-primary blur-[4px] transition-all duration-300 "
              style={{
                left: `${boxPosition.left}px`,
                width: '12%',
                height: '60px',
                top: '15%',
                zIndex: -1,
              }}
            ></div>
          )}

          <div className="flex justify-center gap-3 text-center font-bold">
            {weekDays.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSelectedDateInView && dateStr === selectedDate;

              return (
                <div
                  key={index}
                  data-date={dateStr}
                  className={`cursor-pointer flex flex-col items-center p-1 w-8 sm:w-9 md:w-10 lg:w-12 ${isSelected ? 'text-black' : ''}`}
                  onClick={(e) => handleDateClick(day, e.currentTarget)}
                >
                  <div className="text-[16px]">{format(day, 'EEE')}</div>
                  <div className="text-[16px]">{format(day, 'd')}</div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleNextWeek} className="p-2 cursor-pointer hover:scale-105 hover:translate-x-[5px] transition-all duration-200">
          <img src={next} alt="Next Week" className='w-[20px] h-[20px]'/>
        </button>
      </div>

      {/* Task List */}
      {loading && <div>Loading tasks...</div>}
      {selectedDate && (
        <div className=" -mt-2 md:mt-2 lg:mt-3 w-full">
          <History selectedDate={selectedDate} />
        </div>
      )}
    </div>
  )
};

export default WeeklyCalendar;