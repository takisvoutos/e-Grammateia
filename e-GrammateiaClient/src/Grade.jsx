import React, { useState, useEffect } from 'react';
import GradeList from './GradeList';
import Layout from './Layout';
import Cookies from 'js-cookie';

function GradeManagement() {

    const [gradeData, setGradeData] = useState([]);
    const [maxGradeId, setMaxGradeId] = useState(0);
    const [courses, setCourses] = useState([]); 
    const [students, setStudents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [userTeacherID, setUserTeacherID] = useState(null);
    const [userDepartmentID, setUserDepartmentID] = useState(null);

    useEffect(() => {
        fetchGradeData();
      }, []);

      const fetchGradeData = async () => {
        try {

          // Retrieve the teacher id from cookies or state
          const userTeacherIDFromCookie = Cookies.get('userTeacherID');
          setUserTeacherID(userTeacherIDFromCookie);
          
          const response = await fetch(`http://localhost:5108/grade/teacher/${userTeacherIDFromCookie}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
          }
    
          const gradesData = await response.json();
          
          setGradeData(gradesData);
          setMaxGradeId(Math.max(...gradesData.map(grade => grade.id)));

          // Fetch course data
          const courseResponse = await fetch(`http://localhost:5108/courses/teacher/${userTeacherIDFromCookie}`);
          if (!courseResponse.ok) {
            throw new Error('Failed to fetch course data from the server');
          }
          const courseData = await courseResponse.json();
          setCourses(courseData);

          // Retrieve the user department id from cookies or state
          const userDepartmentIDFromCookie = Cookies.get('userDepartmentID');
          setUserDepartmentID(userDepartmentIDFromCookie);

          // Fetch student data
          const studentResponse = await fetch(`http://localhost:5108/students/${userDepartmentIDFromCookie}`);
          if (!studentResponse.ok) {
            throw new Error('Failed to fetch student data from the server');
          }
          const studentData = await studentResponse.json();
          setStudents(studentData);

          // Fetch registration data
          const registrationResponse = await fetch('http://localhost:5108/registration');
          if (!registrationResponse.ok) {
            throw new Error('Failed to fetch registration data from the server');
          }
          const registrationData = await registrationResponse.json();
          setRegistrations(registrationData);
    
        } catch (error) {
          console.error('Error fetching grade data:', error);
        }
      };


      const handleCreate = async (grade) => {
        try {
            // Omit the 'id' property from the grade object
            const { id, ...gradeWithoutId } = grade;
            const response = await fetch('http://localhost:5108/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gradeWithoutId),
            });
    
            if (!response.ok) {
                // Handle the error, e.g., show an error message
                console.error('Failed to create grade:', response.statusText);
                return;
            } else {
                console.log("Grade created successfully");

                // Refetch the data after a successful creation
                fetchGradeData();
    
                // Use the student email as a path parameter in the email endpoint
                const emailResponse = await fetch(`http://localhost:5108/send-email/${grade.studentID}/${grade.courseID}`, {
                    method: 'GET', // Use GET if your backend is set up to handle GET requests
                });
    
                if (!emailResponse.ok) {
                    // Handle the error, e.g., log or show an error message
                    console.error('Failed to send email:', emailResponse.statusText);
                } else {
                    console.log('Email sent successfully');
                }
            }
        } catch (error) {
            console.error('Error creating grade:', error.message);
        }
    };
    

      const handleUpdate = async (grade) => {
        try {
          console.log('Updating grade:', grade);
          const response = await fetch(`http://localhost:5108/grade/${grade.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(grade),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update grade');
          }

          fetchGradeData();
      
          // Update the state with the updated course
          const updatedGradeData = gradeData.map(existingGrade =>
            existingGrade.id === grade.id ? { ...existingGrade, ...grade } : existingGrade
          );
      
          setGradeData(updatedGradeData);
        } catch (error) {
          console.error('Error updating grade:', error);
        }
      };

      const handleDelete = async (id) => {
        try {
          // Make an HTTP DELETE request to the server
          const response = await fetch(`http://localhost:5108/grade/${id}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            // If the server returns a successful response, update the state
            const updatedGradeData = gradeData.filter(grade => grade.id !== id);
            setGradeData(updatedGradeData);
          } else {
            // Handle error case
            console.error('Failed to delete grade');
          }
        } catch (error) {
          console.error('An error occurred during the delete request:', error);
        }
      };



    return (
      <Layout title="Grades">
        <div>
          <GradeList
            data={gradeData}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            courses={courses}
            students={students}
            registrations={registrations}
            teacher={userTeacherID}
          />
        </div>
        </Layout>
      );

}

export default GradeManagement;