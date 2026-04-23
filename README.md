# Ipl_chatbot
🤖 Multi-LLM RAG Chatbot
A powerful Retrieval-Augmented Generation (RAG) application built with Streamlit and LangChain. This tool allows users to upload documents (PDF, CSV, TXT, DOCX) and engage in an intelligent conversation with their data using various LLM providers like OpenAI, Google Gemini, or HuggingFace.

🌟 Features
Multi-Provider Support: Choose between OpenAI, Google Generative AI, or HuggingFace Hub for your LLM and Embeddings.

Versatile Document Loader: Supports .pdf, .csv, .txt, and .docx files.

Advanced Retrieval: Uses ChromaDB as a vector store with integrated Contextual Compression (Cohere Rerank) and redundant document filtering for more accurate answers.

Conversation Memory: Remembers past interactions using ConversationSummaryBufferMemory to maintain context in long chats.

Flexible UI:

Chat Mode: Standard Q&A with your documents.

Document Management: View uploaded files and explore the raw content of retrieved document chunks.

Bilingual Interface: Supports both English and French.

🛠️ Installation
Clone the repository:

Bash
git clone <your-repository-url>
cd <repository-folder>
Create a virtual environment (Recommended):

Bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

Bash
pip install -r requirements.txt
🚀 Usage
Run the Streamlit app:

Bash
streamlit run rag.py
Configure the Sidebar:

Select your LLM Provider (OpenAI, Google, or HuggingFace).

Enter your API Key.

Upload your documents (e.g., ipl2024 Matches.csv) to the Data/ folder or via the UI if implemented.

Click "Process Documents" to initialize the vector database.

Chat:

Switch to the Chatbot tab and start asking questions about your data!

📂 Project Structure
rag.py: The main application logic, including LLM configuration, document splitting, and the Streamlit UI.

requirements.txt: List of necessary Python packages (LangChain, Streamlit, ChromaDB, etc.).

Data/: Directory where uploaded documents are stored for processing.

DB/: Directory where the ChromaDB vector database is persisted.

⚙️ Configuration
The app utilizes several LangChain components for optimized performance:

Text Splitting: RecursiveCharacterTextSplitter with a chunk size of 1000 and 200 overlap.

Reranking: Uses CohereRerank (if a Cohere API key is provided) to improve the relevance of retrieved documents.

Memory: ConversationSummaryBufferMemory ensures the model doesn't lose context while staying within token limits.

📝 Requirements
Major dependencies include:

langchain & langchain-community

streamlit

chromadb

langchain-openai

langchain-google-genai

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Developed with ❤️ using Streamlit and LangChain.
