import React, { useState } from "react";
import { queryAPI } from "../components/API_request";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (question.trim() === "") {
      setAnswer("Please enter a question.");
      return;
    }

    // Call the backend API and set the answer
    const response = await queryAPI(question);
    setAnswer(response);
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Box textAlign="center" marginBottom={2}>
              <Typography variant="h4" gutterBottom>
                Ask a Question about (Designing Web APIs)
              </Typography>
            </Box>
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
        </Grid>
      </Grid>
    </Container>
  );
};