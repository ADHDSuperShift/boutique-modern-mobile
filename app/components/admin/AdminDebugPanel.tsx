'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const AdminDebugPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testSupabaseConnection = async () => {
    try {
      setTestResult('Testing Supabase connection...');
      
      // Import supabase dynamically to avoid SSR issues
      const { supabase } = await import('../../lib/supabase');
      
      // Fetch exact total count without returning rows
      const { count, error } = await supabase
        .from('rooms')
        .select('id', { count: 'exact', head: true });

      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`);
      } else {
        setTestResult(`✅ Database Connected! Total rooms: ${count ?? 0}`);
      }
    } catch (err) {
      setTestResult(`❌ Connection Error: ${(err as Error).message}`);
    }
  };

  const testStaticData = () => {
    try {
      // Test static data import
      const { rooms } = require('../../data/rooms');
      setTestResult(`✅ Static data loaded! Found ${rooms.length} rooms`);
    } catch (err) {
      setTestResult(`❌ Static data error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-amber-800 mb-4">🔧 Admin Debug Panel</h3>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={testSupabaseConnection} variant="outline">
          Test Database
        </Button>
        <Button onClick={testStaticData} variant="outline">
          Test Static Data
        </Button>
      </div>

      {testResult && (
        <div className="bg-white rounded p-4 border">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-amber-700">
        <p><strong>Troubleshooting Steps:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Make sure Supabase schema is deployed</li>
          <li>Check environment variables are correct</li>
          <li>Verify RLS policies allow public access</li>
          <li>Check browser console for errors</li>
        </ol>
      </div>
    </div>
  );
};
