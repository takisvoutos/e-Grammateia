import React from 'react';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Typography } from '@mui/material';

const UserDetails = ({ userInfo }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Στοιχεία Προφίλ</h2>
      <TableContainer sx={{ maxWidth: '80%', mt: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Όνομα
              </TableCell>
              <TableCell>{userInfo.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Username
              </TableCell>
              <TableCell>{userInfo.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Email
              </TableCell>
              <TableCell>{userInfo.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Τμήμα
              </TableCell>
              <TableCell>{userInfo.departmentName}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ mb: 3, mt: 2 }} />
    </Box>
  );
};

export default UserDetails;
