export interface ToolResult {
  tool: string;
  input: string;
  result: string;
}

export interface AgentStep {
  thought: string;
  action?: string;
  actionInput?: string;
  observation?: string;
}

export interface AgentResponse {
  answer: string;
  citations: string[];
  trace: AgentStep[];
  stepsUsed: number;
}

export interface IPLMatch {
  id: string;
  date: string;
  team1: string;
  team2: string;
  toss_winner: string;
  decision: string;
  first_score: number;
  first_wkts: number;
  second_score: number;
  second_wkts: number;
  winner: string;
  player_of_the_match: string;
  most_runs: string;
  most_wkts: string;
}
