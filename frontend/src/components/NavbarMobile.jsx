import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import homeIcon from "../assets/HomeIcon.svg";
import profileIcon from "../assets/ProfileIcon.svg";
import CalendarIcon from "../assets/CalendarIcon.svg";
import HistoryIcon from "../assets/HistoryIcon.svg";
import AddIcon from "../assets/AddIcon.svg";


function NavbarMobile() {
    // const handleAddEditClick =()=>{
    //     setSelctedAdd();
    // }
  return (
    <div className="flex flex-col items-center w-full">
      {/* Bottom Navigation Bar */}
      <div className="fixed bg-white bottom-0 w-full h-20 bg-primary shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] z-10 border-3">
        <div className="flex justify-around w-full items-center h-full px-2">
          {/* Home Button */}
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `p-2 rounded-full transition-all ${
                isActive ? "bg-honeyGold" : "bg-white"
              }`
            }
          >
            <img
              src={homeIcon}
              alt="Home"
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
          </NavLink>

          {/* History Button */}
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `p-2 rounded-full transition-all ${
                isActive ? "bg-honeyGold" : "bg-white"
              }`
            }
          >
            <img
              src={HistoryIcon}
              alt="history"
              className="w-11 h-11  sm:w-12 sm:h-12 md:w-15 md:h-15"
            />
          </NavLink>

          {/* Add Button */}
          <NavLink
            to="/addEdit"
            className={({ isActive }) =>
              `p-2 rounded-full transition-all ${
                isActive ? "bg-honeyGold" : "bg-white"
              }`
            }
          >
            <img
              src={AddIcon}
              alt="AddEdit"
              className="w-18 h-18  sm:w-18 sm:h-18 md:w-20 md:h-20 -mt-13"
            />
          </NavLink>
    
           {/* Overview Button */}
          <NavLink
            to="/overview"
            className={({ isActive }) =>
              `p-2 rounded-full transition-all ${
                isActive ? "bg-honeyGold" : "bg-white"
              }`
            }
          >
            <img
              src={CalendarIcon}
              alt="overview"
              className="w-11 h-11  sm:w-12 sm:h-12 md:w-15 md:h-15"
            />
          </NavLink>

          {/* Profile Button */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `p-2 rounded-full transition-all ${
                isActive ? "bg-honeyGold" : "bg-white"
              }`
            }
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-15 md:h-15"
            />
          </NavLink>
        </div>
      </div>

      {/* Page Content */}
      <div className="mb-32 w-full max-w-7xl mx-auto p-4 md-5">
        <Outlet />
      </div>
    </div>
  );
}

export default NavbarMobile;