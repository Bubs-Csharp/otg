import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, Trash2, Loader2, Search } from 'lucide-react';

interface AdminUser {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

export const AdminManagement = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<{ id: string; email: string; first_name: string | null; last_name: string | null } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // Get all users with admin role
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, created_at')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (adminRoles && adminRoles.length > 0) {
        // Get profile info for each admin
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, email, first_name, last_name')
          .in('user_id', adminRoles.map(r => r.user_id));

        if (profilesError) throw profilesError;

        const adminList = adminRoles.map(role => {
          const profile = profiles?.find(p => p.user_id === role.user_id);
          return {
            user_id: role.user_id,
            email: profile?.email || 'Unknown',
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            created_at: role.created_at,
          };
        });

        setAdmins(adminList);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({ title: 'Error loading admins', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    setFoundUser(null);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name')
        .eq('email', searchEmail.trim().toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        // Check if already an admin
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', profile.user_id)
          .eq('role', 'admin')
          .maybeSingle();

        if (existingRole) {
          toast({ title: 'This user is already an admin', variant: 'destructive' });
          setFoundUser(null);
        } else {
          setFoundUser({
            id: profile.user_id,
            email: profile.email || searchEmail,
            first_name: profile.first_name,
            last_name: profile.last_name,
          });
        }
      } else {
        toast({ title: 'No user found with that email', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error searching user:', error);
      toast({ title: 'Error searching for user', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const addAdmin = async () => {
    if (!foundUser) return;

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: foundUser.id, role: 'admin' });

      if (error) throw error;

      toast({ title: 'Admin added successfully' });
      setIsAddDialogOpen(false);
      setSearchEmail('');
      setFoundUser(null);
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({ title: 'Error adding admin', variant: 'destructive' });
    } finally {
      setIsAdding(false);
    }
  };

  const removeAdmin = async (userId: string) => {
    if (admins.length <= 1) {
      toast({ title: 'Cannot remove the last admin', variant: 'destructive' });
      return;
    }

    if (!confirm('Are you sure you want to remove this admin? They will lose all admin privileges.')) {
      return;
    }

    setIsRemoving(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({ title: 'Admin removed successfully' });
      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({ title: 'Error removing admin', variant: 'destructive' });
    } finally {
      setIsRemoving(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Management
            </CardTitle>
            <CardDescription>Manage users with administrative privileges</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setSearchEmail('');
              setFoundUser(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Search for an existing user by email to grant admin privileges
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="user@example.com"
                      type="email"
                      onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                    />
                    <Button onClick={searchUser} disabled={isSearching}>
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {foundUser && (
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div>
                      <p className="font-medium">
                        {foundUser.first_name} {foundUser.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                    </div>
                    <Button onClick={addAdmin} disabled={isAdding} className="w-full">
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Grant Admin Access
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {admins.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No admins found</p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.user_id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {admin.first_name || admin.last_name
                        ? `${admin.first_name || ''} ${admin.last_name || ''}`.trim()
                        : 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Admin</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAdmin(admin.user_id)}
                    disabled={isRemoving === admin.user_id || admins.length <= 1}
                    className="text-destructive hover:text-destructive"
                  >
                    {isRemoving === admin.user_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
