import Back from '../assets/BackIcon.svg'
import Men1 from "../assets/ProfilePics/men1.svg";
import EditIcon from "../assets/EditIcon.svg"
import Logout from "../assets/LogoutIcon.svg";
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmLogout from '../components/modals/ConfirmLogOut.jsx';
import axios from "axios"
import Men2 from '../assets/ProfilePics/men 2.svg';
import Men3 from '../assets/ProfilePics/men3.svg';
import Men4 from '../assets/ProfilePics/men 4.svg';
import Men5 from '../assets/ProfilePics/men 5.svg';
import Men from '../assets/ProfilePics/men.svg';
import Women1 from '../assets/ProfilePics/women 1.svg';
import Women2 from '../assets/ProfilePics/women 2.svg';
import Women3 from '../assets/ProfilePics/women 3.svg';
import Women from '../assets/ProfilePics/women.svg';


function Profile() {
  const [profilePicture, setProfilePicture] = useState(Men1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const Navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

  //pictures
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

    setUsername(response.data.Username);
    setEmail(response.data.UserEmail);

    const picture = response.data.UserProfilePic;

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
    <div className="w-full h-screen flex flex-col">
      {/* Back button section */}
      <div className="p-3 hover:ml-2 ">
        <img src={Back} alt="Back" 
        className="cursor-pointer" 
        onClick={()=>Navigate('/home')}
        />
      </div>

      {/* Centered Box section */}
      <div className="flex flex-col justify-center items-center">
        <div className="border-2 rounded-lg w-[320px] h-[180px] sm:w-[300px] sm:h-[200px]  md:w-[700px] md:h-[200px] lg:w-[800px] lg:h-[200px] transition-all">
          <div className="flex p-2 justify-end">
            <img src={EditIcon} 
            onClick={() => Navigate('/profileEdit')}
            className='hover:scale-105 hover:cursor-pointer'/>
          </div>
          <div className='flex flex-row -mt-3 ml-10 md:ml-15 lg:ml-20 justify-start items-center transition-all'>
            <img
              src={profilePicture}
              alt="Profile"
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[100px] lg:h-[100px] rounded-full object-cover 
              cursor-pointer hover:scale-105 transition-all"
            />
            <div className='text-xl font-poppins font-bold ml-[46px]'>{username}</div>
          </div>
          </div>
          
          <div className="p-2 font-poppins text-sm md:text-base lg:text-lg font-bold mt-[33px]  w-[320px] h-[90px] sm:w-[600px] sm:h-[200px] border-2 rounded-lg  md:w-[700px] md:h-[230px] lg:w-[800px] lg:h-[175px] transition-all">
            <div className='ml- sm:ml-3 -mt-1 md:mt-1 lg:mt-7'>
              <p className='p-2'>Name: {username}</p>
              <p className='p-2'>Email: {email}</p>
            </div>
          </div>

          <div
            className="p-3 font-poppins text-lg font-bold w-[320px] h-[60px] mt-[50px] md:mt-[50px] lg:mt-[200px] border-2 rounded-lg sm:w-[600px] sm:h-[60px] md:w-[700px] md:h-[70px] lg:w-[800px] lg:h-[80px] 
            hover:scale-105 hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => setShowLogoutModal(true)} 
          >
            <div className="flex flex-row justify-between items-center  h-full px-4">
              <div className="flex items-center">
                <img src={Logout} className="mr-3 w-6 h-6  md:w-7 md:h-7 lg:w-10 lg:h-10" alt="Contact" />
                <p className='font-bold text-sm md:text-base lg:text-lg'>Log out</p>
              </div>
            </div>
          </div>

        
        {/* Modal */}
        {showLogoutModal && (
        <ConfirmLogout onClose={() => setShowLogoutModal(false)}/>
        )}

      </div>
    </div>
  );
}

export default Profile;


















