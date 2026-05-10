## 1. Hardest Bug
The hardest bug I hit was managing the complex state of the `tools` array inside the React `AuditForm` component while simultaneously ensuring it persisted to `localStorage` without causing hydration errors on the first render in Next.js. My initial hypothesis was that standard `useEffect` hooks would suffice, but I kept getting Next.js mismatch errors because the server rendered an empty form, and the client instantly injected the loaded state. I debugged this by isolating the `localStorage` logic and eventually implemented an `isLoaded` state flag that prevents rendering the form until the client has securely mounted and checked storage.

## 2. Reversed Decision
Mid-week, I reversed my decision to use a custom Prisma/Postgres backend. I originally wanted full control over the DB schema, but configuring the migrations and deploying it added too much overhead. I switched to Supabase because its auto-generated APIs and simple `createClient` SDK allowed me to build the lead capture and unique share link feature in half the time, letting me focus on the core audit logic.

## 3. Week 2 Build
If I had a second week, I would build a "Benchmark Mode." Right now, the tool tells you if you're overpaying based on strict rules. In week 2, I would aggregate the anonymous data from all audits to say: "You spend $40/dev/mo on AI. Companies of your size average $25/dev/mo." This peer comparison is a massive psychological driver for B2B SaaS and would significantly increase the conversion rate to the Credex consultation.

## 4. AI Usage
I used Claude 3.5 Sonnet to help scaffold the Tailwind CSS UI components quickly, specifically asking it to generate the complex grid layout for the tool inputs. I didn't trust it with the actual math in the `auditEngine.ts`, which I wrote manually to ensure defensibility. There was one time the AI hallucinated that Claude Pro required a minimum of 5 seats, mixing it up with the Claude Team plan. I caught this because I had manually cross-referenced `PRICING_DATA.md` with the official Anthropic pricing page.

## 5. Self-Rating
- **Discipline (9/10):** Maintained consistent daily commits and followed the exact assignment constraints.
- **Code Quality (8/10):** Used TypeScript effectively, separated business logic from UI, but could use more comprehensive E2E tests.
- **Design Sense (8/10):** Built a premium, modern, high-contrast UI that builds trust.
- **Problem-solving (9/10):** Successfully navigated the complex pricing edge-cases (like API variable vs retail fixed).
- **Entrepreneurial thinking (10/10):** Focused heavily on the GTM and lead-capture mechanism, recognizing the goal is lead generation, not just a cool calculator.
