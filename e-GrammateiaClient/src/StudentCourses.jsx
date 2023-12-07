import React, { useState, useEffect } from 'react';
import StudentCoursesList from './StudentCoursesList';
import Layout from './Layout';
import Cookies from 'js-cookie';

function StudentGrades() {

    const [studentGradesData, setStudentGradesData] = useState([]);
    const [maxStudentGradesId, setMaxStudentGradesId] = useState(0);
    const [userStudentID, setUserStudentID] = useState(null);

    useEffect(() => {
        fetchStudentGradesDataData();
      }, []);

      const fetchStudentGradesDataData = async () => {

        try {
  
            // Retrieve the user student id from cookies or state
            const userStudentIDFromCookie = Cookies.get('userStudentID');
            setUserStudentID(userStudentIDFromCookie);
            
            const response = await fetch(`http://localhost:5108/registration/grade/${userStudentIDFromCookie}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch data from the server');
            }
      
            const registrationGradeData = await response.json();
            
            setStudentGradesData(registrationGradeData);
            setMaxStudentGradesId(Math.max(...registrationGradeData.map(registration => registration.id)));
  
      
          } catch (error) {
            console.error('Error fetching course grade data:', error);
          }
        };

        return (
            <Layout title="Student Grades">
            <div>
              <StudentCoursesList
                data={studentGradesData}
                userStudentID={userStudentID}
              />
            </div>
            </Layout>
          );

}

    


export default StudentGrades;