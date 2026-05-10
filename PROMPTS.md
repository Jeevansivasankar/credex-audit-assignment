## Main Summary Prompt

Used in `src/app/api/summary/route.ts` with the Anthropic API (Claude 3 Haiku).

**Prompt:**
```
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
```

**Why I wrote it this way:**
I explicitly injected the user's team size, use case, and exact tool breakdown into the prompt so the model has ground truth data. I added strict negative constraints ("Do not use bullet points. Do not start with 'Here is a summary'") because LLMs default to verbose, listicle-style outputs, which breaks the illusion of a polished, human-like paragraph. The conditional injection (`isHighSavings`) dynamically shifts the tone to pitch Credex's core offering when appropriate.

**What I tried that didn't work:**
Initially, I just passed the JSON object of the audit result to the LLM and asked for a summary. The model hallucinated tool names that weren't in the input and frequently gave terrible financial advice (e.g., suggesting they switch from GitHub Copilot to ChatGPT Free for coding). I had to pivot to hardcoding the financial logic in TypeScript, and only using the LLM for *summarizing* the pre-calculated results in natural language.
