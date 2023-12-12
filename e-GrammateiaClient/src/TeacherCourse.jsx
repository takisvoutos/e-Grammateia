import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider} from '@mui/material';

function TeacherCourse() {

    const [courses, setCourses] = useState([]);
    const [userTeacherID, setUserTeacherID] = useState(null);

    useEffect(() => {
        fetchTeacherCourseData();
    }, []);

    const fetchTeacherCourseData = async () => {

        // Retrieve the teacher id from cookies or state
        const userTeacherIDFromCookie = Cookies.get('userTeacherID');
        setUserTeacherID(userTeacherIDFromCookie);

        // Fetch course data
        const courseResponse = await fetch(`http://localhost:5108/courses/teacher/${userTeacherIDFromCookie}`);
        if (!courseResponse.ok) {
        throw new Error('Failed to fetch course data from the server');
        }
        const courseData = await courseResponse.json();
        setCourses(courseData);
    }   

    return (
        <TableContainer>
            <h3>Μαθήματα</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Μάθημα</TableCell>
                <TableCell>Τύπος</TableCell>
                <TableCell>Εξάμηνο</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.course_Type}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );

}

export default TeacherCourse;