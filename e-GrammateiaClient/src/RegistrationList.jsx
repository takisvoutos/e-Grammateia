import { useState, useEffect } from 'react';
import { Button, Box, IconButton,Checkbox,FormControlLabel, FormControl,TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import { Divider, Typography } from '@mui/material';
import React from 'react';



function RegistrationList({data,onCreate,onUpdate,error,students,courses,userStudentID})
{
    
    const [formData, setFormData] = useState({ 
        id: '',
        courseIDs: []});

        const [editingId, setEditingId] = useState(null);

        const handleFormChange = (event) => {
          const { name, value, checked } = event.target;
        
          if (name === 'courseIDs') {
            setFormData((prevData) => ({
              ...prevData,
              courseIDs: checked
                ? [...prevData.courseIDs, value]
                : prevData.courseIDs.filter((id) => id !== value),
            }));
          }
        };

        const handleSubmit = (event) => {

            event.preventDefault();

            let newRegistration;

            console.log('formData.courseIDs:', formData.courseIDs);
          
            // Iterate over each courseID and make a separate POST request
            for (const courseID of formData.courseIDs) {
              // Create a new registration object with the desired structure
              newRegistration = {
                id: formData.id,
                studentID: userStudentID,
                courseID: courseID,
              };

              console.log('Registration Data after submission:', newRegistration);

              try {
                if (editingId) {
                  onUpdate(newRegistration);
                  setEditingId(null);
                } else {
                  onCreate(newRegistration);
                }

                // Log the new registration object after form submission
                console.log('Registration Data after submission:', newRegistration);
              } catch (error) {
                // Handle errors if needed
                console.error('Error during POST request:', error);
              }
            }
          
            setFormData({
                id: '',
                courseIDs: [],
            });
          
            // Log the new registration object after form submission
            console.log('Registration Data after submission:', newRegistration);
        };

        const getStudentName = (studentID) => {
            const student = students.find((s) => s.studentID === studentID);
            return student ? student.user.name : 'N/A';
        };

        const isCourseRegistered = (courseId) => {
          return data.some((item) => item.courseID === courseId);
        };
        
       const organizeDataBySemester = (registrationData, allCourses) => {
          const organizedData = registrationData.reduce((acc, item) => {
            const semester = item.course ? item.course.semester : 'N/A';

            if (!acc[semester]) {
              acc[semester] = [];
            }

            acc[semester].push(item);

            return acc;
          }, {});

          // Organize courses by semester
          const organizedCourses = allCourses.reduce((acc, course) => {
            const semester = course.semester || 'N/A';

            if (!acc[semester]) {
              acc[semester] = [];
            }

            acc[semester].push(course);

            return acc;
          }, {});

          return { organizedData, organizedCourses };
        };

        const { organizedData, organizedCourses } = organizeDataBySemester(data, courses);

        
        return (
            <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Δήλωση μαθημάτων</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                <FormControl>
                  {Object.entries(organizedCourses).map(([semester, semesterCourses]) => (
                    <React.Fragment key={semester}>
                      <Divider />
                      <Typography variant="subtitle1" mt={2}>{`Εξάμηνο ${semester}`}</Typography>
                      {semesterCourses.map((course) => (
                        <FormControlLabel
                          key={course.id}
                          control={
                            <Checkbox
                              name="courseIDs"
                              value={course.id}
                              onChange={handleFormChange}
                              disabled={isCourseRegistered(course.id)}
                            />
                          }
                          label={course.name}
                          labelPlacement="end"
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </FormControl>

              <Button sx={{ mr: 1 }} variant="contained" type="submit">{editingId === null ? 'ΔΗΛΩΣΗ' : 'Update'}</Button>
              {/* {editingId !== null && <Button variant="contained" color="secondary" onClick={handleCancelEdit}>Cancel</Button>} */}
            </form>
            <h3>Δηλώσεις μαθημάτων ανά εξάμηνο</h3>
           {Object.entries(organizedData).map(([semester, semesterData]) => (
              <React.Fragment key={semester}>
                <h3>{`Εξάμηνο ${semester}`}</h3>
                <TableContainer sx={{ maxWidth: '100%', mt: 3, maxHeight: '800px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow style={{ backgroundColor: 'lightgrey' }}>
                        <TableCell>Μάθημα</TableCell>
                        <TableCell>Τύπος μαθήματος</TableCell>
                        <TableCell>ECTS</TableCell>
                        <TableCell>Φοιτητής</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {semesterData.map((item) => (
                        <TableRow key={item.regId}>
                          <TableCell>{item.course ? item.course.name : 'N/A'}</TableCell>
                          <TableCell>{item.course ? item.course.course_Type : 'N/A'}</TableCell>
                          <TableCell>{item.course ? item.course.ects : 'N/A'}</TableCell>
                          <TableCell>{getStudentName(item.student ? item.student.studentID : null)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            ))}

            {error && <p>{error}</p>}
          </Box>
        );
}

export default RegistrationList;