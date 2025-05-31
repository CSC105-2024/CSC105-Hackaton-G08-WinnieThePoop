import { useState } from 'react';
import Close from '../../assets/close.svg';
import Men1 from '../../assets/ProfilePics/men1.svg';
import Men2 from '../../assets/ProfilePics/men 2.svg';
import Men3 from '../../assets/ProfilePics/men3.svg';
import Men4 from '../../assets/ProfilePics/men 4.svg';
import Men5 from '../../assets/ProfilePics/men 5.svg';
import Men from '../../assets/ProfilePics/men.svg';
import Women1 from '../../assets/ProfilePics/women 1.svg';
import Women2 from '../../assets/ProfilePics/women 2.svg';
import Women3 from '../../assets/ProfilePics/women 3.svg';
import Women from '../../assets/ProfilePics/women.svg';

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

function ProfilePic({ onClose, onSelect }) {
  const [isClosing, setIsClosing] = useState(false);
//   const fileInputRef = useRef(null);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSelect = (pic) => {
    onSelect(pic); 
    closeModal();   
  };

//   const handleUploadClick = () => {
//     fileInputRef.current.click(); 
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         onSelect({ name: 'CustomUpload', src: reader.result });
//         closeModal();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`bg-white p-10 w-[350px] sm:w-[450px] md:w-[480px] lg:w-[400px] max-h-[611px] overflow-y-auto rounded-lg shadow-lg relative ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
        <div className="absolute top-4 right-4 cursor-pointer hover:scale-105" onClick={closeModal}>
          <img src={Close} alt="Close" className="h-6 w-6" />
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-[6px] sm:gap-4 md:gap-6">
            {/* Default pictures */}
            {pictures.map((pic) => (
              <div
                key={pic.name}
                onClick={() => handleSelect(pic)}
                className="w-[80px] sm:w-[90px] h-[80px] sm:h-[90px] cursor-pointer rounded-full p-[2px] transition hover:border-2 hover:border-blue-500 flex items-center justify-center"
              >
                <img
                  src={pic.src}
                  alt={pic.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ))}
            {/* Upload circle
            <div
              onClick={handleUploadClick}
              className="w-[80px] sm:w-[90px] h-[80px] sm:h-[90px] bg-gray-200 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 transition"
            >
              <Icon icon={Camera} alt="Upload" className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-500" />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePic;