import { NavLink, Outlet } from "react-router-dom";
import Men1 from '../assets/ProfilePics/men1.svg';
import axios from "axios";
import Men2 from '../assets/ProfilePics/men 2.svg';
import Men3 from '../assets/ProfilePics/men3.svg';
import Men4 from '../assets/ProfilePics/men 4.svg';
import Men5 from '../assets/ProfilePics/men 5.svg';
import Men from '../assets/ProfilePics/men.svg';
import Women1 from '../assets/ProfilePics/women 1.svg';
import Women2 from '../assets/ProfilePics/women 2.svg';
import Women3 from '../assets/ProfilePics/women 3.svg';
import Women from '../assets/ProfilePics/women.svg';
import LogoS from '../assets/LogoS.svg';
import { useState, useEffect } from 'react';
const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState(Men1);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const pictures = [
      { name: 'Men1', src: Men1 },
      { name: 'Men2', src: Men2 },
      { name: 'Men3', src: Men3 },
      { name: 'Men4', src: Men4 },
      { name: 'Men5', src: Men5 },
      { name: 'Men', src: Men },
      { name: 'Women1', src: Women1 },
      { name: 'Women2', src: Women2 },
      { name: 'Women3', src: Women3 },
      { name: 'Women', src: Women },
    ];

const fetchuser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Profile response:", response.data);

    const picture = response.data.User_picture;

    // Check if it's a full URL (e.g., Cloudinary), otherwise fallback to internal SVG list
    if (picture?.startsWith('http')) {
      setProfilePicture(picture);
    } else {
      const pictureName = picture?.toLowerCase().replace(/\s+/g, '').replace('.svg', '');
      const foundPicture = pictures.find(p =>
        p.name.toLowerCase().replace(/\s+/g, '') === pictureName
      );
      setProfilePicture(foundPicture?.src || Men1);
    }

  } catch (err) {
    console.error("Error fetching user data:", err);
    setError("Failed to fetch user data");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchuser();
}, []);

  return (
    <div className="flex flex-col items-center w-full">
      <nav className="fixed top-0 w-full px-6 py-3 bg-[#FFF19C] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] z-10 border-2">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-2">


          {/* Right side: NavLinks + Profile */}
          <div className="flex items-center space-x-20 ml-auto text-xl font-poppins font-bold">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `transition hover:text-bubblegum focus:outline-none ${
                  isActive ? "text-barbie" : "text-gray-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `transition hover:text-bubblegum focus:outline-none ${
                  isActive ? "text-barbie" : "text-gray-700"
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/overview"
              className={({ isActive }) =>
                `transition hover:text-bubblegum focus:outline-none ${
                  isActive ? "text-barbie" : "text-gray-700"
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/profile"
              className="transition bg-cover hover:text-bubblegum focus:outline-none">
              <img
                className="rounded-full object-cover object-center h-16 w-16 hover:scale-105 transition-all duration-200 ease-in-out transform cursor-pointer"
                src={profilePicture}
                alt="profile"
              />
            </NavLink>

          </div>
        </div>
      </nav>

      {/* Page content (pushed down due to fixed nav) */}
      <div className="mt-25 w-full max-w-7xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;