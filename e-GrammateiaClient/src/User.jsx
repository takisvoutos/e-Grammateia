import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import UserList from './UserList';
import Layout from './Layout';

function UserManagement() {
  const [userData, setUserData] = useState([]);
  const [maxUserId, setMaxUserId] = useState(0);
  const [userDepartment, setUserDepartment] = useState(null);
  const [userDepartmentID, setUserDepartmentID] = useState(null);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {

      // Retrieve the user department id from cookies or state
      const userDepartmentIDFromCookie = Cookies.get('userDepartmentID');
      setUserDepartmentID(userDepartmentIDFromCookie);

      console.log(userDepartmentIDFromCookie);

      const response = await fetch(`http://localhost:5108/users/${userDepartmentIDFromCookie}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const usersData = await response.json();
      
      setUserData(usersData);
      setMaxUserId(Math.max(...usersData.map(user => user.id)));

      // Retrieve the user department from cookies or state
      const userDepartmentFromCookie = Cookies.get('userDepartment');
      setUserDepartment(userDepartmentFromCookie);

      console.log(userDepartmentFromCookie);


    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleCreate = async (user) => {
    try {
      // Omit the 'id' property from the user object
      const { id, ...userWithoutId } = user;
      const response = await fetch('http://localhost:5108/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userWithoutId),
      });
  
      if (!response.ok) {
        console.error('Failed to create user:', response.statusText);
        return;
      }else 
      {
        console.log("User created successfully");
        fetchUserData();
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };
  

  const handleUpdate = async (user) => {
    try {
      console.log('Updating user:', user);
      const response = await fetch(`http://localhost:5108/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      fetchUserData();
  
      // Update the state with the updated user
      const updatedUserData = userData.map(existingUser =>
        existingUser.id === user.id ? { ...existingUser, ...user } : existingUser
      );
  
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error, e.g., show an error message to the user
    }
  };  

  const handleDelete = async (id) => {
    try {
      // Make an HTTP DELETE request to the server
      const response = await fetch(`http://localhost:5108/user/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // If the server returns a successful response, update the state
        const updatedUserData = userData.filter(user => user.id !== id);
        setUserData(updatedUserData);
      } else {
        // Handle error case
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('An error occurred during the delete request:', error);
    }
  };
  

  return (
    <Layout title="Users">
       <div>
      <UserList
        data={userData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        userDepartment={userDepartment}
        userDepartmentID={userDepartmentID}
      />
    </div>
    </Layout>
   
  );
}

export default UserManagement;
