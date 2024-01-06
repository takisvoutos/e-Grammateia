import { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton, Select, MenuItem,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Divider,List,ListItem,Typography} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import React from 'react';

function GradeList({data,onCreate,onUpdate,onDelete,error,students,courses,teacher,registrations})
{
    const [formData, setFormData] = useState({ 
        id: '', 
        grade: '', 
        exam: '',
        courseID: '',
        studentID: '' });

    const [editingId, setEditingId] = useState(null);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value,
        }));
    };

    // const handleSubmit = (event) => {

    //     event.preventDefault();
      
    //     // Create a new grade object with the desired structure
    //     const newGrade = {
    //       id: formData.id,
    //       grade: formData.grade,
    //       exam: formData.exam,
    //       studentID: formData.studentID,
    //       courseID: formData.courseID,
    //       teacherID: teacher
    //     };
      
    //     if (editingId) {
    //       onUpdate(newGrade);
    //       setEditingId(null);
    //     } else {
    //       onCreate(newGrade);
    //     }
      
    //     setFormData({
    //         id: '', 
    //         grade: '', 
    //         exam: '',
    //         courseID: '',
    //         studentID: ''
    //     });
      
    //     // Log the new grade object after form submission
    //     console.log('Grade Data after submission:', newGrade);
    // };

    const handleSubmit = (event) => {
      event.preventDefault();
    
      const studentsForSelectedCourse = registrations.filter(registration => registration.courseID === formData.courseID);
    
      // Create an array to store new grades
      const newGrades = studentsForSelectedCourse
        .map((registration) => {
          const student = students.find(s => s.studentID === registration.studentID);
    
          // Check if the grade for the student is present and valid
          const gradeValue = formData[`grade-${student.studentID}`];
          if (gradeValue !== undefined && gradeValue !== '' && !isNaN(gradeValue) && gradeValue >= 1 && gradeValue <= 10) {
            return {
              id: formData.id,
              grade: gradeValue,
              exam: formData.exam,
              studentID: student.studentID,
              courseID: formData.courseID,
              teacherID: teacher,
            };
          } else {
            return null; // Skip creating a grade for this student
          }
        })
        .filter(grade => grade !== null);
    
      // Make a separate POST request for each valid student with a grade
      newGrades.forEach((newGrade) => {
        if (editingId) {
          onUpdate(newGrade);
        } else {
          onCreate(newGrade);
        }
      });
    
      // Reset the form data
      setFormData({
        id: '',
        grade: '',
        exam: '',
        courseID: '',
        studentID: '',
      });
    
      // Reset the editing state
      setEditingId(null);
    };
    
    

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
          id: item.id,
          grade: item.grade,
          exam: item.exam,
          studentID: item.studentID, 
          courseID: item.courseID
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ id: '', grade: '', exam: '', studentID: '', courseID: ''});
    };

    const getStudentName = (studentID) => {
        const student = students.find((s) => s.studentID === studentID);
        return student ? student.user.name : 'N/A';
    };

    // const getStudentsForCourse = () => {
    //   const studentsForSelectedCourse = registrations.filter(registration => registration.courseID === formData.courseID);
      
    //   return studentsForSelectedCourse.map(registration => {
    //     const student = students.find(s => s.studentID === registration.studentID);
    //     return (
    //       <MenuItem key={student.studentID} value={student.studentID}>
    //         {getStudentName(student.studentID)}
    //       </MenuItem>
    //     );
    //   });
    // };

    const getStudentsForCourse = () => {
      const studentsForSelectedCourse = registrations.filter(registration => registration.courseID === formData.courseID);
    
      return studentsForSelectedCourse.map((registration, index) => {
        const student = students.find(s => s.studentID === registration.studentID);

        // Check if the student already has a grade for the selected course
        const existingGrade = data.find(grade => grade.studentID === student.studentID && grade.courseID === formData.courseID);

        console.log(existingGrade);

    // Exclude students with existing grades
      if (!existingGrade) {
        return (
          <React.Fragment key={student.studentID}>
            <ListItem>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Typography>{getStudentName(student.studentID)}</Typography>
                <TextField
                  type="number"
                  label="Βαθμός"
                  inputProps={{ min: 1.0, max: 10.0, step: 0.1}}
                  name={`grade-${student.studentID}`}
                  value={formData[`grade-${student.studentID}`] || ''}
                  onChange={handleFormChange}
                  sx={{ width: '100px' }}
                />
              </Box>
            </ListItem>
            {index < studentsForSelectedCourse.length - 1 && <Divider />}
          </React.Fragment>
        );
        }else {
          return null; // Skip displaying students with existing grades
        }
      }).filter(student => student !== null);
    };
    

    // Function to filter data by course ID
    const filterDataByCourse = (courseID) => data.filter((item) => item.courseID === courseID);

    // Iterate over unique courses and create separate tables
    const courseTables = courses.map((course) => {
    const courseData = filterDataByCourse(course.id);

      return (
        <React.Fragment key={course.id}>
          <h3>{course.name}</h3>
          <TableContainer sx={{ maxWidth: '80%', mt: 3, maxHeight: '500px', overflowY: 'auto' }}>
            <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'lightgrey' }}>
                <TableCell>Βαθμός</TableCell>
                <TableCell>Εξεταστική</TableCell>
                <TableCell>Φοιτητής</TableCell>
                <TableCell>Ενέργειες</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell>{item.exam}</TableCell>
                  <TableCell>{getStudentName(item.student ? item.student.studentID : null)}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => onDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      );
    });

    
    
      
    return (
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Νέος βαθμός</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <p>Επιλέξτε μάθημα προς βαθμολόγηση</p>
        <Select label="Μάθημα" name="courseID" value={formData.courseID} onChange={handleFormChange} displayEmpty>
          <MenuItem value="" disabled>Επιλέξτε μάθημα</MenuItem>
          {courses.map(course => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
        {formData.courseID && (
          <List sx={{ mt: 3 }}>
            {getStudentsForCourse()}
          </List>
        )}
        <p>Εξεταστική περίοδος βαθμολόγησης</p>
        <TextField label="Εξεταστική" name="exam" value={formData.exam} onChange={handleFormChange} />
        <Button sx={{ mr: 1 }} variant="contained" type="submit">{editingId === null ? 'ΔΗΜΙΟΥΡΓΙΑ' : 'ΕΝΗΜΕΡΩΣΗ'}</Button>
        {editingId !== null && <Button variant="contained" color="secondary" onClick={handleCancelEdit}>ΑΚΥΡΩΣΗ</Button>}
      </form>
        <Divider sx={{ width: '80%', my: 3 }} /> 
        <h2>Βαθμοί ανά μάθημα</h2>
        {courseTables}
        {error && <p>{error}</p>}
      </Box>
    );

}

export default GradeList;