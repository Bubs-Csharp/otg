import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Phone, Mail, Calendar, MapPin, Clock, 
  CheckCircle, XCircle, MessageSquare, CreditCard, Users,
  Heart, Shield, IdCard, Home
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

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

interface PatientFullDetails {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  id_number: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  medical_aid_name: string | null;
  medical_aid_number: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

interface BookingDetailsSheetProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  onNoShow: (id: string) => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  booking,
  isOpen,
  onClose,
  onComplete,
  onNoShow,
  onConfirm,
  onCancel,
}) => {
  const [patientDetails, setPatientDetails] = useState<PatientFullDetails | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  useEffect(() => {
    if (booking?.user_id && isOpen) {
      fetchPatientDetails(booking.user_id);
    }
  }, [booking?.user_id, isOpen]);

  const fetchPatientDetails = async (userId: string) => {
    setLoadingPatient(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setPatientDetails(data);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoadingPatient(false);
    }
  };

  if (!booking) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'default',
      cancelled: 'destructive',
      'no-show': 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'} className="capitalize">{status}</Badge>;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Appointment Details
            {getStatusBadge(booking.status)}
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="appointment" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointment">Appointment</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
          </TabsList>

          {/* Appointment Tab */}
          <TabsContent value="appointment" className="space-y-6 mt-4">
            {/* Service Info */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="text-lg font-semibold mb-2">{booking.service?.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {booking.service?.duration_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  R{booking.total_amount}
                </span>
                {booking.group_size > 1 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {booking.group_size} people
                  </span>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">
                  {format(parseISO(booking.booking_date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-muted-foreground">{booking.booking_time}</p>
              </div>
            </div>

            {/* Location */}
            {booking.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{booking.location.name}, {booking.location.city}</span>
              </div>
            )}

            {/* Notes */}
            {booking.special_notes && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Notes</h4>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{booking.special_notes}</p>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
                {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </Badge>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {booking.status === 'pending' && (
                <Button className="w-full" onClick={() => { onConfirm(booking.id); onClose(); }}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Appointment
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <>
                  <Button className="w-full" onClick={() => { onComplete(booking.id); onClose(); }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { onNoShow(booking.id); onClose(); }}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark as No Show
                  </Button>
                </>
              )}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <Button variant="destructive" className="w-full" onClick={() => { onCancel(booking.id); onClose(); }}>
                  Cancel Appointment
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Patient Tab */}
          <TabsContent value="patient" className="space-y-6 mt-4">
            {loadingPatient ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : patientDetails ? (
              <>
                {/* Patient Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {patientDetails.first_name} {patientDetails.last_name}
                    </h3>
                    {patientDetails.date_of_birth && (
                      <p className="text-muted-foreground">
                        {calculateAge(patientDetails.date_of_birth)} years old
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </h4>
                  <div className="grid gap-2 p-3 rounded-lg bg-muted/30">
                    {patientDetails.phone && (
                      <a href={`tel:${patientDetails.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="w-4 h-4" />
                        {patientDetails.phone}
                      </a>
                    )}
                    {patientDetails.email && (
                      <a href={`mailto:${patientDetails.email}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Mail className="w-4 h-4" />
                        {patientDetails.email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Personal Details */}
                {(patientDetails.id_number || patientDetails.date_of_birth) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <IdCard className="w-4 h-4" />
                      Personal Details
                    </h4>
                    <div className="grid gap-2 p-3 rounded-lg bg-muted/30 text-sm">
                      {patientDetails.date_of_birth && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date of Birth</span>
                          <span>{format(parseISO(patientDetails.date_of_birth), 'MMMM d, yyyy')}</span>
                        </div>
                      )}
                      {patientDetails.id_number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID Number</span>
                          <span>{patientDetails.id_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address */}
                {(patientDetails.address || patientDetails.city) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Address
                    </h4>
                    <div className="p-3 rounded-lg bg-muted/30 text-sm">
                      {patientDetails.address && <p>{patientDetails.address}</p>}
                      <p>
                        {[patientDetails.city, patientDetails.province, patientDetails.postal_code]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Medical Aid */}
                {(patientDetails.medical_aid_name || patientDetails.medical_aid_number) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Medical Aid
                    </h4>
                    <div className="grid gap-2 p-3 rounded-lg bg-muted/30 text-sm">
                      {patientDetails.medical_aid_name && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provider</span>
                          <span>{patientDetails.medical_aid_name}</span>
                        </div>
                      )}
                      {patientDetails.medical_aid_number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Member Number</span>
                          <span>{patientDetails.medical_aid_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {(patientDetails.emergency_contact_name || patientDetails.emergency_contact_phone) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Emergency Contact
                    </h4>
                    <div className="grid gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
                      {patientDetails.emergency_contact_name && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span>{patientDetails.emergency_contact_name}</span>
                        </div>
                      )}
                      {patientDetails.emergency_contact_phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <a href={`tel:${patientDetails.emergency_contact_phone}`} className="text-primary hover:underline">
                            {patientDetails.emergency_contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No patient details available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
