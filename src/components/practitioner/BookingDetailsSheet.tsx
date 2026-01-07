import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Phone, Mail, Calendar, MapPin, Clock, 
  CheckCircle, XCircle, MessageSquare, CreditCard, Users 
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
  service: { name: string; duration_minutes: number } | null;
  location: { name: string; city: string } | null;
  profile: { first_name: string | null; last_name: string | null; phone: string | null; email: string | null } | null;
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Appointment Details
            {getStatusBadge(booking.status)}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
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

          <Separator />

          {/* Patient Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Patient</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {booking.profile?.first_name} {booking.profile?.last_name}
                </p>
                {booking.profile?.phone && (
                  <a href={`tel:${booking.profile.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {booking.profile.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {booking.location && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Location</h4>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.location.name}, {booking.location.city}</span>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {booking.special_notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Notes</h4>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{booking.special_notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Payment */}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
              {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
