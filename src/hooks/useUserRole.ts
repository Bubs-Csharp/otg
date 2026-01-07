import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'practitioner' | 'user';

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [practitionerId, setPractitionerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRoles();
    } else {
      setRoles([]);
      setPractitionerId(null);
      setLoading(false);
    }
  }, [user]);

  const fetchRoles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      } else {
        setRoles((rolesData || []).map(r => r.role as AppRole));
      }

      // Check if user is linked to a practitioner
      const { data: practitionerData } = await supabase
        .from('practitioners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (practitionerData) {
        setPractitionerId(practitionerData.id);
      }
    } catch (error) {
      console.error('Error in fetchRoles:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = roles.includes('admin');
  const isPractitioner = roles.includes('practitioner') || practitionerId !== null;
  const isUser = roles.includes('user');

  return {
    roles,
    isAdmin,
    isPractitioner,
    isUser,
    practitionerId,
    loading,
    refetch: fetchRoles,
  };
}
