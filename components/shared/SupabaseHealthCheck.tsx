// ==============================================================================
// 3LINE GADGETS — SUPABASE CONNECTIVITY & HEALTH CHECK (CLIENT COMPONENT)
// components/shared/SupabaseHealthCheck.tsx
// ==============================================================================

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export function SupabaseHealthCheck() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'schema_needed' | 'unconfigured' | 'error'>('idle');
  const [details, setDetails] = useState<string | null>(null);

  const resolvedUrl = getSupabaseUrl();

  const checkConnection = async () => {
    setStatus('checking');
    setDetails(null);

    if (!isSupabaseConfigured()) {
      setStatus('unconfigured');
      setDetails('Supabase credentials are not fully configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    try {
      const supabase = createClient();
      // Test 1: ping auth service
      await supabase.auth.getSession();

      // Test 2: Safe read test against public categories table
      const { data, error } = await supabase.from('categories').select('id, name, slug').limit(3);

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          setStatus('schema_needed');
          setDetails(`Connected to your Supabase project successfully! Next step: Execute the migration file 'supabase/migrations/001_initial_schema.sql' in your Supabase SQL Editor to create the 21 tables.`);
        } else {
          setStatus('error');
          setDetails(`Supabase response: ${error.message} (Code: ${error.code})`);
        }
      } else {
        setStatus('connected');
        setDetails(`Connected to Supabase PostgreSQL! Database schema is active (${data?.length || 0} category records found).`);
      }
    } catch (err: unknown) {
      setStatus('error');
      setDetails(err instanceof Error ? err.message : 'Unexpected connection error');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Supabase Client Diagnostic</span>
        </div>

        {status === 'idle' && (
          <Badge variant="secondary">Ready to test</Badge>
        )}
        {status === 'checking' && (
          <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 animate-pulse">
            Connecting...
          </Badge>
        )}
        {status === 'connected' && (
          <Badge variant="success">Fully Connected</Badge>
        )}
        {status === 'schema_needed' && (
          <Badge variant="warning">Connected &bull; Schema Pending</Badge>
        )}
        {status === 'unconfigured' && (
          <Badge variant="warning">Awaiting Credentials</Badge>
        )}
        {status === 'error' && (
          <Badge variant="destructive">Connection Error</Badge>
        )}
      </div>

      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Project Endpoint:</span>
          <code className="text-cyan-300 font-mono text-[11px] truncate max-w-[200px]">
            {resolvedUrl || 'Resolving...'}
          </code>
        </div>
      </div>

      {details && (
        <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
          status === 'connected'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
            : status === 'schema_needed'
            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
            : status === 'unconfigured'
            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
        }`}>
          {details}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={checkConnection}
        disabled={status === 'checking'}
        className="w-full text-xs"
      >
        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${status === 'checking' ? 'animate-spin' : ''}`} />
        {status === 'checking' ? 'Testing Connection...' : 'Run Connection Test'}
      </Button>
    </div>
  );
}
