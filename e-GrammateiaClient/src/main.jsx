import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme
import CssBaseline from '@mui/material/CssBaseline';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './CSS/styles.css';



// const theme = createTheme();

const PrivateRoute = ({ element, allowedRoles }) => {

  const authToken = Cookies.get('authTokenNEW');
  const decoded = authToken ? jwtDecode(authToken) : null;
  const userRole = decoded ? decoded.role : null;

  console.log('authToken:', authToken);
  console.log('decoded:', decoded);
  console.log('userRole:', userRole);


  if (!authToken || !userRole || !allowedRoles.includes(userRole)) {
    // Redirect to login if not authenticated or not in the allowed role
    return <Navigate to="/login" />;
  }

  return element;
};


import User from './User';
import Login from './Login';
import Dashboard from './Dashboard';
import Department from './Department';
import Course from './Course';
import Grade from './Grade';

export default function App() {

  const handleLogout = () => {
    // Clear authentication token
    Cookies.remove('authTokenNEW');

    // Redirect to login page
    window.location.replace('/login');
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route
            path="/"
            element={<PrivateRoute element={<Dashboard />} allowedRoles={['Admin','Teacher','Student']} />}
          />
        <Route path="login" element={<Login />} />
        <Route
            path="/user"
            element={<PrivateRoute element={<User />} allowedRoles={['Admin']} />}
        />
        <Route
            path="/departments"
            element={<PrivateRoute element={<Department />} allowedRoles={['Admin']} />}
        />
         <Route
            path="/course"
            element={<PrivateRoute element={<Course />} allowedRoles={['Admin']} />}
        />
        <Route
            path="/grade"
            element={<PrivateRoute element={<Grade />} allowedRoles={['Admin']} />}
        />
      </Routes>
      {/* Logout button */}
      <Link to="#" onClick={handleLogout}>
          Logout
      </Link>
    </BrowserRouter>
  </ThemeProvider>
  );



  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);