import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';
import { 
  format, 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isPast
} from 'date-fns';

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

type ViewMode = 'day' | 'week' | 'month';

interface ScheduleCalendarProps {
  bookings: Booking[];
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  bookings,
  onComplete,
  onConfirm,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => isSameDay(parseISO(b.booking_date), date))
      .sort((a, b) => a.booking_time.localeCompare(b.booking_time));
  };

  // Get days for the current view
  const viewDays = useMemo(() => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const monthDays = eachDayOfInterval({ start, end });
      
      // Add padding days from previous month
      const startPadding = startOfWeek(start, { weekStartsOn: 1 });
      const endPadding = endOfWeek(end, { weekStartsOn: 1 });
      
      return eachDayOfInterval({ start: startPadding, end: endPadding });
    }
  }, [viewMode, currentDate]);

  // Selected date bookings
  const selectedDateBookings = useMemo(() => 
    getBookingsForDate(selectedDate),
    [selectedDate, bookings]
  );

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'no-show' || status === 'cancelled') return 'bg-red-500';
    if (status === 'confirmed') return 'bg-blue-500';
    if (status === 'pending') return 'bg-amber-500';
    return 'bg-muted';
  };

  const getHeaderTitle = () => {
    if (viewMode === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 space-y-4">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex bg-muted rounded-lg p-1">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setViewMode(mode);
                  if (mode === 'day') setSelectedDate(currentDate);
                }}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-lg">{getHeaderTitle()}</h3>
          <Button variant="ghost" size="icon" onClick={goToNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Day View */}
        {viewMode === 'day' && (
          <DayView
            bookings={getBookingsForDate(currentDate)}
            onComplete={onComplete}
            onConfirm={onConfirm}
            onViewDetails={onViewDetails}
          />
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <WeekView
            days={viewDays}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getBookingsForDate={getBookingsForDate}
            selectedDateBookings={selectedDateBookings}
            onComplete={onComplete}
            onConfirm={onConfirm}
            onViewDetails={onViewDetails}
          />
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <MonthView
            days={viewDays}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getBookingsForDate={getBookingsForDate}
            selectedDateBookings={selectedDateBookings}
            onComplete={onComplete}
            onConfirm={onConfirm}
            onViewDetails={onViewDetails}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Day View Component
const DayView: React.FC<{
  bookings: Booking[];
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}> = ({ bookings, onComplete, onConfirm, onViewDetails }) => {
  const getStatusColor = (status: string, isPastTime: boolean) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'no-show' || status === 'cancelled') return 'bg-red-500';
    if (status === 'confirmed' && !isPastTime) return 'bg-blue-500';
    if (status === 'pending') return 'bg-amber-500';
    return 'bg-muted';
  };

  return (
    <ScrollArea className="h-[400px]">
      {bookings.length === 0 ? (
        <div className="text-center py-12 px-4">
          <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No appointments</p>
        </div>
      ) : (
        <div className="relative p-4">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-1">
            {bookings.map((booking) => {
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
                          onClick={(e) => { e.stopPropagation(); onConfirm(booking.id); }}
                        >
                          Confirm
                        </Button>
                      )}
                      {booking.status === 'confirmed' && !isPastTime && (
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onComplete(booking.id); }}
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

// Week View Component
const WeekView: React.FC<{
  days: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getBookingsForDate: (date: Date) => Booking[];
  selectedDateBookings: Booking[];
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}> = ({ days, selectedDate, onSelectDate, getBookingsForDate, selectedDateBookings, onComplete, onConfirm, onViewDetails }) => {
  return (
    <div>
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => {
          const dayBookings = getBookingsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const today = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`p-3 text-center transition-colors hover:bg-muted/50 ${
                isSelected ? 'bg-primary/10' : ''
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">
                {format(day, 'EEE')}
              </p>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                today ? 'bg-primary text-primary-foreground' : isSelected ? 'bg-primary/20' : ''
              }`}>
                {format(day, 'd')}
              </div>
              {/* Appointment dots */}
              {dayBookings.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {dayBookings.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{dayBookings.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day appointments */}
      <div className="p-4">
        <h4 className="font-medium mb-3 text-sm text-muted-foreground">
          {format(selectedDate, 'EEEE, MMMM d')}
          {selectedDateBookings.length > 0 && (
            <Badge variant="secondary" className="ml-2">{selectedDateBookings.length}</Badge>
          )}
        </h4>
        <ScrollArea className="h-[250px]">
          {selectedDateBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No appointments</p>
          ) : (
            <div className="space-y-2">
              {selectedDateBookings.map((booking) => (
                <AppointmentCard
                  key={booking.id}
                  booking={booking}
                  onComplete={onComplete}
                  onConfirm={onConfirm}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// Month View Component
const MonthView: React.FC<{
  days: Date[];
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getBookingsForDate: (date: Date) => Booking[];
  selectedDateBookings: Booking[];
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}> = ({ days, currentDate, selectedDate, onSelectDate, getBookingsForDate, selectedDateBookings, onComplete, onConfirm, onViewDetails }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayBookings = getBookingsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`p-2 min-h-[60px] border-b border-r transition-colors hover:bg-muted/50 ${
                isSelected ? 'bg-primary/10' : ''
              } ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs ${
                today ? 'bg-primary text-primary-foreground' : ''
              }`}>
                {format(day, 'd')}
              </div>
              {/* Appointment indicators */}
              {dayBookings.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
                  {dayBookings.length <= 3 ? (
                    dayBookings.map((b, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${
                          b.status === 'completed' ? 'bg-green-500' :
                          b.status === 'pending' ? 'bg-amber-500' :
                          b.status === 'confirmed' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`} 
                      />
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                      {dayBookings.length}
                    </Badge>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day appointments */}
      <div className="p-4 border-t">
        <h4 className="font-medium mb-3 text-sm text-muted-foreground">
          {format(selectedDate, 'EEEE, MMMM d')}
          {selectedDateBookings.length > 0 && (
            <Badge variant="secondary" className="ml-2">{selectedDateBookings.length}</Badge>
          )}
        </h4>
        <ScrollArea className="h-[150px]">
          {selectedDateBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No appointments</p>
          ) : (
            <div className="space-y-2">
              {selectedDateBookings.map((booking) => (
                <AppointmentCard
                  key={booking.id}
                  booking={booking}
                  onComplete={onComplete}
                  onConfirm={onConfirm}
                  onViewDetails={onViewDetails}
                  compact
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// Compact Appointment Card
const AppointmentCard: React.FC<{
  booking: Booking;
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
  compact?: boolean;
}> = ({ booking, onComplete, onConfirm, onViewDetails, compact }) => {
  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'border-l-green-500';
    if (status === 'no-show' || status === 'cancelled') return 'border-l-red-500';
    if (status === 'confirmed') return 'border-l-blue-500';
    if (status === 'pending') return 'border-l-amber-500';
    return 'border-l-muted';
  };

  return (
    <div
      onClick={() => onViewDetails(booking)}
      className={`p-3 rounded-lg bg-muted/30 border-l-4 ${getStatusColor(booking.status)} cursor-pointer hover:bg-muted/50 transition-colors`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-medium">{booking.booking_time}</span>
            {!compact && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{booking.service?.duration_minutes}min</span>
              </>
            )}
          </div>
          <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>{booking.service?.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {booking.profile?.first_name} {booking.profile?.last_name}
          </p>
        </div>
        
        {!compact && booking.status === 'pending' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onConfirm(booking.id); }}
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
};
