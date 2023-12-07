import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MyCustomImage from '/public/logo-login.png';
import './CSS/styles.css';
import theme from './theme';
import { Cookie } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5108/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        credentials: 'include',
      });

      if (response.ok) {

      const data = await response.json();

      const authToken = data.authToken;

      // Set the token in the cookie
      Cookies.set('authTokenNEW', authToken);


      const decoded = jwtDecode(authToken);
      const userRole = decoded.role;
      const userDepartment = data.departmentName; // Retrieve the department name from the response
      const userDepartmentID = data.departmentID; // Retrieve the department id from the response
      const userTeacherID = data.teacherID; // Retrieve the teacher id from the response
      const userStudentID = data.studentID;

      Cookies.set('userDepartment', userDepartment);
      Cookies.set('userDepartmentID', userDepartmentID);
      Cookies.set('userTeacherID', userTeacherID);
      Cookies.set('userStudentID', userStudentID);

      console.log('Login successful');
      console.log('User Role:', userRole);
      console.log('User Department Name:', userDepartment);
      console.log('User Department ID:', userDepartmentID);
      console.log('User Teacher ID:', userTeacherID);
      console.log('User Student ID:', userStudentID);

      // Redirect to the dashboard
      navigate('/'); // Use the navigate function to redirect to the root path

      } else {
        console.error('Login failed', response.statusText);
        // Print the response status and error message
      const errorData = await response.json().catch(() => null);
      console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (

  <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              p: 3,
              mb: 3,
          }}
        >
           <img
            src={MyCustomImage}
            alt="Logo"
            style={{ width: '400px', height: 'auto', marginBottom: '50px' }}
          />
          <Typography component="h1" variant="h5">
            Σύνδεση στην γραμματεία
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Όνομα Χρήστη"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Κωδικός"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              ΣΥΝΔΕΣΗ
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}



export default Login;
