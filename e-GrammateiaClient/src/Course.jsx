import React, { useState, useEffect } from 'react';
import CourseList from './CourseList';

function CourseManagement() {

    const [courseData, setCourseData] = useState([]);
    const [maxCourseId, setMaxCourseId] = useState(0);
    const [departments, setDepartments] = useState([]); 
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchCourseData();
      }, []);

      const fetchCourseData = async () => {
        try {
          
          const response = await fetch('http://localhost:5108/courses');
          
          if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
          }
    
          const coursesData = await response.json();
          
          setCourseData(coursesData);
          setMaxCourseId(Math.max(...coursesData.map(course => course.id)));

          // Fetch department data
          const departmentResponse = await fetch('http://localhost:5108/departments');
          if (!departmentResponse.ok) {
            throw new Error('Failed to fetch department data from the server');
          }
          const departmentData = await departmentResponse.json();
          setDepartments(departmentData);

          // Fetch teacher data
          const teacherResponse = await fetch('http://localhost:5108/teachers');
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
        <div>
          <CourseList
            data={courseData}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            departments={departments}
            teachers={teachers}
          />
        </div>
      );
}

export default CourseManagement;