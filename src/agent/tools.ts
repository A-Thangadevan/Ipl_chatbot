import Groq from "groq-sdk";
import Papa from "papaparse";
import Fuse from "fuse.js";
import { IPLMatch } from "./types";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "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",
  dangerouslyAllowBrowser: true 
});

export async function searchDocs(query: string): Promise<string> {
  const text = await fetch("/ipl_wiki_text.txt").then(r => r.text());
  const paragraphs = text.split("\n\n").filter(p => p.trim());
  
  const fuse = new Fuse(paragraphs, {
    includeScore: true,
    threshold: 0.4
  });

  const results = fuse.search(query).slice(0, 3);
  if (results.length === 0) return "No relevant information found in documents.";
  
  return results.map((r, i) => `[Result ${i+1}] Source: ipl_wiki_text.txt - Content: ${r.item}`).join("\n\n");
}

export async function queryData(query: string): Promise<string> {
  const csvContent = await fetch("/ipl_data_2024.csv").then(r => r.text());
  const { data } = Papa.parse<IPLMatch>(csvContent, { header: true, dynamicTyping: true });
  
  // Use model to query data
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a data analyst for IPL 2024. Use the provided dataset to answer questions accurately." },
      { role: "user", content: `Column names: id, date, team1, team2, toss_winner, decision, first_score, first_wkts, second_score, second_wkts, winner, player_of_the_match, most_runs, most_wkts

User Query: ${query}

Dataset: ${JSON.stringify(data)}

Provide a concise answer based on the query. If the query asks for the winner of the final, match id 74 matches the final (May 26, 2024).` }
    ],
    model: "llama-3.3-70b-versatile",
  });
  
  return chatCompletion.choices[0]?.message?.content || "No result found.";
}

export async function webSearch(query: string): Promise<string> {
  return "Web search is currently unavailable with the Groq engine transition.";
}

export const tools = {
  search_docs: {
    name: "search_docs",
    description: "Semantic search over unstructured IPL 2024 match reports. Use for background info, rules, and team groups.",
    execute: searchDocs
  },
  query_data: {
    name: "query_data",
    description: "Query structured IPL 2024 match stats. Use for scores, winners, players of match, etc.",
    execute: queryData
  }
};
