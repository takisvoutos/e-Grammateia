import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Layout from './Layout';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

const GeneratePDFButton = () => {
  const [userStudentID, setUserStudentID] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExistingPDF = async () => {
      try {
        // Retrieve the user student id from cookies or state
        const userStudentIDFromCookie = Cookies.get('userStudentID');
        setUserStudentID(userStudentIDFromCookie);

        // Make a request to check if a PDF file already exists on the server
        const response = await fetch(`http://localhost:5108/pdf/${userStudentIDFromCookie}`);
        if (response.ok) {

          const pdfURLFromServer = await response.text();

          // Remove leading and trailing quotes from the received PDF URL
          const cleanedPDFURL = pdfURLFromServer.replace(/^"(.*)"$/, '$1');

          setPdfURL(cleanedPDFURL);
        }
      } catch {
        console.error('Error checking for existing PDF:', error);
      }
    };

    fetchExistingPDF();
  }, []);

  const generatePDF = async () => {
    try {
      setIsLoading(true);

      // Make a request to the server endpoint to generate the PDF
      const response = await fetch(`http://localhost:5108/grade/student/${userStudentID}/pdf`);
      const pdfURLFromServer = await response.text();

      // Set the PDF URL in the state
      setPdfURL(pdfURLFromServer);

      // Open the generated PDF URL in a new window or tab
      window.open(pdfURLFromServer, '_blank');

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="GradesPDF">
    <div>
      {userStudentID && (
        <div>
          <Button onClick={generatePDF} disabled={isLoading} variant="contained" startIcon={<AddIcon />} style={{ textTransform: 'none' }}>
            {isLoading ? 'Έκδοση...' : 'Έκδοση αναλυτικής βαθμολογίας'}
          </Button>
          <Typography variant="h5" style={{ margin: '20px 0' }}>Διαθέσιμα πιστοποιητικά</Typography>
          {pdfURL && (
            <p>
              <a href={pdfURL} target="_blank" rel="noopener noreferrer">Αναλυτική Βαθμολογία</a>
            </p>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default GeneratePDFButton;
