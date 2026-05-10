"use client";

import React, { useState } from 'react';
import { AuditResult, UserToolInput, UserContext } from '../lib/auditEngine';
import { ArrowRight, Link as LinkIcon, Loader2 } from 'lucide-react';

interface LeadCaptureProps {
  result: AuditResult;
  tools: UserToolInput[];
  context: UserContext;
  ctaText: string;
  highSavingsMode: boolean;
}

export default function LeadCapture({ result, tools, context, ctaText, highSavingsMode }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-abuse honeypot
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check for bots
    if (honeypot) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          role,
          result,
          tools,
          context,
          highSavingsMode
        })
      });

      if (!response.ok) throw new Error('Failed to save audit');
      
      const data = await response.json();
      setShareableUrl(`${window.location.origin}/share/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (shareableUrl) {
    return (
      <div className="bg-green-50 text-green-900 p-6 rounded-xl border border-green-200 mt-6 animate-in fade-in">
        <h4 className="font-bold mb-2">Audit Saved Successfully!</h4>
        <p className="text-sm mb-4">
          {highSavingsMode 
            ? "We'll be in touch shortly to discuss your Credex consultation." 
            : "We'll notify you if better AI pricing becomes available for your stack."}
        </p>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            readOnly 
            value={shareableUrl} 
            className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm text-gray-700"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareableUrl);
              alert('Copied to clipboard!');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <LinkIcon className="w-4 h-4" /> Copy Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1 opacity-90">Work Email <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="founder@startup.com"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            style={highSavingsMode ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: '#374151' } : {}}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1 opacity-90">Company (Optional)</label>
          <input 
            type="text" 
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            style={highSavingsMode ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: '#374151' } : {}}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 opacity-90">Role (Optional)</label>
          <input 
            type="text" 
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="CTO / Founder"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            style={highSavingsMode ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: '#374151' } : {}}
          />
        </div>
        
        {/* Honeypot field (hidden from users) to catch basic bots */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="b_email" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${
          highSavingsMode 
            ? "bg-white text-gray-900 hover:bg-gray-100" 
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
        } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> {ctaText}</>}
      </button>
    </form>
  );
}
