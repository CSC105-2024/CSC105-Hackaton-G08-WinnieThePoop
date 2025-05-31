import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import './index.css'
import App from './App.jsx'
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Overview from './pages/Overview.jsx';
import Profile from './pages/Profile.jsx';
import ProfileEdit from './pages/ProfileEdit.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {path: "home", element: <Home/> },
      {path: "history", element: <History/> },
      {path: "overview", element:<Overview/>},
      {path: "profile", element:<Profile/>},
      {path: "profileEdit", element:<ProfileEdit/>},
    ],
  },
  { path: "/signUp", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path:"*", element: <NotFoundPage/>}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>,
)
