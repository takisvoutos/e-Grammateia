import React, { useState, useEffect } from 'react';
import RegistrationList from './RegistrationList';
import Layout from './Layout';
import Cookies from 'js-cookie';

function RegistrationManagement() {
    
    const [registrationData, setRegistrationData] = useState([]);
    const [maxRegistrationId, setMaxRegistrationId] = useState(0);
    const [courses, setCourses] = useState([]); 
    const [students, setStudents] = useState([]);
    const [userDepartmentID, setUserDepartmentID] = useState(null);
    const [userStudentID, setUserStudentID] = useState(null);

    useEffect(() => {
        fetchRegistrationData();
      }, []);


      const fetchRegistrationData = async () => {
        try {

          // Retrieve the user department id from cookies or state
          const userDepartmentIDFromCookie = Cookies.get('userDepartmentID');
          setUserDepartmentID(userDepartmentIDFromCookie);

          // Retrieve the user student id from cookies or state
          const userStudentIDFromCookie = Cookies.get('userStudentID');
          setUserStudentID(userStudentIDFromCookie);
          
          const response = await fetch(`http://localhost:5108/registration/${userStudentIDFromCookie}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
          }
    
          const registrationsData = await response.json();
          
          setRegistrationData(registrationsData);
          setMaxRegistrationId(Math.max(...registrationsData.map(registration => registration.id)));


          // Fetch course data
          const courseResponse = await fetch(`http://localhost:5108/courses/registration/${userDepartmentIDFromCookie}`);
          if (!courseResponse.ok) {
            throw new Error('Failed to fetch course data from the server');
          }
          
          const courseData = await courseResponse.json();
          setCourses(courseData);

          // Fetch student data
          const studentResponse = await fetch('http://localhost:5108/students');
          if (!studentResponse.ok) {
            throw new Error('Failed to fetch student data from the server');
          }
          const studentData = await studentResponse.json();
          setStudents(studentData);
    
        } catch (error) {
          console.error('Error fetching registration data:', error);
        }
      };

      const handleCreate = async (registration) => {
        try {
          // Omit the 'id' property from the registration object
          const { id, ...registrationWithoutId } = registration;
          const response = await fetch('http://localhost:5108/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationWithoutId),
          });
      
          if (!response.ok) {
            // Handle the error, e.g., show an error message
            console.error('Failed to create registration:', response.statusText);
            return;
          }else 
          {
            console.log("Registration created successfully");
          }
        } catch (error) {
          console.error('Error creating registration:', error.message);
        }
      };

      const handleUpdate = async (registration) => {
        try {
          console.log('Updating registration:', registration);
          const response = await fetch(`http://localhost:5108/registration/${registration.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registration),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update registration');
          }
      
          // Update the state with the updated registration
          const updatedRegistrationData = gradeData.map(existingRegistration =>
            existingRegistration.id === registration.id ? { ...existingRegistration, ...registration } : existingRegistration
          );
      
          setRegistrationData(updatedRegistrationData);
        } catch (error) {
          console.error('Error updating Registration:', error);
        }
      };

      const handleDelete = async (id) => {
        try {
          // Make an HTTP DELETE request to the server
          const response = await fetch(`http://localhost:5108/registration/${id}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            // If the server returns a successful response, update the state
            const updatedRegistrationData = registrationData.filter(registration => registration.id !== id);
            setRegistrationData(updatedRegistrationData);
          } else {
            // Handle error case
            console.error('Failed to delete registration');
          }
        } catch (error) {
          console.error('An error occurred during the delete request:', error);
        }
      };

      return (
        <Layout title="Registration">
        <div>
          <RegistrationList
            data={registrationData}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            courses={courses}
            students={students}
            userStudentID={userStudentID}
          />
        </div>
        </Layout>
      );


}

export default RegistrationManagement;