# Credex AI Spend Audit

Credex AI Spend Audit is a free tool designed for startup founders and engineering managers to evaluate their current AI tool stack (like Cursor, Copilot, Claude, ChatGPT) and uncover potential monthly savings. By analyzing their team size, use case, and current plan selection against real-time pricing data, it instantly identifies costly overprovisioning or opportunities to switch to more cost-effective alternatives.

## Screenshots
*(Add 3+ screenshots or a Loom link here)*

## Quick Start

### Install
```bash
npm install
```

### Run Locally
```bash
# Add your environment variables in .env.local
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
# ANTHROPIC_API_KEY=...

npm run dev
```

### Deploy
You can easily deploy this application to Vercel:
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `ANTHROPIC_API_KEY` to the environment variables.
4. Deploy!

## Decisions & Trade-offs

1. **Next.js App Router vs SPA**: Chose Next.js to leverage Server-Side Rendering (SSR) for dynamic Open Graph tags on the shareable URLs. A pure React SPA would make link previews for Twitter/LinkedIn difficult.
2. **Supabase vs Custom DB**: Opted for Supabase for the backend. It offers a seamless out-of-the-box Postgres database with a simple client SDK, which allowed me to build the lead capture and unique shareable URL feature faster than setting up a custom Express/Prisma backend.
3. **Hardcoded Pricing Engine vs Database**: I kept the pricing data (`pricingData.ts`) and audit logic hardcoded rather than pulling from a database. Given the constraints of the 7-day build and the fact that AI pricing doesn't change *daily*, it was faster to ship and test locally.
4. **Anthropic API vs OpenAI API**: Chose the Anthropic API (Claude 3 Haiku) for the summary generation. It's incredibly fast and cost-effective, which is ideal for a high-traffic lead generation tool where the summary adds a touch of personalization but doesn't require deep reasoning.
5. **Local Storage vs Auth**: Decided not to force users to create an account, using `localStorage` instead to persist form state. This drastically reduces friction for the user, aligning with the requirement to capture email *only after* value is shown.

## Deployed URL
*(Add your deployed Vercel/Netlify URL here)*
