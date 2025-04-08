🧠 RAG Agent Front-End
This is the front-end interface for interacting with a Retrieval-Augmented Generation (RAG) system powered by OpenAI. It allows users to input natural language questions, which are then processed and answered based on contextually relevant data extracted from PDF documents.

🔧 Features
User-Friendly Interface: Clean and intuitive design for asking questions and viewing answers in real time.

API Integration: Connects seamlessly with the backend RAG agent via RESTful API calls built with FastAPI.

Responsive Design: Optimized for both desktop and mobile devices to ensure accessibility.

🧩 How It Works
Users input a question through the front-end.

The question is sent to the backend RAG agent via an API call.

The backend processes the query, performs context-aware retrieval from a vector database (MongoDB + HuggingFace embeddings), and sends the relevant data to OpenAI for response generation.

The answer is returned to the front-end and displayed instantly to the user.

🛠 Tech Stack
Framework: React / Next.js / [or whatever you're using—feel free to replace this]

Styling: Tailwind CSS / [or any UI framework you're using]

API Communication: Axios / Fetch API

Backend: FastAPI (Python)

AI Models: HuggingFace + OpenAI GPT

