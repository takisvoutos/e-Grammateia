import { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton, Select, MenuItem,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Typography } from '@mui/material';


function CourseList({data,onCreate,onUpdate,onDelete,error,teachers, userDepartment, userDepartmentID})
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
          departmentID: userDepartmentID,
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
          {/* <TextField label="Εξάμηνο" name="semester" value={formData.semester} onChange={handleFormChange} /> */}
          <TextField
            label="Εξάμηνο"
            name="semester"
            type="number"
            inputProps={{ min: 1, max: 8, step: 1 }}
            value={formData.semester}
            onChange={handleFormChange}
            sx={{ width: '100px' }}
          />
          <TextField label="ECTS" name="ects" value={formData.ects} onChange={handleFormChange}/>
          <Select
            label="Τύπος μαθήματος"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Τύπος μαθήματος</MenuItem>
            <MenuItem value="ΥΠΟΧΡΕΩΤΙΚΟ">ΥΠΟΧΡΕΩΤΙΚΟ</MenuItem>
            <MenuItem value="ΕΠΙΛΟΓΗΣ">ΕΠΙΛΟΓΗΣ</MenuItem>
          </Select>
          {/* <TextField label="Τύπος μαθήματος" name="type" value={formData.type} onChange={handleFormChange} /> */}
          <TextField
              label={'Τμήμα'}
              name="department"
              value={userDepartment || ''}
              onChange={handleFormChange}
              disabled={editingId !== null}
           />
            <Select label="Καθηγητής" name="teacher" value={formData.teacher} onChange={handleFormChange} displayEmpty>
            <MenuItem value="" disabled>
              Επιλέξτε Καθηγητή
            </MenuItem>
              {teachers.map(teacher => (
                <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                  {teacher.user.name}
                </MenuItem>
              ))}
            </Select>
          <Button sx={{ mr: 1 }} variant="contained" type="submit">{editingId === null ? 'ΔΗΜΙΟΥΡΓΙΑ' : 'ΕΝΗΜΕΡΩΣΗ'}</Button>
          {editingId !== null && <Button variant="contained" color="secondary" onClick={handleCancelEdit}>ΑΚΥΡΩΣΗ</Button>}
        </form>

      <TableContainer sx={{ maxWidth: '80%', mt: 3, maxHeight: '500px', overflowY: 'auto' }}>
        <h3>Μαθήματα</h3>

      {Array.from(new Set(data.map(item => item.semester))).map((semester, index) => (
          <div key={index}>
            <Typography variant="h6" gutterBottom>
              Εξάμηνο {semester}
            </Typography>

            <Table sx={{ mt: 1 }}>
              <TableHead>
                <TableRow style={{ backgroundColor: 'lightgrey' }}>
                  <TableCell>Μάθημα</TableCell>
                  <TableCell>Εξάμηνο</TableCell>
                  <TableCell>ECTS</TableCell>
                  <TableCell>Τύπος</TableCell>
                  <TableCell>Τμήμα</TableCell>
                  <TableCell>Καθηγητής</TableCell>
                  <TableCell>Ενέργειες</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .filter(item => item.semester === semester)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.semester}</TableCell>
                      <TableCell>{item.ects}</TableCell>
                      <TableCell>{item.course_Type}</TableCell>
                      <TableCell>{item.department ? item.department.name : 'N/A'}</TableCell>
                      <TableCell>{getTeacherName(item.teacher ? item.teacher.teacherID : null)}</TableCell>
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
          </div>
        ))}
      </TableContainer>
        {error && <p>{error}</p>}
      </Box>
    );

}

export default CourseList;