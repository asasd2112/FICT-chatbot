Welcome to the FICT Chatbot project, an intelligent chatbot designed to provide comprehensive information about the Faculty of Information and Communication Technologies (FICT) at BUITEMS University. This chatbot is developed using a combination of advanced machine learning models and a robust backend framework, ensuring accurate and context-aware responses to user queries.

Key Features:
Course Details: Get detailed information about courses offered in various departments, including prerequisites and credit hours.
Faculty Profiles: Access comprehensive profiles of faculty members, including their academic and professional backgrounds.
University Policies: Retrieve information about important university policies, academic schedules, and other regulations.
Departmental Information: Explore details about different departments within FICT, including degree requirements and research opportunities.
Fee Structure: Find out about the fee structure for different programs offered by the faculty.
Technology Stack:
Backend: FastAPI, chosen for its high performance and ease of integration, serves as the backend framework, facilitating efficient handling of HTTP requests and responses.
Natural Language Processing (NLP): Hugging Face Transformers are used for language model embeddings (BAAI/bge-large-en-v1.5), enabling the chatbot to understand and generate relevant responses.
Document Retrieval: FAISS (Facebook AI Similarity Search) is employed for indexing and retrieving relevant document segments from a large corpus, ensuring fast and accurate responses.
PDF Text Extraction: PyPDF2 is used to extract text from academic and administrative materials stored in PDF format, allowing for easy access to structured information.
How It Works:
The chatbot uses the LangChain framework to connect different components. It starts by receiving a user query and splitting it into manageable chunks using the RecursiveCharacterTextSplitter. These chunks are then transformed into embeddings using Hugging Face Embeddings, which are indexed and searched using FAISS. The system retrieves relevant document segments and generates responses based on the context provided by the user's query.

Future Work:
Future improvements for the FICT Chatbot include enhancing the chatbot's knowledge base with more detailed information, integrating an admin login system for better management, and exploring additional features like real-time updates and personalized responses.

Feel free to explore the code, contribute, and provide feedback! This project aims to enhance the accessibility and dissemination of information within the FICT community.
