import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Layout from './Layout';
import Grades from './StudentsGrades';
import CourseAverage from './CourseAverage';
import TeacherCourse from './TeacherCourse';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {

  const authTokenNEW = Cookies.get('authTokenNEW');
  const decoded = jwtDecode(authTokenNEW);
  const userRole = decoded.role;
  console.log(userRole);

return (
    <Layout title="Dashboard">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              {userRole === 'Student' && (
              <Grid item xs={12} md={8} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 450,
                  }}
                >
                <h3>Σύνοψη μαθημάτων</h3>
                  <Grades />
                </Paper>
              </Grid>
              )}
              {/* Average Grade */}
              {userRole === 'Student' && (
              <Grid item xs={12} md={4} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 450,
                  }}
                >
                  <CourseAverage />
                </Paper>
              </Grid>
              )}
              {/* Recent Orders */}
              {userRole === 'Teacher' && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TeacherCourse />
                </Paper>
              </Grid>
              )}
            </Grid>
          </Container>
    </Layout>
    );
}