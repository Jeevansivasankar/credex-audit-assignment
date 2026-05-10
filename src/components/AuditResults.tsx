"use client";

import React, { useState, useEffect } from 'react';
import { AuditResult, UserToolInput, UserContext } from '../lib/auditEngine';
import { CheckCircle2, TrendingDown, DollarSign, Sparkles } from 'lucide-react';
import LeadCapture from './LeadCapture';

interface AuditResultsProps {
  result: AuditResult;
  tools: UserToolInput[];
  context: UserContext;
}

export default function AuditResults({ result, tools, context }: AuditResultsProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);

  useEffect(() => {
    // Call the API to generate the AI summary
    const generateSummary = async () => {
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result, tools, context })
        });
        
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error(error);
        // Fallback summary if API fails
        setSummary(`Based on your audit, we found $${result.totalMonthlySavings}/mo in potential savings across your AI stack. Your team of ${context.teamSize} primarily focused on ${context.primaryUseCase} can optimize spending by adjusting plans or switching to more efficient tools.`);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    generateSummary();
  }, [result, tools, context]);

  const hasHighSavings = result.totalMonthlySavings > 500;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingDown className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl text-blue-200 font-semibold mb-2">Your AI Spend Audit</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mt-6">
            <div>
              <p className="text-sm text-blue-200 uppercase tracking-widest mb-1">Monthly Savings</p>
              <div className="text-6xl md:text-7xl font-extrabold flex items-center">
                <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-green-400" />
                {result.totalMonthlySavings.toLocaleString()}
              </div>
            </div>
            
            <div className="md:mb-2">
              <p className="text-sm text-blue-200 uppercase tracking-widest mb-1">Annual Projected</p>
              <div className="text-3xl md:text-4xl font-bold text-gray-300">
                ${result.totalAnnualSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900">AI-Generated Assessment</h3>
        </div>
        
        {isLoadingSummary ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        )}
      </div>

      {/* Tool Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 px-2">Detailed Breakdown</h3>
        
        {result.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-900">{rec.toolName}</h4>
                <span className="text-gray-500 font-medium">Currently ${rec.currentSpend}/mo</span>
              </div>
              <div className="inline-block bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm mb-3">
                {rec.recommendedAction}
              </div>
              <p className="text-gray-600 text-sm">{rec.reason}</p>
            </div>
            
            <div className="md:w-32 flex flex-col items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 pl-0 md:pl-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Savings</span>
              <span className={`text-2xl font-bold ${rec.savingsMonthly > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                ${rec.savingsMonthly}/mo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional High Savings Credex CTA */}
      {hasHighSavings ? (
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-2xl shadow-xl mt-12 border border-gray-800">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-green-400" />
            Wait, you can save more.
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Because your retail AI spend is significant, you qualify to buy infrastructure credits through Credex at a discount. We source excess credits from companies that overforecasted.
          </p>
          <LeadCapture 
            result={result} 
            tools={tools} 
            context={context} 
            ctaText="Book a Credex Consultation"
            highSavingsMode={true}
          />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-12">
          {result.totalMonthlySavings < 100 ? (
            <h3 className="text-xl font-bold text-gray-900 mb-2">You're spending well.</h3>
          ) : (
            <h3 className="text-xl font-bold text-gray-900 mb-2">Save your report</h3>
          )}
          <p className="text-gray-600 mb-6">
            Enter your email to get a shareable link to this report, and we'll notify you when new pricing optimizations apply to your stack.
          </p>
          <LeadCapture 
            result={result} 
            tools={tools} 
            context={context} 
            ctaText="Save Report & Get Notified"
            highSavingsMode={false}
          />
        </div>
      )}

    </div>
  );
}
