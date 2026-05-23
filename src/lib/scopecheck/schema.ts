import { z } from "zod";

// This is the exact shape we will force OpenAI to return
export const ScopeGapSchema = z.object({
  risk_score: z.number().min(1).max(10).describe("10 means high financial risk due to missing items."),
  confidence_level: z.enum(["low", "medium", "high"]).describe("How confident the AI is in this assessment."),
  missing_items: z.array(z.object({
    category: z.string().describe("e.g., Demolition, MEP, Finish Work, Permits"),
    item_name: z.string().describe("The specific task or material missing"),
    trigger_item: z.string().describe("The item IN the estimate that triggered this missing dependency (e.g., 'You listed tub installation, but missed floor reinforcement')"),
    estimated_cost_impact: z.string().describe("A realistic dollar range, e.g., '$400 - $800'"),
    severity: z.enum(["critical", "moderate", "minor"])
  })),
  suggested_exclusions: z.array(z.string()).describe("Legal or physical exclusions the contractor should explicitly list to protect themselves.")
});

export type ScopeGapAnalysis = z.infer<typeof ScopeGapSchema>;
