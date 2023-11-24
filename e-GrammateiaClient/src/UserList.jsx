import { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function UserList({ name, data, onCreate, onUpdate, onDelete, error, departments }) {

  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    username: '', 
    email: '', 
    role: '', 
    password: '',
    department: ''  });
    
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
  
    // Conditionally include the student property based on the role
    if (formData.role === 2) {
      newStudent.student = {
        departmentID: formData.department,
      };
    }

    // Conditionally include the teacher property based on the role
    if (formData.role === 1) {
      newStudent.teacher = {
        departmentID: formData.department,
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
      department: item.department.id
    });
  };
  

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ id: '', name: '', username: '', email: '', role: '', department: ''});
  };

  return (
    <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h2>{name}</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
      <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} />
      <TextField label="Username" name="username" value={formData.username} onChange={handleFormChange} />
      {editingId === null && (
    <>
      <TextField type="password" label="Password" name="password" value={formData.password} onChange={handleFormChange} />
      {/* <TextField type="password" label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} /> */}
    </>
  )}
      <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} />
      <Select label="Role" name="role" value={formData.role} onChange={handleFormChange}> 
          <MenuItem value={0}>Admin</MenuItem>
          <MenuItem value={1}>Teacher</MenuItem>
          <MenuItem value={2}>Student</MenuItem>
        </Select>

        <Select label="Department" name="department" value={formData.department} onChange={handleFormChange}>
          {departments.map(department => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
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
              primary={`Name: ${item.name}`}
              secondary={`Email: ${item.email}, Username: ${item.username}, Role: ${item.role}, Department: ${item.department ? item.department.id : 'N/A'}`}
            />
          </ListItem>
      ))}
    </List>
    {error && <p>{error}</p>}
  </Box>
);
}

export default UserList;
