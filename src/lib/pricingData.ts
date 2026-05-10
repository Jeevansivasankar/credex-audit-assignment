export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API direct' 
  | 'OpenAI API direct' 
  | 'Gemini' 
  | 'Windsurf';

export type PlanName = string;

export interface PlanPricing {
  name: PlanName;
  pricePerUser: number;
  minSeats?: number;
  isVariable?: boolean; // For APIs
}

export interface ToolPricing {
  name: ToolName;
  plans: PlanPricing[];
}

export const pricingData: Record<ToolName, ToolPricing> = {
  'Cursor': {
    name: 'Cursor',
    plans: [
      { name: 'Hobby', pricePerUser: 0 },
      { name: 'Pro', pricePerUser: 20 },
      { name: 'Business', pricePerUser: 40 },
    ],
  },
  'GitHub Copilot': {
    name: 'GitHub Copilot',
    plans: [
      { name: 'Individual', pricePerUser: 10 },
      { name: 'Business', pricePerUser: 19 },
      { name: 'Enterprise', pricePerUser: 39 },
    ],
  },
  'Claude': {
    name: 'Claude',
    plans: [
      { name: 'Free', pricePerUser: 0 },
      { name: 'Pro', pricePerUser: 20 },
      { name: 'Team', pricePerUser: 30, minSeats: 5 },
      { name: 'API direct', pricePerUser: 0, isVariable: true },
    ],
  },
  'ChatGPT': {
    name: 'ChatGPT',
    plans: [
      { name: 'Plus', pricePerUser: 20 },
      { name: 'Team', pricePerUser: 30, minSeats: 2 },
      { name: 'API direct', pricePerUser: 0, isVariable: true },
    ],
  },
  'Anthropic API direct': {
    name: 'Anthropic API direct',
    plans: [
      { name: 'API direct', pricePerUser: 0, isVariable: true },
    ],
  },
  'OpenAI API direct': {
    name: 'OpenAI API direct',
    plans: [
      { name: 'API direct', pricePerUser: 0, isVariable: true },
    ],
  },
  'Gemini': {
    name: 'Gemini',
    plans: [
      { name: 'Free', pricePerUser: 0 },
      { name: 'Advanced', pricePerUser: 20 },
      { name: 'API', pricePerUser: 0, isVariable: true },
    ],
  },
  'Windsurf': {
    name: 'Windsurf',
    plans: [
      { name: 'Free', pricePerUser: 0 },
      { name: 'Pro', pricePerUser: 15 },
    ],
  },
};
