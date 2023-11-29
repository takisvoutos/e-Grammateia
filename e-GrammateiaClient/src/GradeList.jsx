import { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function GradeList({data,onCreate,onUpdate,onDelete,error,students,courses})
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

    return (
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Grades</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <TextField label="Βαθμός" name="grade" value={formData.grade} onChange={handleFormChange} />
          <TextField label="Εξεταστική" name="exam" value={formData.exam} onChange={handleFormChange} />
          <Select label="Μάθημα" name="courseID" value={formData.courseID} onChange={handleFormChange}>
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>

          <TextField label="Φοιτητής" name="studentID" value={formData.studentID} onChange={handleFormChange} />
          <Button sx={{ mr: 1 }} variant="contained" type="submit">{editingId === null ? 'Create' : 'Update'}</Button>
          {editingId !== null && <Button variant="contained" color="secondary" onClick={handleCancelEdit}>Cancel</Button>}
        </form>
        <List sx={{ width: '100%', maxWidth: 360 }}>
          {data.map(item => (
            <ListItem key={item.id} secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                  <Delete />
                </IconButton>
              </>
            }>
             <ListItemText
                  primary={`Μάθημα: ${item.course ? item.course.name : 'N/A'}`}
                  secondary={`Βαθμός: ${item.grade}, Εξεταστική: ${item.exam}, Φοιτητής: ${getStudentName(item.student ? item.student.studentID : null)}`}
                />
              </ListItem>
          ))}
        </List>
        {error && <p>{error}</p>}
      </Box>
    );

}

export default GradeList;