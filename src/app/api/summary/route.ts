import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AuditResult, UserToolInput, UserContext } from '../../../lib/auditEngine';

// Initialize Anthropic client (requires ANTHROPIC_API_KEY in .env)
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { result, tools, context } = await req.json() as {
      result: AuditResult;
      tools: UserToolInput[];
      context: UserContext;
    };

    const isHighSavings = result.totalMonthlySavings > 500;

    // Build the prompt context
    const prompt = `
You are an expert AI infrastructure financial auditor. 
You are speaking directly to a user who just ran an audit on our platform (Credex).
They have a team size of ${context.teamSize} and their primary use case is ${context.primaryUseCase}.

Here are their current tools:
${tools.map(t => `- ${t.toolName} (${t.planName}): ${t.seats} seats, $${t.monthlySpend}/mo`).join('\n')}

Here is the audit result (Total potential savings: $${result.totalMonthlySavings}/mo):
${result.recommendations.map(r => `- ${r.toolName}: ${r.recommendedAction} (Saves $${r.savingsMonthly}/mo)`).join('\n')}

Write a concise, personalized summary paragraph (~80-100 words) for the user. 
Do not use bullet points. Do not start with "Here is a summary". Write it directly as a professional assessment.
${isHighSavings ? 'Since their savings are large (>$500/mo), subtly mention that they are paying retail and should consider a custom infrastructure credit solution.' : 'Since their savings are mostly plan optimizations, keep it encouraging and focused on tool fit.'}
    `;

    // If API key is available, call Anthropic
    if (anthropic) {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Fast, cheap model is perfect for this
        max_tokens: 250,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      });

      // Assert type for the response content block
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        return NextResponse.json({ summary: contentBlock.text });
      }
    }

    // Fallback if no API key or failed
    throw new Error('No Anthropic API key configured or response was not text.');

  } catch (error) {
    console.error('Summary API Error:', error);
    
    // Return a graceful fallback 
    // We don't return 500 because the requirement says "Must handle API failures gracefully (fallback to a templated summary)"
    return NextResponse.json({ 
      summary: "Your AI stack has been analyzed. By realigning your current subscriptions with your actual team size and use case, you have substantial optimization opportunities. We recommend reviewing the detailed breakdown below to adjust your seat counts or switch to tools better suited for your primary workflow." 
    });
  }
}
