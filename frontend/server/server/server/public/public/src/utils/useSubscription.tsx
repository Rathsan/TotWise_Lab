import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useSubscription(userId?: string, email?: string | null) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!email) {
        setData(null);
        return;
      }
      setLoading(true);
      const { data: userRow } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (!userRow?.id) {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
        return;
      }

      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userRow.id)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (mounted) {
        setData(subRow || null);
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [userId, email]);

  return { data, loading };
}
