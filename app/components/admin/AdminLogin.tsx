'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Demo login for development (bypass Supabase)
      if (email === 'admin@demo.com' && password === 'demo123') {
        onLogin();
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Try demo credentials: admin@demo.com / demo123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30 px-4">
      <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-2xl ring-1 ring-slate-200 p-8 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 text-center">
          Admin Login
        </h1>
        
        {/* Demo credentials hint */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">
            <strong>Demo Credentials:</strong><br/>
            Email: admin@demo.com<br/>
            Password: demo123
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};
