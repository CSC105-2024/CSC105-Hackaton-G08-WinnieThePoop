import { useEffect, useState } from 'react';
import Good from '../assets/Poop/good.svg';
//import tongue from '../assets/Poop/Tongueout.svg';
import Please from '../assets/Poop/Please.svg';
import Gray from '../assets/status/Gray.png';
import Yellow from '../assets/status/Yellow.png';
import Red from '../assets/status/Red.png';
import Green from '../assets/status/Green.png';
import logo from '../assets/LogoBorderS.svg';
import AddIcon from '../assets/AddIcon.svg';
import { useWindowSize } from '../components/hooks/useWindowSize';
import fart1 from '../assets/sounds/fart1.mp3';
import fart2 from '../assets/sounds/fart2.mp3';
import fart3 from '../assets/sounds/fart3.mp3';
import fart4 from '../assets/sounds/fart4.mp3';
import fart5 from '../assets/sounds/fart5.mp3';
import fart6 from '../assets/sounds/fart6.mp3';
import fart7 from '../assets/sounds/fart7.mp3';
import fart8 from '../assets/sounds/fart8.mp3';
import fart9 from '../assets/sounds/fart9.mp3';
import { format } from 'date-fns';
import AddEditModal from '../components/modals/AddEdit.jsx';
import Docter from '../assets/Poop/Docter.svg';
import Sus from '../assets/Poop/Sus.svg';

function Home() {
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const token = localStorage.getItem('token');
  const [fullText, setFullText] = useState("Have you poop yet, Please tell us 😔");
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [recordCount, setRecordCount] = useState(0);
  const [status, setStatus] = useState('Normal');
  const clickSounds = [
    fart1, fart2, fart3, fart4, fart5,
    fart6, fart7, fart8, fart9,
  ];
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [poopings, setPoopings] = useState([]);

  const statusImages = {
    'Abnormal': Docter,
    'Worrisome': Sus,
    'Normal': Good
  };

  // Function to get the correct image
  const getStatusImage = () => {
    if (recordCount === 0 || recordCount === '00') {
      return Good; // Use Good.svg when count is 0
    }
    return statusImages[status] || Please; // Use status-based image or fallback to Please
  };

  const handleLogoClick = (e) => {
    const id = Date.now();
    
    // Play a random sound
    const randomSound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
    const audio = new Audio(randomSound);
    audio.play();

    // Position burst
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setBursts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 800);
  };

  const handleAddNewPooping = (newPooping) => {
    const poopingWithDate = {
      ...newPooping,
      date: selectedDate,
      id: Math.max(...poopings.map(p => p.id), 0) + 1
    };
    setPoopings([...poopings, poopingWithDate]);
    handleCloseAddModal();
  };

  const fetchRecordCountbyDate = async () => {
    try {
      const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const today = formatDateToYYYYMMDD(new Date());

      const response = await fetch(`http://localhost:3000/record/count/${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch record count');
      }

      const data = await response.json();
      console.log('Record count:', data.count);
      setRecordCount(String(data.count).padStart(2, '0'));
      
    } catch (error) {
      console.error('Error fetching record count:', error);
    }
  };

  const fetchRecordStatus = async () => {
    try {
      const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const today = formatDateToYYYYMMDD(new Date());

      const response = await fetch(`http://localhost:3000/record/status/${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch record status');
      }

      const data = await response.json();
      console.log('Record status:', data);
      setStatus(data.status); 

      // Update text based on status
      let newText = "";
      if (data.status === 'Abnormal') {
        newText = 'You should go see a doctor!💀🧻🚽';
      } else if (data.status === 'Worrisome') {
        newText = 'Hmmm, Interesting... 🤔';
      } else if (data.status === 'Normal') {
        newText = 'Everything is okay, Keep do it!';
      } else {
        newText = 'Have you poop yet, Please tell us 😔';
      }
      
      setFullText(newText);
      
    } catch (error) {
      console.error('Error fetching record status:', error);
      setFullText('Please try again later.');
    }
  };

  useEffect(() => {
    fetchRecordStatus();
  }, []);

  useEffect(() => {
    fetchRecordCountbyDate();
  }, []);

  
  useEffect(() => {
    setDisplayedText(''); 
    setIsTyping(true);
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length-1) {
        setDisplayedText((prev) => prev + fullText[i]);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 60);
    
    return () => clearInterval(interval);
  }, [fullText]); // Dependency on fullText

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen w-full py-10 relative overflow-hidden">
      <div className="flex flex-col font-poppins font-bold w-full">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl">Hello, Welcome 👋🏻</h1>
        <h2 className="mt-2 text-xl lg:text-2xl text-gray-800">
          ?- Your poop status of TODAY! 🚽 🧻 💩
        </h2>
      </div>

      <div className="flex justify-center items-center mt-10">
        <div
          className="w-[520px] h-[300px] sm:w-[580px] sm:h-[320px] md:w-[600px] md:h-[350px] lg:w-[784px] lg:h-[431px] border-4 rounded-lg bg-white bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              status === 'Abnormal'
                ? Red
                : status === 'Worrisome'
                ? Yellow
                : status === 'Normal'
                ? Green
                : Gray
            })`,
          }}
        >
          <h1 className="font-poppins text-5xl sm:text-5xl md:text-6xl lg:text-8xl flex justify-center items-center mt-10">
            {String(recordCount).padStart(2, '0')}
          </h1>

          <div className="flex justify-center items-center">
            <img
              src={logo}
              alt="Neutral"
              onClick={handleLogoClick}
              className="lg:w-50 lg:h-50 mt-10 transition-transform duration-150 transform hover:scale-105 active:scale-90 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-around items-center mt-10 gap-6 lg:gap-0">
        <div className="order-1 lg:order-2">
          <div className="lg:-ml-90 text-2xl font-bold flex justify-center items-center border-4 
          w-[450px] sm:w-[500px] md:w-[600px] h-[98px] rounded-lg ">
            {displayedText}
          </div>
        </div>
        <div className="order-2 lg:order-1">
          <img
            src={getStatusImage()}
            alt={recordCount === 0 || recordCount === '00' ? "Good" : status || "Please"}
            className={`w-32 sm:w-36 ${isTyping ? 'animate-shake' : ''}`}
          />
        </div>
      </div>

      {!isMobile && (
        <div className="fixed bottom-8 right-8 hidden sm:block md:block lg:block lg:h-30 lg:w-30 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-50">
          <img src={AddIcon} onClick={handleOpenAddModal} alt="Add Icon" />
        </div>
      )}
      
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
}

export default Home;