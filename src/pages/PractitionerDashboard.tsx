import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Users,
  TrendingUp,
  UserCheck,
  Bell
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast, startOfWeek, addDays } from 'date-fns';
import { 
  QuickStatsCard, 
  NextAppointmentCard, 
  ScheduleCalendar, 
  PatientList,
  PatientDetailsSheet,
  BookingDetailsSheet 
} from '@/components/practitioner';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  group_size: number;
  special_notes: string | null;
  total_amount: number;
  user_id: string;
  service: { name: string; duration_minutes: number } | null;
  location: { name: string; city: string } | null;
  profile: { first_name: string | null; last_name: string | null; phone: string | null; email: string | null } | null;
}

interface Patient {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  total_bookings: number;
  last_visit: string | null;
  bookings?: Array<{
    id: string;
    booking_date: string;
    booking_time: string;
    status: string;
    service: { name: string } | null;
  }>;
}

const PractitionerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPractitioner, practitionerId, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('schedule');

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
      
      // Set up real-time subscription
      const channel = supabase
        .channel('practitioner-bookings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `practitioner_id=eq.${practitionerId}`,
          },
          () => {
            fetchBookings();
            toast({
              title: 'Booking Updated',
              description: 'Your schedule has been updated.',
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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
        description: `Appointment marked as ${newStatus}`,
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment status',
        variant: 'destructive',
      });
    }
  };

  // Computed data
  const todayBookings = useMemo(() => 
    bookings.filter(b => isToday(parseISO(b.booking_date)))
      .sort((a, b) => a.booking_time.localeCompare(b.booking_time)),
    [bookings]
  );

  const upcomingBookings = useMemo(() => 
    bookings.filter(b => {
      const bookingDateTime = parseISO(`${b.booking_date}T${b.booking_time}`);
      return !isPast(bookingDateTime) && b.status !== 'cancelled' && b.status !== 'no-show';
    }),
    [bookings]
  );

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return upcomingBookings.find(b => {
      const bookingDateTime = parseISO(`${b.booking_date}T${b.booking_time}`);
      return bookingDateTime >= now && (b.status === 'confirmed' || b.status === 'pending');
    }) || null;
  }, [upcomingBookings]);

  const pendingCount = useMemo(() => 
    bookings.filter(b => b.status === 'pending').length,
    [bookings]
  );

  const completedThisWeek = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    return bookings.filter(b => {
      const date = parseISO(b.booking_date);
      return b.status === 'completed' && date >= weekStart;
    }).length;
  }, [bookings]);

  const revenueThisMonth = useMemo(() => 
    bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.total_amount, 0),
    [bookings]
  );

  // Unique patients from bookings
  const patients = useMemo(() => {
    const patientMap = new Map<string, Patient>();
    
    bookings.forEach(booking => {
      const existing = patientMap.get(booking.user_id);
      if (existing) {
        existing.total_bookings++;
        if (booking.booking_date > (existing.last_visit || '')) {
          existing.last_visit = booking.booking_date;
        }
        existing.bookings?.push({
          id: booking.id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: booking.status,
          service: booking.service,
        });
      } else {
        patientMap.set(booking.user_id, {
          user_id: booking.user_id,
          first_name: booking.profile?.first_name || null,
          last_name: booking.profile?.last_name || null,
          email: booking.profile?.email || null,
          phone: booking.profile?.phone || null,
          total_bookings: 1,
          last_visit: booking.booking_date,
          bookings: [{
            id: booking.id,
            booking_date: booking.booking_date,
            booking_time: booking.booking_time,
            status: booking.status,
            service: booking.service,
          }],
        });
      }
    });
    
    return Array.from(patientMap.values())
      .sort((a, b) => (b.last_visit || '').localeCompare(a.last_visit || ''));
  }, [bookings]);

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

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
      <div className="py-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <QuickStatsCard
              icon={Calendar}
              value={todayBookings.length}
              label="Today"
              iconBgColor="bg-primary/10"
              iconColor="text-primary"
            />
            <QuickStatsCard
              icon={Bell}
              value={pendingCount}
              label="Pending"
              iconBgColor="bg-amber-500/10"
              iconColor="text-amber-500"
            />
            <QuickStatsCard
              icon={UserCheck}
              value={completedThisWeek}
              label="This Week"
              iconBgColor="bg-green-500/10"
              iconColor="text-green-500"
            />
            <QuickStatsCard
              icon={TrendingUp}
              value={`R${revenueThisMonth.toLocaleString()}`}
              label="Revenue"
              iconBgColor="bg-blue-500/10"
              iconColor="text-blue-500"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Next Appointment */}
            <div className="lg:col-span-1">
              <NextAppointmentCard
                booking={nextAppointment}
                onComplete={(id) => updateBookingStatus(id, 'completed')}
                onNoShow={(id) => updateBookingStatus(id, 'no-show')}
                onConfirm={(id) => updateBookingStatus(id, 'confirmed')}
              />
            </div>

            {/* Right Column - Schedule & Patients */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="schedule" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="patients" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Patients
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="mt-0">
                  <ScheduleCalendar
                    bookings={bookings}
                    onComplete={(id) => updateBookingStatus(id, 'completed')}
                    onConfirm={(id) => updateBookingStatus(id, 'confirmed')}
                    onViewDetails={handleViewBookingDetails}
                  />
                </TabsContent>

                <TabsContent value="patients" className="mt-0">
                  <PatientList
                    patients={patients}
                    onSelectPatient={handleSelectPatient}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onComplete={(id) => updateBookingStatus(id, 'completed')}
        onNoShow={(id) => updateBookingStatus(id, 'no-show')}
        onConfirm={(id) => updateBookingStatus(id, 'confirmed')}
        onCancel={(id) => updateBookingStatus(id, 'cancelled')}
      />

      {/* Patient Details Sheet */}
      <PatientDetailsSheet
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </Layout>
  );
};

export default PractitionerDashboard;
