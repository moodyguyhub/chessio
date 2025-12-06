/**
 * AI Configuration - Calm Admin
 * 
 * Two-model strategy:
 * - MODEL_REASONING (gpt-4.1): Heavy thinking, planning, strategy
 * - MODEL_CHEAP (gpt-4o-mini): Routine admin tasks, most queries
 * 
 * Routing rule: 90-95% on cheap, 5-10% on reasoning where it matters
 * 
 * Why these models?
 * 
 * gpt-4.1 (reasoning):
 * - Current flagship text model (replaces legacy gpt-4-turbo-preview)
 * - Strong instruction-following + long-context handling
 * - Best for strategy, protocol, architecture, planning
 * - Cost: ~$10/$30 per 1M tokens (expensive but effective)
 * 
 * gpt-4o-mini (cheap):
 * - Excellent cost/quality ratio ($0.15/$0.60 per 1M tokens)
 * - Strong enough for SEO copy, outlines, microcopy
 * - Handles 90-95% of requests for ~$0.0003 each
 * - Can upgrade to gpt-4.1-mini later if needed
 */

export const MODEL_REASONING = "gpt-4.1" as const;
export const MODEL_CHEAP = "gpt-4o-mini" as const;

/**
 * Cost tracking (per 1M tokens)
 */
export const COSTS = {
  [MODEL_REASONING]: {
    input: 10.0,   // $10/1M input tokens
    output: 30.0,  // $30/1M output tokens
  },
  [MODEL_CHEAP]: {
    input: 0.15,   // $0.15/1M input tokens
    output: 0.60,  // $0.60/1M output tokens
  },
} as const;

/**
 * Scopes that require deep reasoning (use MODEL_REASONING)
 */
const REASONING_SCOPES = new Set([
  "strategy",
  "protocol",
  "architecture",
  "planning",
]);

/**
 * Determine which model to use based on scope and optional override
 * 
 * @param scope - The context scope (strategy, freeform, seoPage, etc)
 * @param opts - Optional settings
 * @param opts.deep - Force use of reasoning model regardless of scope
 * @returns The appropriate model
 */
export function selectModel(
  scope: string,
  opts?: { deep?: boolean }
): typeof MODEL_REASONING | typeof MODEL_CHEAP {
  // Override: force reasoning model if requested
  if (opts?.deep) {
    return MODEL_REASONING;
  }

  // Strategy, protocol design, architecture → reasoning model
  if (REASONING_SCOPES.has(scope)) {
    return MODEL_REASONING;
  }

  // Everything else → cheap model
  // (SEO metadata, content outlines, intros, freeform asks)
  return MODEL_CHEAP;
}

/**
 * Estimate cost for a given request
 * 
 * @param model - The model being used
 * @param inputTokens - Approximate input token count
 * @param outputTokens - Approximate output token count
 * @returns Cost in USD
 */
export function estimateCost(
  model: typeof MODEL_REASONING | typeof MODEL_CHEAP,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = COSTS[model];
  const inputCost = (inputTokens / 1_000_000) * costs.input;
  const outputCost = (outputTokens / 1_000_000) * costs.output;
  return inputCost + outputCost;
}

/**
 * Environment flag to enable/disable AI features
 * Can be used to temporarily disable AI in specific environments
 */
export const AI_ENABLED = process.env.AI_ENABLED !== "false";

/**
 * Available scopes for AI requests
 */
export const SCOPES = {
  // Reasoning scopes (use expensive model)
  STRATEGY: "strategy",
  PROTOCOL: "protocol",
  ARCHITECTURE: "architecture",
  PLANNING: "planning",

  // Utility scopes (use cheap model)
  FREEFORM: "freeform",
  SEO_PAGE: "seoPage",
  ARTICLE: "article",
  KEYWORD: "keyword",
} as const;

/**
 * Scope metadata for UI
 */
export const SCOPE_INFO = {
  [SCOPES.STRATEGY]: {
    label: "Strategy",
    description: "Deep planning, tradeoff analysis, system design",
    model: MODEL_REASONING,
    icon: "🎯",
  },
  [SCOPES.PROTOCOL]: {
    label: "Protocol",
    description: "Operating procedures, workflows, documentation",
    model: MODEL_REASONING,
    icon: "📋",
  },
  [SCOPES.ARCHITECTURE]: {
    label: "Architecture",
    description: "Technical design, data models, system structure",
    model: MODEL_REASONING,
    icon: "🏗️",
  },
  [SCOPES.PLANNING]: {
    label: "Planning",
    description: "Roadmaps, timelines, resource allocation",
    model: MODEL_REASONING,
    icon: "📅",
  },
  [SCOPES.FREEFORM]: {
    label: "Freeform",
    description: "General questions, quick asks, brainstorming",
    model: MODEL_CHEAP,
    icon: "💬",
  },
  [SCOPES.SEO_PAGE]: {
    label: "SEO Page",
    description: "Metadata suggestions for specific pages",
    model: MODEL_CHEAP,
    icon: "🔍",
  },
  [SCOPES.ARTICLE]: {
    label: "Article",
    description: "Content outlines, intros, writing assistance",
    model: MODEL_CHEAP,
    icon: "📝",
  },
  [SCOPES.KEYWORD]: {
    label: "Keyword",
    description: "Keyword research, analysis, suggestions",
    model: MODEL_CHEAP,
    icon: "🔑",
  },
} as const;

/**
 * Token estimation (rough averages)
 * Used for cost estimation in UI
 */
export const AVERAGE_TOKENS = {
  input: 500,   // Average prompt + context
  output: 300,  // Average response
} as const;
