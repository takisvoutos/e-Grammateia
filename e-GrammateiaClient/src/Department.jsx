import React, { useState, useEffect } from 'react';
import DepartmentList from './DepartmentList';
import Layout from './Layout';


function DepartmentManagement() {

  const [departmentData, setDepartmentData] = useState([]);
  const [maxDepartmentId, setMaxDepartmenId] = useState(0);

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      
      const response = await fetch('http://localhost:5108/departments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const departmentsData = await response.json();
      
      setDepartmentData(departmentsData);
      setMaxDepartmenId(Math.max(...departmentsData.map(department => department.id)));

    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const handleCreate = async (department) => {
    try {
      // Omit the 'id' property from the user object
      const { id, ...departmentWithoutId } = department;
      const response = await fetch('http://localhost:5108/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentWithoutId),
      });
  
      if (!response.ok) {
        console.error('Failed to create department:', response.statusText);
        return;
      }else 
      {
        console.log("Department created successfully");
      }
    } catch (error) {
      console.error('Error creating department:', error.message);
    }
  };

  const handleUpdate = async (department) => {
    try {
      console.log('Updating department:', department);
      const response = await fetch(`http://localhost:5108/department/${department.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update department');
      }
  
      // Update the state with the updated department
      const updatedDepartmentData = departmentData.map(existingDepartment =>
        existingDepartment.id === department.id ? { ...existingDepartment, ...department } : existingDepartment
      );
  
      setDepartmenData(updatedDepartmentData);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      // Make an HTTP DELETE request to the server
      const response = await fetch(`http://localhost:5108/department/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // If the server returns a successful response, update the state
        const updatedDepartmentData = departmentData.filter(department => department.id !== id);
        setDepartmenData(updatedDepartmentData);
      } else {
        // Handle error case
        console.error('Failed to delete department');
      }
    } catch (error) {
      console.error('An error occurred during the delete request:', error);
    }
  };


  return (
    <Layout title="Departments">
    <div>
      <DepartmentList
        data={departmentData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
    </Layout>
  );

}

export default DepartmentManagement;