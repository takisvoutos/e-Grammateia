import React, { useState, useEffect } from 'react';
import CourseList from './CourseList';
import Layout from './Layout';
import Cookies from 'js-cookie';

function CourseManagement() {

    const [courseData, setCourseData] = useState([]);
    const [maxCourseId, setMaxCourseId] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [userDepartment, setUserDepartment] = useState(null);
    const [userDepartmentID, setUserDepartmentID] = useState(null);

    useEffect(() => {
        fetchCourseData();
      }, []);

      const fetchCourseData = async () => {
        try {

          // Retrieve the user department id from cookies or state
          const userDepartmentIDFromCookie = Cookies.get('userDepartmentID');
          setUserDepartmentID(userDepartmentIDFromCookie);

          console.log(userDepartmentIDFromCookie);

          // Retrieve the user department from cookies or state
          const userDepartmentFromCookie = Cookies.get('userDepartment');
          setUserDepartment(userDepartmentFromCookie);

          console.log(userDepartmentFromCookie);
          
          const response = await fetch(`http://localhost:5108/courses/byDepartment/${userDepartmentIDFromCookie}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
          }
    
          const coursesData = await response.json();
          
          setCourseData(coursesData);
          setMaxCourseId(Math.max(...coursesData.map(course => course.id)));

          // Fetch teacher data
          const teacherResponse = await fetch(`http://localhost:5108/teachers/${userDepartmentIDFromCookie}`);
          if (!teacherResponse.ok) {
            throw new Error('Failed to fetch teacher data from the server');
          }
          const teacherData = await teacherResponse.json();
          setTeachers(teacherData);
    
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      };

      const handleCreate = async (course) => {
        try {
          // Omit the 'id' property from the course object
          const { id, ...courseWithoutId } = course;
          const response = await fetch('http://localhost:5108/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseWithoutId),
          });
      
          if (!response.ok) {
            // Handle the error, e.g., show an error message
            console.error('Failed to create course:', response.statusText);
            return;
          }else 
          {
            console.log("Course created successfully");
            fetchCourseData();
          }
        } catch (error) {
          console.error('Error creating course:', error.message);
          // Handle the error, e.g., show an error message
        }
      };

      const handleUpdate = async (course) => {
        try {
          console.log('Updating course:', course);
          const response = await fetch(`http://localhost:5108/courses/${course.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update course');
          }

          fetchCourseData();
      
          // Update the state with the updated course
          const updatedCourseData = courseData.map(existingCourse =>
            existingCourse.id === course.id ? { ...existingCourse, ...course } : existingCourse
          );
      
          setCourseData(updatedCourseData);
        } catch (error) {
          console.error('Error updating course:', error);
        }
      };
      
      const handleDelete = async (id) => {
        try {
          // Make an HTTP DELETE request to the server
          const response = await fetch(`http://localhost:5108/course/${id}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            // If the server returns a successful response, update the state
            const updatedCourseData = courseData.filter(course => course.id !== id);
            setCourseData(updatedCourseData);
          } else {
            // Handle error case
            console.error('Failed to delete course');
          }
        } catch (error) {
          console.error('An error occurred during the delete request:', error);
        }
      };

      return (
        <Layout title="Courses">
        <div>
          <CourseList
            data={courseData}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            teachers={teachers}
            userDepartment={userDepartment}
            userDepartmentID={userDepartmentID}
          />
        </div>
        </Layout>
      );
}

export default CourseManagement;