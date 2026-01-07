import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin, Phone, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { format, parseISO, differenceInMinutes } from 'date-fns';

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

interface NextAppointmentCardProps {
  booking: Booking | null;
  onComplete: (id: string) => void;
  onNoShow: (id: string) => void;
  onConfirm: (id: string) => void;
}

export const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({
  booking,
  onComplete,
  onNoShow,
  onConfirm,
}) => {
  if (!booking) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Appointments</h3>
          <p className="text-muted-foreground">You're all caught up for today!</p>
        </CardContent>
      </Card>
    );
  }

  const appointmentDateTime = parseISO(`${booking.booking_date}T${booking.booking_time}`);
  const minutesUntil = differenceInMinutes(appointmentDateTime, new Date());
  const isUpcoming = minutesUntil > 0 && minutesUntil <= 60;
  const isNow = minutesUntil >= -15 && minutesUntil <= 15;

  return (
    <Card className={`border-2 ${isNow ? 'border-green-500 bg-green-500/5' : isUpcoming ? 'border-amber-500 bg-amber-500/5' : 'border-primary/20 bg-primary/5'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isNow ? (
              <Badge className="bg-green-500 animate-pulse">Now</Badge>
            ) : isUpcoming ? (
              <Badge className="bg-amber-500">In {minutesUntil} min</Badge>
            ) : (
              <Badge variant="outline">Next Up</Badge>
            )}
            <span>{booking.service?.name}</span>
          </CardTitle>
          <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
            {booking.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-lg">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold">{booking.booking_time}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{booking.service?.duration_minutes} min</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {booking.profile?.first_name} {booking.profile?.last_name}
            </p>
            {booking.profile?.phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> {booking.profile.phone}
              </p>
            )}
          </div>
        </div>

        {booking.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{booking.location.name}, {booking.location.city}</span>
          </div>
        )}

        {booking.special_notes && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <p className="text-sm">{booking.special_notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {booking.status === 'pending' && (
            <Button className="flex-1" onClick={() => onConfirm(booking.id)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Appointment
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button className="flex-1" onClick={() => onComplete(booking.id)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
              <Button variant="outline" onClick={() => onNoShow(booking.id)}>
                <XCircle className="w-4 h-4 mr-2" />
                No Show
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
