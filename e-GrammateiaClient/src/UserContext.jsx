import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedData = sessionStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : { name: '', username: '', email: '', departmentName: '' };
  });

  const setUserInfo = (name, username, email, departmentName) => {
    const newUserData = { name, username, email, departmentName };
    setUserData(newUserData);
    sessionStorage.setItem('userData', JSON.stringify(newUserData));
  };

  return (
    <UserContext.Provider value={{ userData, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
