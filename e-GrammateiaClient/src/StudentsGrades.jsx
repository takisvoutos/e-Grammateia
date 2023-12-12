import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import StudentGradesChart from './StudentGradesChart';

function StudentGrades() {
  const [studentGradesData, setStudentGradesData] = useState([]);
  const [maxStudentGradesId, setMaxStudentGradesId] = useState(0);
  const [userStudentID, setUserStudentID] = useState(null);

  useEffect(() => {
    fetchStudentGradesData();
  }, []);

  const fetchStudentGradesData = async () => {
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
      setMaxStudentGradesId(Math.max(...registrationGradeData.map((registration) => registration.id)));
    } catch (error) {
      console.error('Error fetching course grade data:', error);
    }
  };

  return (   
      <div>
        <StudentGradesChart data={studentGradesData} />
      </div>
  );
}

export default StudentGrades;
