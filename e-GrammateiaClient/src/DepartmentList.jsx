import { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem,} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function DepartmentList({data,onCreate,onUpdate,onDelete,error})
{

    const [formData, setFormData] = useState({ 
        id: '', 
        name: '', 
        school: '' });

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

        // Create a new department object with the desired structure
        const newDepartment = {
            id: formData.id,
            name: formData.name,
            school: formData.school,
        };

        if (editingId) {
            onUpdate(newDepartment);
            setEditingId(null);
        } else {
            onCreate(newDepartment);
        }

        setFormData({
            id: '',
            name: '',
            school: '',
        });

        // Log the new Department object after form submission
        console.log('Department Data after submission:', newDepartment);
            
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
          id: item.id,
          name: item.name,
          school: item.school
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ id: '', name: '', school: ''});
    };

    return (
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Departments</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <TextField label="Τμήμα" name="name" value={formData.name} onChange={handleFormChange} />
          <TextField label="Σχολή" name="school" value={formData.school} onChange={handleFormChange} />
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
                  primary={`Τμήμα: ${item.name}`}
                  secondary={`${item.school}`}
                />
              </ListItem>
          ))}
        </List>
        {error && <p>{error}</p>}
      </Box>
    );


}

export default DepartmentList;