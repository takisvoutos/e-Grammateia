import { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function CourseList({data,onCreate,onUpdate,onDelete,error,departments,teachers})
{

    const [formData, setFormData] = useState({ 
        id: '', 
        name: '', 
        semester: '',
        ects: '',
        type: '',
        teacher: '',
        department: '' });

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
      
        // Create a new course object with the desired structure
        const newCourse = {
          id: formData.id,
          name: formData.name,
          semester: formData.semester,
          ects: formData.ects,
          course_Type: formData.type,
          departmentID: formData.department,
          teacherID: formData.teacher,
        };
      
        if (editingId) {
          onUpdate(newCourse);
          setEditingId(null);
        } else {
          onCreate(newCourse);
        }
      
        setFormData({
            id: '', 
            name: '', 
            semester: '',
            ects: '',
            type: '',
            teacher: '',
            department: ''
        });
      
        // Log the new course object after form submission
        console.log('Course Data after submission:', newCourse);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
          id: item.id,
          name: item.name,
          semester: item.semester,
          ects: item.ects, 
          type: item.course_Type, // Use the correct property name
          department: item.department.id,
          teacher: item.teacher ? item.teacher.teacherID : '', // Use the correct property name
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ id: '', name: '', semester: '', ects: '', type: '', teacher: '', department: ''});
    };

    const getTeacherName = (teacherID) => {
        const teacher = teachers.find((t) => t.teacherID === teacherID);
        return teacher ? teacher.user.name : 'N/A';
      };


    return (
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Μαθήματα</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <TextField label="Όνομα μαθήματος" name="name" value={formData.name} onChange={handleFormChange} />
          <TextField label="Εξάμηνο" name="semester" value={formData.semester} onChange={handleFormChange} />
          <TextField label="ECTS" name="ects" value={formData.ects} onChange={handleFormChange} />
          <TextField label="Τύπος μαθήματος" name="type" value={formData.type} onChange={handleFormChange} />
          <Select label="Τμήμα" name="department" value={formData.department} onChange={handleFormChange}>
              {departments.map(department => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
            <Select label="Καθηγητής" name="teacher" value={formData.teacher} onChange={handleFormChange}>
              {teachers.map(teacher => (
                <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                  {teacher.user.name}
                </MenuItem>
              ))}
            </Select>
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
                  primary={`Μάθημα: ${item.name}`}
                  secondary={`Εξάμηνο: ${item.semester}, ECTS: ${item.ects}, Τύπος: ${item.course_Type}, Τμήμα: ${item.department ? item.department.name : 'N/A'}, Καθηγητής: ${getTeacherName(item.teacher ? item.teacher.teacherID : null)}`}
                />
              </ListItem>
          ))}
        </List>
        {error && <p>{error}</p>}
      </Box>
    );

}

export default CourseList;