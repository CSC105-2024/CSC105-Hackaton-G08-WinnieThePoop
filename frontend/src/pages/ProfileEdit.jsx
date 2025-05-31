import React from 'react'

function ProfileEdit() {
  return (
    <div>
      
    </div>
  )
}

export default ProfileEdit


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ProfilePic from '../components/modals/ProfilePickerModal';
// import Back from '../assets/BackIcon.svg';
// import Men1 from '../assets/ProfilePics/men1.svg';
// import Men2 from '../assets/ProfilePics/men 2.svg';
// import Men3 from '../assets/ProfilePics/men3.svg';
// import Men4 from '../assets/ProfilePics/men 4.svg';
// import Men5 from '../assets/ProfilePics/men 5.svg';
// import Men from '../assets/ProfilePics/men.svg';
// import Women from '../assets/ProfilePics/women.svg';
// import Women1 from '../assets/ProfilePics/Women 1.svg';  
// import Women2 from '../assets/ProfilePics/women 2.svg';
// import Women3 from '../assets/ProfilePics/women 3.svg';

// function ProfileEdit() {
//   const [profilePicture, setProfilePicture] = useState(Men1);
//   const [showProfilePicModal, setShowProfilePicModal] = useState(false);
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const pictures = [
//     { name: 'Men1', src: Men1 },
//     { name: 'Men2', src: Men2 },
//     { name: 'Men3', src: Men3 },
//     { name: 'Men4', src: Men4 },
//     { name: 'Men5', src: Men5 },
//     { name: 'Men', src: Men },
//     { name: 'Women1', src: Women1 },
//     { name: 'Women2', src: Women2 },
//     { name: 'Women3', src: Women3 },
//     { name: 'Women', src: Women },
//   ];

//   const [formData, setFormData] = useState({
//     username: '',
//     phone: '',
//   });

//   const handleProfilePicSelect = async (pic) => {
//     console.log('User picked preset:', pic.name);
//     setProfilePicture(pic.src);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(`http://localhost:3000/users/profile`, {
//         NewName: formData.username,
//         NewPhone: formData.phone,
//         NewPicture: pic.name,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('Profile picture updated to preset');
//     } catch (err) {
//       console.error('Failed to update preset picture:', err);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formDataCloud = new FormData();
//     formDataCloud.append('file', file);
//     formDataCloud.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
//         formDataCloud
//       );

//       const uploadedImageUrl = response.data.secure_url;
//       setProfilePicture(uploadedImageUrl);

//       const token = localStorage.getItem('token');
//       await axios.patch(`http://localhost:3000/users/profile`, {
//         NewName: formData.username,
//         NewPhone: formData.phone,
//         NewPicture: uploadedImageUrl,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log('Cloudinary image uploaded and saved');
//     } catch (error) {
//       console.error('Cloudinary upload failed:', error);
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:3000/users/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setFormData({
//         username: response.data.UserName || '',
//         phone: response.data.User_Phone || '',
//       });

//       const pictureName = response.data.User_picture?.toLowerCase().replace(/\s+/g, '').replace('.svg', '');
//       const foundPicture = pictures.find(p =>
//         p.name.toLowerCase().replace(/\s+/g, '') === pictureName
//       );

//       setProfilePicture(foundPicture?.src || response.data.User_picture || Men1);
//     } catch (err) {
//       console.error('Error fetching user data:', err);
//       setError('Failed to fetch user data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(`http://localhost:3000/users/profile`, {
//         name: formData.username,
//         phone: formData.phone,
//         picture: profilePicture.includes('cloudinary') ? profilePicture :
//           pictures.find(p => p.src === profilePicture)?.name || 'Men1',
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('Update success');
//       navigate('/profile');
//     } catch (err) {
//       console.error('Failed to update:', err);
//     }
//   };

//   return (
//     <div className="w-full h-screen flex flex-col">
//       <div className='flex flex-row'>
//         <div className="p-3 hover:ml-2 ">
//           <img src={Back} alt="Back" className="cursor-pointer" onClick={() => navigate('/profile')} />
//         </div>
//         <div className='ml-3 mt-3 text-2xl font-poppins font-bold'>Edit</div>
//       </div>

//       <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
//         <div className="mt-3 border-3 rounded-lg w-[450px] h-[200px] md:w-[700px] md:h-[250px] lg:w-[800px] lg:h-[300px] flex flex-col justify-center items-center space-y-4">
//           <img
//             src={profilePicture}
//             alt="Profile"
//             className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] rounded-full object-cover cursor-pointer hover:opacity-80"
//             onClick={() => setShowProfilePicModal(true)}
//           />
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={() => setShowProfilePicModal(true)}
//               className="p-2 px-3 font-poppins font-bold rounded-lg border-2 text-sm border-black text-white bg-barbie hover:scale-105 hover:bg-[#d4469d]"
//             >
//               Choose from presets
//             </button>
//             <button
//               type="button"
//               onClick={handleUploadClick}
//               className="p-2 px-3 font-poppins font-bold rounded-lg border-2 text-sm border-black text-white bg-sky-600 hover:scale-105 hover:bg-sky-700"
//             >
//               Upload from device
//             </button>
//           </div>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </div>

//         <div className='mt-8 w-[450px] md:w-[700px] lg:w-[800px]'>
//           <label className="text-xl font-poppins font-light mb-2 block">Name</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="text-xl font-poppins font-light border-3 rounded-lg w-[450px] md:w-[700px] lg:w-[800px] p-4"
//             placeholder="e.g. Inwza"
//           />
//         </div>

//         <div className='mt-8 w-[450px] md:w-[700px] lg:w-[800px]'>
//           <label className="text-xl font-poppins font-light mb-2 block">Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="text-xl font-poppins font-light border-3 rounded-lg w-[450px] md:w-[700px] lg:w-[800px] p-4"
//             placeholder="e.g. 0123456789"
//           />
//         </div>

//         <div className="p-3 font-poppins text-lg font-bold">
//           <button
//             type="submit"
//             className='mt-10 p-2 text-base px-9 rounded-lg border-3 border-black bg-mintsorbet hover:scale-105 hover:bg-[#b8d6a7]'
//           >
//             SAVE
//           </button>
//         </div>
//       </form>

//       {showProfilePicModal && (
//         <ProfilePic onClose={() => setShowProfilePicModal(false)} onSelect={handleProfilePicSelect} />
//       )}
//     </div>
//   );
// }

// export default ProfileEdit;
