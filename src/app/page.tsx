"use client";

import React, { useState } from 'react';
import AuditForm from '../components/AuditForm';
import AuditResults from '../components/AuditResults';
import { runAudit, AuditResult, UserToolInput, UserContext } from '../lib/auditEngine';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [auditResult, setAuditResult] = useState<{
    result: AuditResult;
    tools: UserToolInput[];
    context: UserContext;
  } | null>(null);

  const handleAuditComplete = (tools: UserToolInput[], context: UserContext) => {
    const result = runAudit(tools, context);
    setAuditResult({ result, tools, context });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-extrabold tracking-tight">Credex</span>
          </div>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            For Startups
          </a>
        </div>
      </nav>

      {!auditResult && (
        <section className="pt-20 pb-16 px-6 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
            Free AI Spend Audit
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop overpaying for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI tools.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Most startups overspend on AI infrastructure without knowing it. Get an instant, personalized audit of your stack and see how much you could save.
          </p>
        </section>
      )}

      <section className="px-6 pb-24">
        {auditResult ? (
          <div className="max-w-6xl mx-auto">
            <button 
              onClick={() => setAuditResult(null)}
              className="mb-8 text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              ← Back to Edit
            </button>
            <AuditResults 
              result={auditResult.result} 
              tools={auditResult.tools} 
              context={auditResult.context} 
            />
          </div>
        ) : (
          <AuditForm onComplete={handleAuditComplete} />
        )}
      </section>

      <footer className="bg-gray-50 py-12 text-center text-gray-500 text-sm">
        <p>© 2026 Credex. All rights reserved.</p>
      </footer>
    </main>
  );
}
