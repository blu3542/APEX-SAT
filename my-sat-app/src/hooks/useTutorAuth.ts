import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase';

export function useTutorAuth() {
  const [isTutor, setIsTutor] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkTutorStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsTutor(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('position')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsTutor(data?.position === 'tutor');
      } catch (err: any) {
        setError(err.message);
        setIsTutor(false);
      } finally {
        setLoading(false);
      }
    }

    checkTutorStatus();
  }, []);

  return { isTutor, loading, error };
}