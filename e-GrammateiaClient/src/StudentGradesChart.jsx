import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 

const StudentGradesChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data.length > 0) {
      // Separate courses into succeeded and failed
      const succeededCourses = data.filter((registration) =>
        registration.grades.length > 0 ? registration.grades[0].grade >= 5 : false
      );
      const failedCourses = data.filter((registration) =>
        registration.grades.length > 0 ? registration.grades[0].grade < 5 : true
      );

      const succeededCount = succeededCourses.length;
      const failedCount = failedCourses.length;

      const chartData = {
        labels: ['Περασμένα μαθήματα', 'Χρωστούμενα μαθήματα'],
        datasets: [
          {
            data: [succeededCount, failedCount],
            backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,0,0,0.6)'],
            borderColor: ['rgba(75,192,192,1)', 'rgba(255,0,0,1)'],
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
    }
  }, [data]);

  return (
    <div style={{ width: '300px', height: '300px' }}>
      {chartData && (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      )}
    </div>
  );
};

export default StudentGradesChart;
