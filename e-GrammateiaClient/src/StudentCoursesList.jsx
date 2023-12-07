import { useState, useEffect } from 'react';
import { Box,TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import { Divider, Typography } from '@mui/material';
import React from 'react';

function StudentCoursesList({data,userStudentID,error})
{

    // Group data by semester
    const groupedData = data.reduce((acc, item) => {
        const semester = item.registration.course ? item.registration.course.semester : 'N/A';

        if (!acc[semester]) {
        acc[semester] = [];
        }

        acc[semester].push(item);
        return acc;
    }, {});

    const getTextColor = (grade) => {
        if (grade >= 5) {
          return 'green';
        } else if (grade < 5 && grade !== null) {
          return 'red';
        } else {
          return 'inherit'; // Default color
        }
      };

    return (
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Μαθήματα</h2>
        {Object.keys(groupedData).map((semester) => (
        <React.Fragment key={semester}>
          <Typography variant="h5">{`Εξάμηνο ${semester}`}</Typography>
          <TableContainer sx={{ maxWidth: '80%', mt: 5, mb:5,  maxHeight: '800px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: 'lightgrey' }}>
                  <TableCell>Μάθημα</TableCell>
                  <TableCell>Βαθμός</TableCell>
                  <TableCell>Εξ. περίοδος</TableCell>
                  <TableCell>ECTS</TableCell>
                  <TableCell>Τύπος μαθήματος</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedData[semester].map((item) => (
                  <TableRow
                  key={item.registration.regId}>
                    <TableCell style={{ color: getTextColor(item.grades.length > 0 ? item.grades[0].grade : null) }}>{item.registration.course ? item.registration.course.name : 'N/A'}</TableCell>
                    <TableCell style={{ color: getTextColor(item.grades.length > 0 ? item.grades[0].grade : null) }}>{item.grades.length > 0 ? item.grades[0].grade : '-'}</TableCell>
                    <TableCell style={{ color: getTextColor(item.grades.length > 0 ? item.grades[0].grade : null) }}>{item.grades.length > 0 ? item.grades[0].exam : '-'}</TableCell>
                    <TableCell style={{ color: getTextColor(item.grades.length > 0 ? item.grades[0].grade : null) }}>{item.registration.course ? item.registration.course.ects : 'N/A'}</TableCell>
                    <TableCell style={{ color: getTextColor(item.grades.length > 0 ? item.grades[0].grade : null) }}>{item.registration.course ? item.registration.course.course_Type : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </React.Fragment>
      ))}

        {error && <p>{error}</p>}
      </Box>
    );
}


export default StudentCoursesList;