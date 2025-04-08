import axios from "axios";

// Function to make a POST request to the FastAPI backend
export const queryAPI = async (question: string): Promise<string> => {
  try {
    const response = await axios.post("http://localhost:8000/query", {
      question: question,
    });

    // Return the answer from the backend
    return response.data.answer;
  } catch (error) {
    console.error("Error querying the API:", error);
    return "An error occurred while querying the API.";
  }
};
