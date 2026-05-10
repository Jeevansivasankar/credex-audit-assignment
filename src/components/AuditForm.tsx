"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { UserToolInput, UserContext, UseCase } from '../lib/auditEngine';
import { ToolName, pricingData } from '../lib/pricingData';

interface AuditFormProps {
  onComplete: (tools: UserToolInput[], context: UserContext) => void;
}

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding & Engineering' },
  { value: 'writing', label: 'Copywriting & Content' },
  { value: 'data', label: 'Data Analysis' },
  { value: 'research', label: 'General Research' },
  { value: 'mixed', label: 'Mixed / Cross-functional' },
];

export default function AuditForm({ onComplete }: AuditFormProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCase>('mixed');
  const [tools, setTools] = useState<UserToolInput[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('credex-audit-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase);
        if (parsed.tools) setTools(parsed.tools);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    } else {
      // Default empty tool
      setTools([{
        id: Math.random().toString(36).substring(7),
        toolName: 'ChatGPT',
        planName: 'Plus',
        monthlySpend: 20,
        seats: 1
      }]);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('credex-audit-state', JSON.stringify({
        teamSize,
        primaryUseCase,
        tools
      }));
    }
  }, [teamSize, primaryUseCase, tools, isLoaded]);

  const addTool = () => {
    setTools([...tools, {
      id: Math.random().toString(36).substring(7),
      toolName: 'Cursor',
      planName: 'Pro',
      monthlySpend: 20,
      seats: 1
    }]);
  };

  const updateTool = (id: string, field: keyof UserToolInput, value: any) => {
    setTools(tools.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        // Auto-update plan name if tool changes
        if (field === 'toolName') {
          updated.planName = pricingData[value as ToolName].plans[0].name;
          updated.monthlySpend = pricingData[value as ToolName].plans[0].pricePerUser * updated.seats;
        }
        return updated;
      }
      return t;
    }));
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tools.length === 0) return alert("Please add at least one tool to audit.");
    onComplete(tools, { teamSize, primaryUseCase });
  };

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading your workspace...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Context Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team Size</label>
            <input 
              type="number" 
              min="1" 
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Use Case</label>
            <select 
              value={primaryUseCase}
              onChange={(e) => setPrimaryUseCase(e.target.value as UseCase)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {USE_CASES.map(uc => (
                <option key={uc.value} value={uc.value}>{uc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your AI Tools</h3>
            <button 
              type="button" 
              onClick={addTool}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Tool
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool, index) => {
              const availablePlans = pricingData[tool.toolName].plans;
              
              return (
                <div key={tool.id} className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm group">
                  <button 
                    type="button"
                    onClick={() => removeTool(tool.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tool</label>
                      <select 
                        value={tool.toolName}
                        onChange={(e) => updateTool(tool.id, 'toolName', e.target.value)}
                        className="w-full text-sm py-2 border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                      >
                        {Object.keys(pricingData).map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Plan</label>
                      <select 
                        value={tool.planName}
                        onChange={(e) => updateTool(tool.id, 'planName', e.target.value)}
                        className="w-full text-sm py-2 border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                      >
                        {availablePlans.map(plan => (
                          <option key={plan.name} value={plan.name}>{plan.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Seats</label>
                      <input 
                        type="number" 
                        min="1"
                        value={tool.seats}
                        onChange={(e) => updateTool(tool.id, 'seats', parseInt(e.target.value) || 1)}
                        className="w-full text-sm py-2 border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Monthly Spend ($)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(tool.id, 'monthlySpend', parseFloat(e.target.value) || 0)}
                        className="w-full text-sm py-2 border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {tools.length === 0 && (
              <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
                No tools added yet. Click "Add Tool" to start your audit.
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
          >
            Run Free Audit <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
