'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = <T>(table: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select('*');

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return { data, loading, error, refetch };
};
