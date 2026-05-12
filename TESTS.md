## Automated Tests

I chose `vitest` for unit testing the core logic because it requires zero configuration for TypeScript and runs extremely fast.

### Test Files

**1. `src/lib/auditEngine.test.ts`**
This file covers the core audit engine logic. It ensures that the financial recommendations given to users are mathematically sound and align with the rules.

### List of Tests

1. **"Identifies API retail spend and recommends Credex credits"**
   - Covers the logic that flags API spending over $500/mo and recommends switching to Credex credits, estimating 20% savings.
2. **"Identifies overprovisioned Team plans and recommends individual plans"**
   - Covers the logic checking if a user has fewer seats than a "Team" plan requires (e.g., Claude Team for 2 users) and calculates the savings for downgrading to Pro.
3. **"Recommends IDEs for coding use cases over general conversational tools"**
   - Covers the logic that suggests Cursor or Windsurf if the team's primary use case is `coding` and they are using Copilot Enterprise or ChatGPT Plus.
4. **"Suggests downgrading Enterprise plans for small teams"**
   - Covers the rule that teams under 10 people likely don't need strict Enterprise SLA compliance, calculating savings from switching to Pro tiers.
5. **"Returns 0 savings if the user is already on the optimal plan"**
   - Covers the negative test case ensuring we don't manufacture fake savings if the user has an appropriate stack for their size and use case.

### How to Run

1. Ensure dependencies are installed: `npm install`
2. Run the test suite: `npm test`
(This runs `vitest run` under the hood).

### Edge Case Coverage

Beyond basic logic, I specifically tested for these edge cases:
- **Zero Spend/Seats:** Ensuring the engine doesn't crash or suggest savings if the user inputs $0.
- **Plan Mismatch:** Handling cases where a user selects a plan that doesn't exist in our hardcoded pricing data (graceful fallback to "Keep current setup").
- **API Retail vs Business:** Verifying that the logic correctly distinguishes between a single user on an API tier versus a company requiring 50+ seats.

### Future Testing Goals
With more time, I would implement **E2E (End-to-End) tests** using Playwright to verify that the form persistence (localStorage) works across browser restarts and that the shareable URLs resolve correctly in a headless browser environment.
