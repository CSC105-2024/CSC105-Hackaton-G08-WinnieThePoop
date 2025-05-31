import Good from '../assets/Poop/good.svg'
import tongue from '../assets/Poop/Tongueout.svg'
import Please from '../assets/Poop/Please.svg'
import Gray from '../assets/status/Gray.png'
import logo from '../assets/LogoBorderS.svg'
import AddIcon from '../assets/AddIcon.svg'
import { useWindowSize } from '../components/hooks/useWindowSize';

function Home() {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  return (
    <div className="min-h-screen w-full py-10">
      <div className='flex flex-col font-poppins font-bold w-full'>
        <h1 className='text-5xl text-gray-800'>Hello, Welcome 👋🏻</h1>
        <h2 className='mt-2 text-2xl text-gray-800'>
          ?- Your poop status of TODAY! 🚽 🧻 💩
        </h2>
      </div>
      <div className='flex justify-center items-center mt-10'>
        <div
          className='w-[784px] h-[431px] border-4 rounded-lg bg-white bg-cover bg-center'
          style={{ backgroundImage: `url(${Gray})` }}
        >
          <h1 className='font-poppins text-8xl flex justify-center items-center mt-10'>00</h1>
          <div className='flex justify-center items-center'>
            <img src={logo} className='w-50 h-50 mt-10' alt='Neutral' />
          </div>   
        </div>
      </div>
      <div className='flex justify-around items-center mt-10'>
        <div className='ml-20'>
          <img src={Please}></img>
        </div>
        <div className=''>
          <div className='-ml-20 text-2xl font-bold flex justify-center items-center border-4 w-[600px] h-[98px] rounded-lg'>
            Have you poop yet, Please tell us😔
            {/* <span className='ml-2'>
              <img src={tongue} className='w-10 h-10 ml-2 inline' alt='Good' />
            </span> */}
          </div>
        </div>
      </div>
      {!isMobile &&
        <div className='fixed bottom-8 right-8 hidden sm:block md:block lg:block lg:h-30 lg:w-30 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-50'>
          <img src={AddIcon} alt="Add Icon" className="" />
      </div>
      }
      
    </div>
  )
}

export default Home
