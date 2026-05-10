import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to save a lead and audit
export async function saveAuditToDb(data: any) {
  if (!supabase) {
    console.warn("Supabase credentials not configured. Mocking save for local dev.");
    return { id: crypto.randomUUID() };
  }

  // Generate a shareable ID
  const shareId = crypto.randomUUID();

  const { error } = await supabase
    .from('audits')
    .insert([
      {
        id: shareId,
        email: data.email,
        company: data.company || null,
        role: data.role || null,
        tools: data.tools,
        context: data.context,
        total_monthly_savings: data.result.totalMonthlySavings,
        recommendations: data.result.recommendations,
        high_savings_mode: data.highSavingsMode,
        created_at: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Failed to save to database");
  }

  return { id: shareId };
}

// Helper to get an audit for public sharing
export async function getPublicAudit(id: string) {
  if (!supabase) {
    // Return mock data if no db is configured
    return null;
  }

  const { data, error } = await supabase
    .from('audits')
    .select('tools, context, total_monthly_savings, recommendations, created_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // Note: We explicitly DO NOT return email, company, or role to protect PII
  return data;
}
