import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  group_size: number;
  special_notes: string | null;
  total_amount: number;
  service: { name: string; duration_minutes: number } | null;
  location: { name: string; city: string } | null;
  profile: { first_name: string | null; last_name: string | null; phone: string | null; email: string | null } | null;
}

const PractitionerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPractitioner, practitionerId, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isPractitioner) {
      navigate('/dashboard');
    }
  }, [isPractitioner, roleLoading, navigate]);

  useEffect(() => {
    if (practitionerId) {
      fetchBookings();
    }
  }, [practitionerId]);

  const fetchBookings = async () => {
    if (!practitionerId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name, duration_minutes),
          location:locations(name, city)
        `)
        .eq('practitioner_id', practitionerId)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;

      // Fetch client profiles for each booking
      const bookingsWithProfiles = await Promise.all(
        (data || []).map(async (booking) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name, phone, email')
            .eq('user_id', booking.user_id)
            .single();
          
          return { ...booking, profile: profileData };
        })
      );

      setBookings(bookingsWithProfiles);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Booking marked as ${newStatus}`,
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'default',
      cancelled: 'destructive',
      'no-show': 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') return <Badge className="bg-green-500">Paid</Badge>;
    if (status === 'pending') return <Badge variant="secondary">Pending</Badge>;
    return <Badge variant="destructive">{status}</Badge>;
  };

  const formatDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const todayBookings = bookings.filter(b => isToday(parseISO(b.booking_date)));
  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.booking_date + 'T' + b.booking_time)));
  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (authLoading || roleLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Practitioner Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and schedule</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{todayBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      R{bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.total_amount, 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>Manage your client appointments</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No appointments found</h3>
                  <p className="text-muted-foreground">You don't have any appointments matching this filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{formatDateLabel(booking.booking_date)}</Badge>
                              <span className="text-sm font-medium">{booking.booking_time}</span>
                              {getStatusBadge(booking.status)}
                              {getPaymentBadge(booking.payment_status)}
                            </div>
                            <h4 className="font-semibold text-foreground">{booking.service?.name}</h4>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {booking.profile?.first_name} {booking.profile?.last_name}
                              </span>
                              {booking.profile?.phone && (
                                <span>{booking.profile.phone}</span>
                              )}
                              {booking.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.location.name}
                                </span>
                              )}
                              {booking.group_size > 1 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {booking.group_size} people
                                </span>
                              )}
                            </div>
                            {booking.special_notes && (
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                <strong>Notes:</strong> {booking.special_notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {booking.status === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, 'no-show')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  No Show
                                </Button>
                              </>
                            )}
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PractitionerDashboard;
