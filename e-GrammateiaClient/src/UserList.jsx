import { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function UserList({data, onCreate, onUpdate, onDelete, error, departments, userDepartment, userDepartmentID }) {

  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    username: '', 
    email: '', 
    role: '', 
    password: '',
    department: '',
    studentNumber: ''  });
    
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
  
    // Create a new student object with the desired structure
    const newStudent = {
      id: formData.id,
      name: formData.name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: formData.role,
    };
  
    // Conditionally include the role-specific properties based on the role
    if (formData.role === 2) {
      if (editingId) {
        newStudent.student = {
          departmentID: userDepartmentID,
          studentNumber: formData.studentNumber,
        };
      } else {
        newStudent.student = {
          departmentID: userDepartmentID,
        };
      }
    } else if (formData.role === 1) {
      newStudent.teacher = {
        departmentID: userDepartmentID,
      };
    } else if (formData.role === 0) {
      newStudent.secretary = {
        departmentID: userDepartmentID,
      };
    }
  
    if (editingId) {
      onUpdate(newStudent);
      setEditingId(null);
    } else {
      onCreate(newStudent);
    }
  
    setFormData({
      id: '',
      name: '',
      username: '',
      email: '',
      role: '',
      password: '',
      department: '',
    });
  
    // Log the newStudent object after form submission
    console.log('Student Data after submission:', newStudent);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      id: item.id,
      name: item.name,
      username: item.username,
      email: item.email, 
      role: item.role,
      department: userDepartmentID,
      studentNumber: item.studentNumber || '',
    });
  };
  

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ id: '', name: '', username: '', email: '', role: '', department: '', studentNumber: ''});
  };

  const students = data.filter((item) => item.role === 2);
  const teachers = data.filter((item) => item.role === 1);

  return (
    <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h2>Διαχείριση φοιτητών/καθηγητών</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
      <TextField label="Όνομα" name="name" value={formData.name} onChange={handleFormChange} />
      <TextField label="Όνομα χρήστη" name="username" value={formData.username} onChange={handleFormChange} />
      {editingId === null && (
    <>
      <TextField type="password" label="Κωδικός" name="password" value={formData.password} onChange={handleFormChange} />
      {/* <TextField type="password" label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} /> */}
    </>
  )}
      <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} />
      <Select label="Ρόλος" name="role" value={formData.role} onChange={handleFormChange}> 
          {/* <MenuItem value={0}>Admin</MenuItem> */}
          <MenuItem value={1}>Καθηγητής</MenuItem>
          <MenuItem value={2}>Φοιτητής</MenuItem>
        </Select>
       <TextField
        label={'Τμήμα'}
        name="department"
        value={userDepartment || ''}
        onChange={handleFormChange}
        disabled={editingId !== null}
      />
        {formData.role === 2 && editingId !== null && (
          <TextField
            label="Μητρώο"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleFormChange}
          />
        )}

      <Button sx={{ mr: 1 }} variant="contained" type="submit">{editingId === null ? 'ΔΗΜΙΟΥΡΓΙΑ' : 'ΕΝΗΜΕΡΩΣΗ'}</Button>
      {editingId !== null && <Button variant="contained" color="secondary" onClick={handleCancelEdit}>ΑΚΥΡΩΣΗ</Button>}
    </form>
      {/* Students Table */}
      <TableContainer sx={{ maxWidth: '80%', mt: 3, maxHeight: '500px', overflowY: 'auto' }}>
        <h3>Φοιτητές</h3>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: 'lightgrey' }}>
              <TableCell>Όνομα</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ρόλος</TableCell>
              <TableCell>Τμήμα</TableCell>
              <TableCell>Μητρώο</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.department ? item.department.name : 'N/A'}</TableCell>
                <TableCell>{item.studentNumber}</TableCell>
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

      {/* Teachers Table */}
      <TableContainer sx={{ maxWidth: '80%', mt: 3, maxHeight: '500px', overflowY: 'auto' }}>
        <h3>Καθηγητές</h3>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: 'lightgrey' }}>
              <TableCell>Όνομα</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ρόλος</TableCell>
              <TableCell>Τμήμα</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.department ? item.department.name : 'N/A'}</TableCell>
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
    {error && <p>{error}</p>}
  </Box>
);
}

export default UserList;
