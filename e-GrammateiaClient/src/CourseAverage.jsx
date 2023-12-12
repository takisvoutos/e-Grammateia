import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';

function CourseAverage() {
    const [gradesData, setGradesData] = useState([]);
    const [maxGradesId, setMaxGradesId] = useState(0);
    const [userStudentID, setUserStudentID] = useState(null);
    const [averageGrade, setAverageGrade] = useState(null);
    const [typeSums, setTypeSums] = useState({});
    const [passingGrades, setPassingGrades] = useState([]);


    useEffect(() => {
      fetchGradesData();
    }, []);
  
    const fetchGradesData = async () => {
      try {
        // Retrieve the user student id from cookies or state
        const userStudentIDFromCookie = Cookies.get('userStudentID');
        setUserStudentID(userStudentIDFromCookie);
  
        const response = await fetch(`http://localhost:5108/grade/student/${userStudentIDFromCookie}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
  
        const registrationGradeData = await response.json();
  
        setGradesData(registrationGradeData);
        setMaxGradesId(Math.max(...registrationGradeData.map((registration) => registration.id)));

        // Calculate the average grade for grades >= 5
        const filteredPassingGrades = registrationGradeData.filter(registration => registration.grade >= 5);
        const totalPassingGrades = filteredPassingGrades.reduce((sum, registration) => sum + registration.grade, 0);
        const average = totalPassingGrades / (filteredPassingGrades.length || 1); // Avoid division by zero
        setAverageGrade(average);

        // Update the state with passingGrades
        setPassingGrades(filteredPassingGrades);

        // Calculate typeSums and update the state
        const calculatedTypeSums = calculateTypeSums(filteredPassingGrades);
        setTypeSums(calculatedTypeSums);
      } catch (error) {
        console.error('Error fetching grade data:', error);
      }
    };

    const calculateTypeSums = (grades) => {
      return grades.reduce((typeMap, registration) => {
        const { course_Type, ects } = registration.course;
  
        if (!typeMap[course_Type]) {
          typeMap[course_Type] = {
            count: 0,
            totalEcts: 0,
          };
        }
  
        typeMap[course_Type].count++;
        typeMap[course_Type].totalEcts += ects;
  
        return typeMap;
      }, {});
    };
  
  
      return (
        <div>
          {averageGrade !== null && (
            <div>
              <strong><p>Μ.Ο. Μαθημάτων: {averageGrade.toFixed(2)}</p></strong>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Τύπος</TableCell>
                      <TableCell>Πλήθος</TableCell>
                      <TableCell>ECTS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(typeSums).map(([typeName, type]) => (
                      <TableRow key={typeName}>
                        <TableCell>{typeName}</TableCell>
                        <TableCell>{type.count}</TableCell>
                        <TableCell>{type.totalEcts}</TableCell>
                      </TableRow>
                    ))}
                    {/* Add a row for the sum of each column */}
                    <TableRow>
                      <TableCell>
                        <strong>Σύνολο</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{passingGrades.length}</strong>
                      </TableCell>
                      <TableCell>
                        <strong>
                          {passingGrades.reduce((sum, registration) => sum + registration.course.ects, 0)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      );
      
      
      
  }
  
  export default CourseAverage;