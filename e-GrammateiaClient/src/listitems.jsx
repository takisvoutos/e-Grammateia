import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GradeIcon from '@mui/icons-material/Grade';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedIcon from '@mui/icons-material/Verified';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


export const mainListItems = () => {
  // Define userRole inside mainListItems
  const authToken = Cookies.get('authTokenNEW');
  const decoded = authToken ? jwtDecode(authToken) : null;
  const userRole = decoded ? decoded.role : null;

  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Αρχική" />
      </ListItemButton>
      {userRole === 'Admin' && (
        <>
          <ListItemButton component={Link} to="/user">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Χρήστες" />
          </ListItemButton>
          {/* <ListItemButton component={Link} to="/departments">
            <ListItemIcon>
              <AddHomeIcon />
            </ListItemIcon>
            <ListItemText primary="Department" />
          </ListItemButton> */}
          <ListItemButton component={Link} to="/course">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Μαθήματα" />
          </ListItemButton>
        </>
      )}
      {userRole === 'Teacher' && (
        <ListItemButton component={Link} to="/grade">
          <ListItemIcon>
            <GradeIcon />
          </ListItemIcon>
          <ListItemText primary="Βαθμολογίες" />
        </ListItemButton>
      )}
      {userRole === 'Student' && (
        <>
        <ListItemButton component={Link} to="/registration">
          <ListItemIcon>
            <AppRegistrationIcon />
          </ListItemIcon>
          <ListItemText primary="Δήλωση μαθημάτων" />
        </ListItemButton>
        <ListItemButton component={Link} to="/studentCourses">
         <ListItemIcon>
           <BookIcon />
         </ListItemIcon>
         <ListItemText primary="Μαθήματα" />
       </ListItemButton>
       <ListItemButton component={Link} to="/gradesPDF">
         <ListItemIcon>
           <VerifiedIcon />
         </ListItemIcon>
         <ListItemText primary="Πιστοποιητικά" />
       </ListItemButton>
       </>
      )}
    </React.Fragment>
  );
};

export const secondaryListItems = () => {
  const handleLogout = () => {
    // Clear authentication token
    Cookies.remove('authTokenNEW');
    Cookies.remove('authToken');
    Cookies.remove('userDepartment');
    Cookies.remove('userDepartmentID');
    Cookies.remove('userTeacherID');

    // Redirect to login page
    window.location.replace('/login');
  };

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        {/* Saved reports */}
      </ListSubheader>
      <ListItemButton component={Link} to="#" onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Αποσύνδεση" />
      </ListItemButton>
    </React.Fragment>
  );
};
