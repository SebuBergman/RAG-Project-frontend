import axios from "axios";

// Function to make a POST request to the FastAPI backend
export const queryAPI = async (
  question: string,
  keyword: string,
  file_name: string
): Promise<{ answer: string; cached: boolean }> => {
  try {
    const response = await axios.post("http://localhost:8000/query", {
      question,
      keyword,
      file_name,
      cached: false,
    });

    console.log("Response from API:", response.data);
    // Return the answer from the backend
    return {
      answer: response.data.answer,
      cached: response.data.cached,
    };
  } catch (error) {
    console.error("Error querying the API:", error);
    return {
      answer: "An error occurred while querying the API. Please try again.",
      cached: false,
    };
  }
};

// Function to upload a PDF to the FastAPI backend
export const uploadPDF = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:8000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error("Error uploading the PDF:", error);
    return "An error occurred while uploading the PDF. Please try again.";
  }
};

// Function to get the list of available PDFs from the backend
export const fetchPDFs = async (): Promise<
  { file_name: string; file_path: string }[]
> => {
  try {
    const response = await axios.get("http://localhost:8000/pdfs");
    // Ensure the response is correctly formatted
    if (Array.isArray(response.data.pdfs)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.pdfs.map((pdf: any) => ({
        file_name: pdf.file_name,
        file_path: pdf.file_path,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return [];
  }
};
