## North Star Metric
**Identified Savings Shared ($/mo)**
*Why:* A B2B lead-gen tool relies entirely on the value it provides. If we identify $0 in savings, no one shares the link and no one books a consultation. Measuring the total dollar amount of savings that users successfully generate a shareable link for tracks both the core value prop (finding savings) and the growth loop (sharing the audit).

## 3 Input Metrics
1. **Audit Completion Rate:** (Audits Completed / Unique Visitors). Measures the friction of the form and clarity of the landing page.
2. **Lead Capture Rate:** (Emails Entered / Audits Completed). Measures if the perceived value of the audit results is high enough to trade an email for it.
3. **High-Savings Density:** (% of completed audits finding >$500/mo in savings). Measures if our GTM targeting is hitting the right companies (larger startups vs solo devs).

## What to Instrument First
I would instrument PostHog immediately to track the funnel:
`Pageview -> Tool Added -> Form Submitted -> Email Captured -> Share Link Clicked`.
I would specifically pass the `savingsMonthly` integer as an event property on the "Form Submitted" event to track the dollar value.

## Pivot Decision Trigger
If the **High-Savings Density** drops below 5% after 1,000 visitors.
This would mean the tool is only attracting indie hackers and students who spend $20/mo, rather than the VPs of Engineering at Series A companies. We would need to pivot the GTM strategy away from Hacker News/Twitter and towards targeted outbound or paid LinkedIn ads targeting CTOs.
