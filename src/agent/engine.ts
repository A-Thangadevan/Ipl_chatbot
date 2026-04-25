import Groq from "groq-sdk";
import { tools } from "./tools";
import { AgentResponse, AgentStep } from "./types";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "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",
  dangerouslyAllowBrowser: true 
});
const MAX_STEPS = 12;

export async function runAgent(question: string): Promise<AgentResponse> {
  const trace: AgentStep[] = [];
  
  const systemInstruction = `You are an expert IPL 2024 assistant. You have access to these tools:
1. search_docs(query: string): Search tournament rules, group info, and Wikipedia reports.
2. query_data(query: string): Query specific match stats and player performances from a CSV dataset.

Format:
Thought: I need to do X.
Action: search_docs
Action Input: query here
(You will get an Observation)

When you have the answer:
Thought: I have the info.
Final Answer: The winner was X.

MAX 12 steps.`;

  for (let i = 0; i < MAX_STEPS; i++) {
    const formattedTrace = trace.map(s => 
      `Thought: ${s.thought}\nAction: ${s.action}\nAction Input: ${s.actionInput}\nObservation: ${s.observation}`
    ).join("\n\n");

    const prompt = `Current Trace:\n${formattedTrace || "None yet."}\n\nUser Question: ${question}\n\nThink step-by-step. If you have the answer, output "Final Answer: <your response>". Otherwise, pick an action.`;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const text = chatCompletion.choices[0]?.message?.content || "";
    
    // 1. Check for Final Answer
    const finalAnswerMatch = text.match(/Final Answer:\s*([\s\S]*)/i);
    if (finalAnswerMatch || text.toLowerCase().includes("action: final_answer")) {
      const answer = finalAnswerMatch ? finalAnswerMatch[1].trim() : text.replace(/Thought:.*|Action:.*|Action Input:.*/gis, "").trim();
      return {
        answer: answer || text,
        citations: Array.from(new Set(trace.map(t => t.observation || ""))).filter(c => c && c.length < 500),
        trace,
        stepsUsed: i + 1
      };
    }

    // 2. Parse Actions
    const thought = text.match(/Thought:\s*(.*)/i)?.[1]?.trim() || "Analyzing...";
    const actionMatch = text.match(/Action:\s*(\w+)/i);
    const action = actionMatch ? actionMatch[1].trim() : null;
    const actionInputMatch = text.match(/Action Input:\s*(.*)/i);
    const actionInput = actionInputMatch ? actionInputMatch[1].trim() : "";

    if (!action) {
      // If no action but long enough text, assume it's the answer
      if (text.length > 50) {
         return {
          answer: text.replace(/Thought:\s*/i, "").trim(),
          citations: [],
          trace,
          stepsUsed: i + 1
        };
      }
      return {
        answer: "The agent stopped responding in a recognized format.",
        trace,
        stepsUsed: i + 1,
        citations: []
      };
    }

    let observation = "Unavailable";
    const tool = (tools as any)[action];
    if (tool) {
      try {
        observation = await tool.execute(actionInput);
      } catch (e) {
        observation = `Error calling tool: ${e instanceof Error ? e.message : String(e)}`;
      }
    } else {
      observation = `Tool "${action}" not found. Available: search_docs, query_data, web_search.`;
    }

    trace.push({ thought, action, actionInput, observation });
  }

  return {
    answer: "Step limit reached.",
    citations: [],
    trace,
    stepsUsed: MAX_STEPS
  };
}
