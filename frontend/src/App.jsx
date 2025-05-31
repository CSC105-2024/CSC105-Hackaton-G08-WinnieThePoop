import Navbar from "./components/Navbar.jsx";
import NavbarMobile from "./components/NavbarMobile";
import { useWindowSize } from "./components/hooks/useWindowSize.jsx";

function App() {
  const { width, height } = useWindowSize();
  const isMobile = width <= 770 && height <= 1025;

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const token = getToken();

  return (
    <>
      {token && (isMobile ? <NavbarMobile /> : <Navbar />)}
    </>
  );
}

export default App;
