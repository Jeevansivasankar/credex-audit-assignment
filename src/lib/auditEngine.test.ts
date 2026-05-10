import { describe, it, expect } from 'vitest';
import { runAudit, UserToolInput } from './auditEngine';

describe('Audit Engine', () => {
  it('1. Identifies API retail spend and recommends Credex credits', () => {
    const tools: UserToolInput[] = [
      { id: '1', toolName: 'OpenAI API direct', planName: 'API direct', monthlySpend: 1000, seats: 1 }
    ];
    const result = runAudit(tools, { teamSize: 5, primaryUseCase: 'mixed' });
    
    expect(result.totalMonthlySavings).toBe(200); // 20% of 1000
    expect(result.recommendations[0].recommendedAction).toContain('credits');
  });

  it('2. Identifies overprovisioned Team plans and recommends individual plans', () => {
    const tools: UserToolInput[] = [
      // User has 2 seats on Claude Team (minimum 5 seats to buy = $150). They should switch to 2x Pro ($40). Savings = $110.
      { id: '1', toolName: 'Claude', planName: 'Team', monthlySpend: 150, seats: 2 }
    ];
    const result = runAudit(tools, { teamSize: 2, primaryUseCase: 'writing' });
    
    expect(result.totalMonthlySavings).toBe(110);
    expect(result.recommendations[0].recommendedAction).toContain('Pro');
  });

  it('3. Recommends IDEs for coding use cases over general conversational tools', () => {
    const tools: UserToolInput[] = [
      { id: '1', toolName: 'GitHub Copilot', planName: 'Enterprise', monthlySpend: 39, seats: 1 }
    ];
    const result = runAudit(tools, { teamSize: 15, primaryUseCase: 'coding' });
    
    // Enterprise Copilot is $39. Cursor Pro is $20. Savings = 19.
    expect(result.totalMonthlySavings).toBe(19);
    expect(result.recommendations[0].recommendedAction).toContain('Cursor');
  });

  it('4. Suggests downgrading Enterprise plans for small teams', () => {
    const tools: UserToolInput[] = [
      { id: '1', toolName: 'Cursor', planName: 'Business', monthlySpend: 40, seats: 1 }
    ];
    const result = runAudit(tools, { teamSize: 1, primaryUseCase: 'coding' });
    
    // Cursor Business is $40. Cursor Pro is $20. Small team doesn't need Business tier.
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedAction).toContain('Pro');
  });

  it('5. Returns 0 savings if the user is already on the optimal plan', () => {
    const tools: UserToolInput[] = [
      { id: '1', toolName: 'Cursor', planName: 'Pro', monthlySpend: 20, seats: 1 }
    ];
    const result = runAudit(tools, { teamSize: 1, primaryUseCase: 'coding' });
    
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations[0].savingsMonthly).toBe(0);
    expect(result.recommendations[0].recommendedAction).toBe('Keep current setup');
  });
});
