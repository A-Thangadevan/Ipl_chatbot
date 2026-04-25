IPL 2024 Agentic RAG
An advanced AI-powered assistant designed to reason across structured match statistics, unstructured tournament reports, and real-time web data to provide comprehensive insights into the 2024 Indian Premier League.

🚀 Overview
This application implements an Agentic RAG (Retrieval-Augmented Generation) system. Unlike standard RAG which simply retrieves text, this agent uses a Thought/Action/Observation loop to decide which tool to use—be it querying a CSV database for player stats or performing a semantic search over Wikipedia text—to answer complex, multi-part questions.

🛠️ Tech Stack
Frontend & UI
React 19: Modern UI development with functional components and hooks.

Vite: Lightning-fast build tool and development server.

Tailwind CSS: Utility-first CSS framework for a sleek "Neural Engine" aesthetic.

Framer Motion: Smooth animations for reasoning traces and chat transitions.

Lucide React: For clean, consistent iconography.

AI & Agent Logic
Google Gemini 2.0 Flash: The core "brain" used for reasoning, tool selection, and final answer synthesis.

Agentic Framework: A custom loop implementation supporting up to 8 reasoning steps per query.

Google Search Grounding: Integrated web search for real-time tournament news.

Data Processing
Fuse.js: Lightweight fuzzy search for semantic document retrieval from unstructured text.

Papa Parse: Powerful CSV parser used to process structured match-by-match statistics.

🧩 Agent Capabilities
The agent intelligently routes queries through three specialized tools:

query_data: Accesses ipl_data_2024.csv to answer quantitative questions like "Who had the most wickets in Match 14?" or "How many matches did KKR win?".

search_docs: Performs semantic search on ipl_wiki_text.txt for qualitative info like rule changes (e.g., two bouncers per over) or venue details.

web_search: Uses Gemini's search grounding to find news or context outside the provided local datasets.
