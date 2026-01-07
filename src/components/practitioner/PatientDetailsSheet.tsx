import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Phone, Mail, Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PatientBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  service: { name: string } | null;
}

interface PatientDetails {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  total_bookings: number;
  last_visit: string | null;
  bookings?: PatientBooking[];
}

interface PatientDetailsSheetProps {
  patient: PatientDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientDetailsSheet: React.FC<PatientDetailsSheetProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!patient) return null;

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'cancelled' || status === 'no-show') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Patient Details</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Patient Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {patient.first_name} {patient.last_name}
              </h3>
              <p className="text-muted-foreground">{patient.total_bookings} appointments</p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact</h4>
            {patient.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${patient.email}`} className="text-primary hover:underline">
                  {patient.email}
                </a>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${patient.phone}`} className="text-primary hover:underline">
                  {patient.phone}
                </a>
              </div>
            )}
          </div>

          <Separator />

          {/* Appointment History */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Appointment History
            </h4>
            <ScrollArea className="h-[300px]">
              {patient.bookings && patient.bookings.length > 0 ? (
                <div className="space-y-3">
                  {patient.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      {getStatusIcon(booking.status)}
                      <div className="flex-1">
                        <p className="font-medium">{booking.service?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(booking.booking_date), 'MMM d, yyyy')} at {booking.booking_time}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No appointment history</p>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
