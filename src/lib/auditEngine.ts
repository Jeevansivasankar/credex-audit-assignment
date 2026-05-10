import { ToolName, pricingData } from './pricingData';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface UserToolInput {
  id: string;
  toolName: ToolName;
  planName: string;
  monthlySpend: number;
  seats: number;
}

export interface UserContext {
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface AuditRecommendation {
  toolName: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savingsMonthly: number;
  reason: string;
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function runAudit(
  tools: UserToolInput[],
  context: UserContext
): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySavings = 0;

  for (const tool of tools) {
    let savings = 0;
    let action = 'Keep current setup';
    let reason = 'You are using an optimal plan for your needs.';

    const currentPricing = pricingData[tool.toolName];
    const isApi = currentPricing.plans.some(p => p.isVariable) && tool.planName.toLowerCase().includes('api');
    
    // 1. Check for API / High Retail Spend (Credex Credit Opportunity)
    if (isApi || tool.monthlySpend > 500) {
      // Conservative estimate: Credex can save ~20% on retail API / high volume spend
      savings = tool.monthlySpend * 0.2;
      action = `Switch to infrastructure credits via Credex`;
      reason = `At $${tool.monthlySpend}/mo, you are paying retail rates. Credex can source discounted credits for an estimated 20% savings.`;
    } 
    // 2. Check for "Team" plans with too few seats
    else if (tool.planName.toLowerCase() === 'team') {
      const teamPlan = currentPricing.plans.find(p => p.name.toLowerCase() === 'team');
      if (teamPlan && teamPlan.minSeats && tool.seats < teamPlan.minSeats) {
        // e.g., Claude Team requires 5 seats ($150). If user has 2 seats, they pay $150.
        // Pro is $20. 2 * 20 = $40. Savings = 150 - 40 = $110.
        const proPlan = currentPricing.plans.find(p => p.name.toLowerCase() === 'pro' || p.name.toLowerCase() === 'plus');
        if (proPlan) {
          const optimalCost = tool.seats * proPlan.pricePerUser;
          if (optimalCost < tool.monthlySpend) {
            savings = tool.monthlySpend - optimalCost;
            action = `Downgrade to ${proPlan.name} plan`;
            reason = `You have ${tool.seats} seats but are paying for a Team plan that requires a minimum of ${teamPlan.minSeats} seats. Individual plans are cheaper.`;
          }
        }
      }
    }
    // 3. Overkill features for small teams
    else if ((tool.planName === 'Business' || tool.planName === 'Enterprise') && context.teamSize < 10) {
      const proPlan = currentPricing.plans.find(p => p.name.toLowerCase() === 'pro' || p.name.toLowerCase() === 'individual');
      if (proPlan) {
        const optimalCost = tool.seats * proPlan.pricePerUser;
        if (optimalCost < tool.monthlySpend) {
          savings = tool.monthlySpend - optimalCost;
          action = `Downgrade to ${proPlan.name}`;
          reason = `Small teams under 10 people rarely need the strict SLA and compliance features of Business/Enterprise tiers.`;
        }
      }
    }
    // 4. Check for overpriced individual tools based on use case
    else if (context.primaryUseCase === 'coding') {
      if (tool.toolName === 'GitHub Copilot' && tool.planName === 'Enterprise') {
        const optimalCost = tool.seats * 20; // Cursor Pro
        if (optimalCost < tool.monthlySpend) {
          savings = tool.monthlySpend - optimalCost;
          action = `Switch to Cursor Pro or Windsurf`;
          reason = `For pure coding use cases, AI-native editors like Cursor ($20/mo) often outperform traditional plugins like Copilot Enterprise ($39/mo) at a lower cost.`;
        }
      } else if (tool.toolName === 'ChatGPT' && tool.planName === 'Plus') {
        const optimalCost = tool.seats * 15; // Windsurf
        if (optimalCost < tool.monthlySpend) {
          savings = tool.monthlySpend - optimalCost;
          action = `Switch to Windsurf Pro`;
          reason = `For coding-primary teams, Windsurf ($15/mo) offers better IDE integration than a general conversational UI like ChatGPT Plus ($20/mo).`;
        }
      }
    }

    if (savings > 0) {
      recommendations.push({
        toolName: tool.toolName,
        currentSpend: tool.monthlySpend,
        recommendedAction: action,
        savingsMonthly: Math.round(savings),
        reason,
      });
      totalMonthlySavings += savings;
    } else {
      recommendations.push({
        toolName: tool.toolName,
        currentSpend: tool.monthlySpend,
        recommendedAction: 'Keep current setup',
        savingsMonthly: 0,
        reason: 'You are spending optimally based on your plan and team size.',
      });
    }
  }

  return {
    recommendations,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalMonthlySavings * 12),
  };
}
