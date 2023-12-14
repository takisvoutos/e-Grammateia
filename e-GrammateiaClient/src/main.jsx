import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme
import CssBaseline from '@mui/material/CssBaseline';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './CSS/styles.css';

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
import Registration from './Registration';
import StudentCourse from './StudentCourses';
import GradesPDF from './GradesPDF';

export default function App() {

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
            element={<PrivateRoute element={<Grade />} allowedRoles={['Teacher']} />}
        />
        <Route
            path="/registration"
            element={<PrivateRoute element={<Registration />} allowedRoles={['Student']} />}
        />
         <Route
            path="/studentCourses"
            element={<PrivateRoute element={<StudentCourse />} allowedRoles={['Student']} />}
        />
        <Route
            path="/gradesPDF"
            element={<PrivateRoute element={<GradesPDF />} allowedRoles={['Student']} />}
        />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);