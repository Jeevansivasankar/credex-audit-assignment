import { Metadata } from 'next';
import { getPublicAudit } from '../../../lib/db';
import { Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Generate dynamic Open Graph tags
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const audit = await getPublicAudit(params.id);

  if (!audit) {
    return {
      title: 'Audit Not Found',
    };
  }

  const savings = audit.total_monthly_savings;
  const title = `AI Spend Audit: $${savings}/mo identified in savings`;
  const description = `This team can save $${savings}/mo on their AI stack (${audit.tools.length} tools). Check out the full breakdown and see if you're overpaying.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      // In a real app, we would point to a dynamic OG image generator route like `/api/og?savings=${savings}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const audit = await getPublicAudit(params.id);

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Audit Not Found</h1>
        <p className="text-gray-500 mb-8">This audit may have been deleted or never existed. (Or Supabase is not configured locally).</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Run Your Own Audit
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-extrabold tracking-tight">Credex</span>
          </Link>
          <Link href="/" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-100">
            Audit Your Stack
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 text-white shadow-xl text-center">
          <h1 className="text-gray-400 font-semibold uppercase tracking-widest text-sm mb-4">
            AI Spend Optimization Report
          </h1>
          <div className="flex justify-center items-center mb-2">
            <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-green-400" />
            <span className="text-6xl md:text-8xl font-extrabold">
              {audit.total_monthly_savings.toLocaleString()}
            </span>
          </div>
          <p className="text-xl text-gray-300">Potential monthly savings identified</p>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4">Stack Breakdown</h3>
          <div className="space-y-4">
            {audit.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                <div>
                  <h4 className="font-bold text-gray-900">{rec.toolName}</h4>
                  <p className="text-sm text-gray-500 mt-1">{rec.recommendedAction}</p>
                </div>
                <div className={`font-bold text-lg ${rec.savingsMonthly > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  ${rec.savingsMonthly}/mo
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Are you overpaying too?</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
            Get Your Free Audit <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
