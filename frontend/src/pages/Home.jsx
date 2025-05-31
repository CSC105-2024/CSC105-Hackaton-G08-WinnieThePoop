import { useEffect, useState } from 'react';
import Good from '../assets/Poop/good.svg';
import tongue from '../assets/Poop/Tongueout.svg';
import Please from '../assets/Poop/Please.svg';
import Gray from '../assets/status/Gray.png';
import logo from '../assets/LogoBorderS.svg';
import AddIcon from '../assets/AddIcon.svg';
import { useWindowSize } from '../components/hooks/useWindowSize';

function Home() {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const fullText = "Have you poop yet, Please tell us😔";
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const [bursts, setBursts] = useState([]);

  // Typewriter effect    
  useEffect(() => {
    let i = -1;
    const interval = setInterval(() => {
      if (i <= fullText.length - 2) {
        setDisplayedText((prev) => prev + fullText[i]);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = (e) => {
    const id = Date.now();

    // Get position of click relative to screen
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setBursts((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 800);
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
          style={{ backgroundImage: `url(${Gray})` }}
        >
          <h1 className="font-poppins text-5xl sm:text-5xl md:text-6xl lg:text-8xl flex justify-center items-center mt-10">00</h1>

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
            src={Please}
            alt="Please"
            className={`w-32 sm:w-36 ${isTyping ? 'animate-shake' : ''}`}
          />
        </div>
      </div>

      {!isMobile && (
        <div className="fixed bottom-8 right-8 hidden sm:block md:block lg:block lg:h-30 lg:w-30 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-50">
          <img src={AddIcon} alt="Add Icon" />
        </div>
      )}
    </div>
  );
}

export default Home;
