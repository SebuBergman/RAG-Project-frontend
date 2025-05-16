import React, { useEffect, useState, useRef } from "react";
import { fetchPDFs, queryAPI, uploadPDF } from "../components/API_request";
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  styled,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FileUpload, Search, HelpOutline } from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  background: theme.palette.background.paper,
}));

const FileInput = styled("input")({
  display: "none",
});

export default function Home() {
  const [question, setQuestion] = useState("");
  const [keyword, setKeyword] = useState("");
  const [answer, setAnswer] = useState("");
  const [pdfs, setPDFs] = useState<{ file_name: string; file_path: string }[]>(
    []
  );
  const [selectedPDF, setSelectedPDF] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCachedResponse, setIsCachedResponse] = useState(false);
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pdfList = await fetchPDFs();
    setPDFs(pdfList);
    setSelectedPDF(pdfList[0]?.file_name || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAnswer("");
    setIsCachedResponse(false);

    if (!question.trim()) {
      setAnswer("Please enter a question.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedPDF) {
      setAnswer("Please select a PDF.");
      setIsSubmitting(false);
      return;
    }

    const response = await queryAPI(question, keyword, selectedPDF);
    setIsSubmitting(false);
    setAnswer(response.answer);
    setIsCachedResponse(response.cached);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setUploadMessage("Uploading your document...");

    try {
      const message = await uploadPDF(file);
      setUploadMessage(message);
      fetchData();
    } finally {
      setIsLoading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Header Section */}
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Knowledge Assistant
          </Typography>
          <Typography variant="subtitle1" color="white">
            Ask questions and get answers from your documents
          </Typography>
        </Box>

        {/* Main Content */}
        <Box display="flex" gap={4}>
          {/* Left Panel - Document Management */}
          <StyledPaper sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Document Management
            </Typography>

            <Box mb={3}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Upload New Document
              </Typography>
              <Box>
                <Box mb={1}>
                  <label htmlFor="file-upload">
                    <FileInput
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      ref={fileInputRef}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<FileUpload />}
                      fullWidth
                    >
                      <Typography style={{ fontSize: 12 }}>
                        Choose PDF
                      </Typography>
                    </Button>
                  </label>
                </Box>
                <Box>
                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    onClick={handleFileUpload}
                    disabled={!file}
                    startIcon={<FileUpload />}
                    fullWidth
                  >
                    Upload
                  </LoadingButton>
                </Box>
              </Box>
              {file && (
                <Typography variant="caption" color="text.secondary" mt={1}>
                  Selected: {file.name}
                </Typography>
              )}
              {uploadMessage && (
                <Typography
                  variant="body2"
                  mt={1}
                  color={isLoading ? "primary" : "text.secondary"}
                >
                  {uploadMessage}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Available Documents
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Select Document</InputLabel>
                <Select
                  value={selectedPDF}
                  onChange={(e) => setSelectedPDF(e.target.value)}
                  label="Select Document"
                >
                  {pdfs.length > 0 ? (
                    pdfs.map((pdf) => (
                      <MenuItem key={pdf.file_name} value={pdf.file_name}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: theme.palette.primary.main,
                            }}
                          >
                            <Typography variant="caption">PDF</Typography>
                          </Avatar>
                          <Typography>{pdf.file_name}</Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No documents available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </StyledPaper>

          {/* Right Panel - Query Interface */}
          <StyledPaper sx={{ flex: 2 }}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Ask Your Question
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Your question"
                  variant="outlined"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  multiline
                  rows={3}
                  InputProps={{
                    endAdornment: <HelpOutline color="action" />,
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Optional keywords (comma separated)"
                  variant="outlined"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Search />}
                  sx={{ minWidth: 120 }}
                >
                  {isSubmitting ? "Searching..." : "Ask"}
                </LoadingButton>
              </Box>
            </form>

            {/* Answer Section */}
            {isSubmitting && <LinearProgress sx={{ my: 2 }} />}

            {answer && (
              <Box
                mt={4}
                p={3}
                border={`1px solid ${theme.palette.divider}`}
                borderRadius="12px"
                bgcolor={theme.palette.background.default}
                position="relative"
              >
                {isCachedResponse && (
                  <Chip
                    label="Cached Response"
                    color="info"
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  />
                )}
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  Answer
                </Typography>
                <Typography variant="body1" whiteSpace="pre-wrap">
                  {answer}
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Box>
      </Box>
    </Container>
  );
}
