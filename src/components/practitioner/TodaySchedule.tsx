import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

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

interface TodayScheduleProps {
  bookings: Booking[];
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  bookings,
  onComplete,
  onConfirm,
  onViewDetails,
}) => {
  const getStatusColor = (status: string, isPastTime: boolean) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'no-show' || status === 'cancelled') return 'bg-red-500';
    if (status === 'confirmed' && !isPastTime) return 'bg-blue-500';
    if (status === 'pending') return 'bg-amber-500';
    return 'bg-muted';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Today's Schedule</span>
          <Badge variant="secondary">{bookings.length} appointments</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {bookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No appointments today</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-1 p-4">
                {bookings.map((booking, index) => {
                  const isPastTime = isPast(parseISO(`${booking.booking_date}T${booking.booking_time}`));
                  const isCompleted = booking.status === 'completed';
                  
                  return (
                    <div
                      key={booking.id}
                      className={`relative pl-10 py-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${
                        isCompleted ? 'opacity-60' : ''
                      }`}
                      onClick={() => onViewDetails(booking)}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(booking.status, isPastTime)}`} />
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-medium">{booking.booking_time}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{booking.service?.duration_minutes}min</span>
                          </div>
                          <p className="font-medium truncate">{booking.service?.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {booking.profile?.first_name} {booking.profile?.last_name}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onConfirm(booking.id);
                              }}
                            >
                              Confirm
                            </Button>
                          )}
                          {booking.status === 'confirmed' && !isPastTime && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onComplete(booking.id);
                              }}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Done
                            </Button>
                          )}
                          {isCompleted && (
                            <Badge variant="outline" className="text-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
