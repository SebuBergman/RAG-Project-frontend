import React, { useEffect, useState, useRef } from "react";
import { fetchPDFs, queryAPI, uploadPDF } from "../components/API_request";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pdfs, setPDFs] = useState<{ file_name: string; file_path: string }[]>(
    []
  );
  const [selectedPDF, setSelectedPDF] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch the list of PDFs when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pdfList = await fetchPDFs();
    setPDFs(pdfList);

    if (pdfList.length > 0) {
      setSelectedPDF(pdfList[0].file_name); // Automatically select the first PDF if available
    } else {
      setSelectedPDF(""); // Reset selected PDF if no PDFs are available
    }
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (question.trim() === "") {
      setAnswer("Please enter a question.");
      return;
    }

    if (selectedPDF === "") {
      setAnswer("Please select a PDF.");
      return;
    }

    // Call the backend API and set the answer
    const response = await queryAPI(question, selectedPDF);
    setAnswer(response);
  };

  // Handle PDF file upload
  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const message = await uploadPDF(file);
    setUploadMessage(message);

    // Refresh the list of PDFs after upload
    fetchData();

    // Reset the file input and file state
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Box textAlign="center" marginBottom={2}>
            <Typography variant="h4" gutterBottom>
              Ask a Question to the RAG Agent
            </Typography>
          </Box>

          {/* File upload Section */}
          <Box
            marginBottom={4}
            display="flex"
            flexDirection="column"
            alignItems="stretch"
          >
            <Typography variant="h6" marginBottom={1}>
              Upload a PDF
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                ref={fileInputRef} // Attach the ref to the file input
                style={{
                  flex: 1,
                  marginRight: "10px", // Add spacing between input and button
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFileUpload}
                style={{ whiteSpace: "nowrap" }} // Prevent text wrapping
              >
                Upload PDF
              </Button>
            </Box>
            {uploadMessage && (
              <Typography variant="body2" color="textSecondary" marginTop={2}>
                {uploadMessage}
              </Typography>
            )}
          </Box>

          {/* PDF Selection Section */}
          <Box marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel>Select a PDF</InputLabel>
              <Select
                value={selectedPDF}
                onChange={(e) => setSelectedPDF(e.target.value)}
              >
                {pdfs.length > 0 ? (
                  pdfs.map((pdf) => (
                    <MenuItem key={pdf.file_name} value={pdf.file_name}>
                      {pdf.file_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No PDFs uploaded
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Question Input and Submit */}
          <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
              <TextField
                fullWidth
                label="Enter your question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Box>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Ask
              </Button>
            </Box>
          </form>

          {/* Display the answer if available */}
          {answer && (
            <Box
              marginTop={3}
              padding={2}
              border="1px solid #ddd"
              borderRadius="4px"
              bgcolor="#f9f9f9"
            >
              <Typography variant="h6">Answer:</Typography>
              <Typography>{answer}</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
