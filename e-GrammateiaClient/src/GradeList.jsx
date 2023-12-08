import { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton, Select, MenuItem,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Divider} from '@mui/material';
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

    const handleSubmit = (event) => {

        event.preventDefault();
      
        // Create a new grade object with the desired structure
        const newGrade = {
          id: formData.id,
          grade: formData.grade,
          exam: formData.exam,
          studentID: formData.studentID,
          courseID: formData.courseID,
          teacherID: teacher
        };
      
        if (editingId) {
          onUpdate(newGrade);
          setEditingId(null);
        } else {
          onCreate(newGrade);
        }
      
        setFormData({
            id: '', 
            grade: '', 
            exam: '',
            courseID: '',
            studentID: ''
        });
      
        // Log the new grade object after form submission
        console.log('Grade Data after submission:', newGrade);
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

    const getStudentsForCourse = () => {
      const studentsForSelectedCourse = registrations.filter(registration => registration.courseID === formData.courseID);
      
      return studentsForSelectedCourse.map(registration => {
        const student = students.find(s => s.studentID === registration.studentID);
        return (
          <MenuItem key={student.studentID} value={student.studentID}>
            {getStudentName(student.studentID)}
          </MenuItem>
        );
      });
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <TextField label="Βαθμός" name="grade" value={formData.grade} onChange={handleFormChange} />
          <TextField label="Εξεταστική" name="exam" value={formData.exam} onChange={handleFormChange} />
          <Select label="Μάθημα" name="courseID" value={formData.courseID} onChange={handleFormChange} displayEmpty>
            <MenuItem value="" disabled>Επιλέξτε μάθημα</MenuItem>
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
          </Select>
          <Select label="Φοιτητής" name="studentID" value={formData.studentID} onChange={handleFormChange} displayEmpty>
            <MenuItem value="" disabled>Επιλέξτε φοιτητή</MenuItem>
            {getStudentsForCourse()}
          </Select>
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