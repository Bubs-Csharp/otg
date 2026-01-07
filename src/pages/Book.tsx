import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Users,
  Check,
  CreditCard,
  Loader2
} from 'lucide-react';
import { format, isBefore, startOfToday } from 'date-fns';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  price: number;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialization: string;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const steps = [
  { id: 1, name: 'Service', icon: Check },
  { id: 2, name: 'Date & Time', icon: CalendarIcon },
  { id: 3, name: 'Details', icon: User },
  { id: 4, name: 'Payment', icon: CreditCard },
];

const Book = () => {
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'on-arrival'>('online');

  // Booking state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=/book');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId || s.name === serviceId);
      if (service) {
        setSelectedService(service);
        setCurrentStep(2);
      }
    }
  }, [searchParams, services]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [servicesRes, locationsRes, practitionersRes] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('locations').select('*').eq('is_active', true),
        supabase.from('practitioners').select('*').eq('is_active', true),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (locationsRes.data) setLocations(locationsRes.data);
      if (practitionersRes.data) setPractitioners(practitionersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const categories = ['All', ...new Set(services.map(s => s.category))];
  const filteredServices = categoryFilter === 'All' 
    ? services 
    : services.filter(s => s.category === categoryFilter);

  const totalAmount = selectedService 
    ? selectedService.price * groupSize 
    : 0;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return selectedDate !== undefined && selectedTime !== '';
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      // Create the booking first
      const { data: booking, error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: selectedService.id,
        location_id: selectedLocation?.id || null,
        practitioner_id: selectedPractitioner?.id || null,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        group_size: groupSize,
        special_notes: specialNotes || null,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: paymentMethod === 'online' ? 'pending' : 'pay-on-arrival',
      }).select().single();

      if (bookingError) throw bookingError;

      if (paymentMethod === 'online') {
        // Create Yoco checkout session
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-yoco-checkout', {
          body: {
            booking_id: booking.id,
            amount: totalAmount,
            currency: 'ZAR',
            success_url: `${window.location.origin}/payment-success?booking_id=${booking.id}`,
            cancel_url: `${window.location.origin}/payment-cancelled?booking_id=${booking.id}`,
            metadata: {
              service_name: selectedService.name,
            },
          },
        });

        if (checkoutError) {
          console.error('Checkout error:', checkoutError);
          // Update booking to confirmed even if payment fails
          await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking.id);
          toast({
            title: 'Booking Confirmed',
            description: 'Your booking is confirmed. Payment can be completed later or on arrival.',
          });
          navigate('/dashboard');
          return;
        }

        // Redirect to Yoco checkout
        if (checkoutData?.redirect_url) {
          window.location.href = checkoutData.redirect_url;
        } else {
          throw new Error('No checkout URL received');
        }
      } else {
        // Pay on arrival - just confirm the booking
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking.id);
        
        toast({
          title: 'Booking Confirmed!',
          description: `Your appointment for ${selectedService.name} has been booked. Payment will be collected on arrival.`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoadingData) {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Book an Appointment</h1>
            <p className="text-muted-foreground">Complete the steps below to schedule your visit</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      currentStep >= step.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-sm mt-2 hidden md:block",
                      currentStep >= step.id ? "text-primary font-medium" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-1 mx-4",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="glass-card border-0 mb-6">
            <CardContent className="p-6">
              {/* Step 1: Select Service */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Select a Service</h2>
                    <p className="text-muted-foreground">Choose the health service you need</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <Badge 
                        key={cat}
                        variant={categoryFilter === cat ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map(service => (
                      <Card 
                        key={service.id}
                        className={cn(
                          "cursor-pointer transition-all hover-lift",
                          selectedService?.id === service.id 
                            ? "ring-2 ring-primary bg-primary/5" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedService(service)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{service.category}</Badge>
                            {selectedService?.id === service.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {service.duration_minutes} min
                            </span>
                            <span className="font-semibold text-primary">
                              R{service.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Date & Time */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Choose Date & Time</h2>
                    <p className="text-muted-foreground">Select your preferred appointment slot</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-3 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, startOfToday())}
                        className="rounded-lg border p-3 pointer-events-auto"
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block">Select Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="w-full"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Additional Details</h2>
                    <p className="text-muted-foreground">Choose location and add any special requirements</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Select Location (Optional)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {locations.map(location => (
                          <Card 
                            key={location.id}
                            className={cn(
                              "cursor-pointer transition-all",
                              selectedLocation?.id === location.id 
                                ? "ring-2 ring-primary bg-primary/5" 
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => setSelectedLocation(
                              selectedLocation?.id === location.id ? null : location
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-foreground">{location.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {location.address}, {location.city}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Preferred Practitioner (Optional)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {practitioners.map(practitioner => (
                          <Card 
                            key={practitioner.id}
                            className={cn(
                              "cursor-pointer transition-all",
                              selectedPractitioner?.id === practitioner.id 
                                ? "ring-2 ring-primary bg-primary/5" 
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => setSelectedPractitioner(
                              selectedPractitioner?.id === practitioner.id ? null : practitioner
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-foreground">{practitioner.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {practitioner.title}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="groupSize">
                          <Users className="w-4 h-4 inline mr-2" />
                          Group Size
                        </Label>
                        <Input
                          id="groupSize"
                          type="number"
                          min={1}
                          max={50}
                          value={groupSize}
                          onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">
                          For corporate bookings, enter number of participants
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Special Notes or Requirements</Label>
                      <Textarea
                        id="notes"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Any dietary requirements, medical conditions, or special requests..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Confirm & Pay</h2>
                    <p className="text-muted-foreground">Review your appointment and choose payment method</p>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {selectedService?.name}
                          </h3>
                          <p className="text-muted-foreground">{selectedService?.description}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">
                            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        {selectedLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{selectedLocation.name}</span>
                          </div>
                        )}
                        {selectedPractitioner && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Practitioner:</span>
                            <span className="font-medium">{selectedPractitioner.name}</span>
                          </div>
                        )}
                        {groupSize > 1 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Group Size:</span>
                            <span className="font-medium">{groupSize} people</span>
                          </div>
                        )}
                      </div>

                      {specialNotes && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Special Notes:</p>
                            <p className="text-sm">{specialNotes}</p>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {groupSize > 1 ? `${groupSize} × R${selectedService?.price}` : 'Service fee'}
                          </p>
                          <p className="text-2xl font-bold text-primary">R{totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className={cn(
                          "cursor-pointer transition-all",
                          paymentMethod === 'online' 
                            ? "ring-2 ring-primary bg-primary/5" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPaymentMethod('online')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              paymentMethod === 'online' ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">Pay Online Now</h4>
                              <p className="text-sm text-muted-foreground">
                                Secure payment via Card or EFT
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={cn(
                          "cursor-pointer transition-all",
                          paymentMethod === 'on-arrival' 
                            ? "ring-2 ring-primary bg-primary/5" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPaymentMethod('on-arrival')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              paymentMethod === 'on-arrival' ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">Pay on Arrival</h4>
                              <p className="text-sm text-muted-foreground">
                                Pay at the location when you arrive
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === 'online' ? (
                  <>
                    Proceed to Payment
                    <CreditCard className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Book;
