import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Activity,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  total_amount: number;
  service: { name: string } | null;
  practitioner: { name: string } | null;
}

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  paidBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyRevenue: number;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  // Service form state
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        supabase.from('services').select('*').order('category'),
        supabase.from('bookings').select(`
          *,
          service:services(name),
          practitioner:practitioners(name)
        `).order('booking_date', { ascending: false }).limit(100),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);

      // Calculate analytics
      const allBookings = bookingsRes.data || [];
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      const monthlyBookings = allBookings.filter(b => {
        const date = parseISO(b.booking_date);
        return date >= monthStart && date <= monthEnd;
      });

      setAnalytics({
        totalBookings: allBookings.length,
        totalRevenue: allBookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.total_amount, 0),
        paidBookings: allBookings.filter(b => b.payment_status === 'paid').length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
        monthlyRevenue: monthlyBookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.total_amount, 0),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceName(service.name);
      setServiceDescription(service.description || '');
      setServiceCategory(service.category);
      setServicePrice(service.price.toString());
      setServiceDuration(service.duration_minutes.toString());
    } else {
      setEditingService(null);
      setServiceName('');
      setServiceDescription('');
      setServiceCategory('');
      setServicePrice('');
      setServiceDuration('30');
    }
    setIsServiceDialogOpen(true);
  };

  const saveService = async () => {
    try {
      const serviceData = {
        name: serviceName,
        description: serviceDescription || null,
        category: serviceCategory,
        price: parseFloat(servicePrice),
        duration_minutes: parseInt(serviceDuration),
        is_active: true,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
        toast({ title: 'Service updated successfully' });
      } else {
        const { error } = await supabase.from('services').insert(serviceData);
        if (error) throw error;
        toast({ title: 'Service created successfully' });
      }

      setIsServiceDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ title: 'Error saving service', variant: 'destructive' });
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);
      if (error) throw error;
      toast({ title: `Service ${service.is_active ? 'deactivated' : 'activated'}` });
      fetchData();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      toast({ title: 'Service deleted' });
      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({ title: 'Cannot delete service with existing bookings', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
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

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your business operations</p>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalBookings}</p>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">R{analytics.totalRevenue.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">R{analytics.monthlyRevenue.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.completedBookings}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="bookings">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>View and manage all bookings across practitioners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.slice(0, 20).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{booking.service?.name}</span>
                            {getStatusBadge(booking.status)}
                            <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
                              {booking.payment_status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(booking.booking_date), 'MMM d, yyyy')} at {booking.booking_time}
                            {booking.practitioner && ` • ${booking.practitioner.name}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R{booking.total_amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Service Management</CardTitle>
                      <CardDescription>Add, edit, and manage your services</CardDescription>
                    </div>
                    <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => openServiceDialog()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                          <DialogDescription>Fill in the service details below</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Service Name</Label>
                            <Input 
                              value={serviceName} 
                              onChange={(e) => setServiceName(e.target.value)}
                              placeholder="e.g., Deep Tissue Massage"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Input 
                              value={serviceCategory} 
                              onChange={(e) => setServiceCategory(e.target.value)}
                              placeholder="e.g., Massage Therapy"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={serviceDescription} 
                              onChange={(e) => setServiceDescription(e.target.value)}
                              placeholder="Describe the service..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Price (ZAR)</Label>
                              <Input 
                                type="number"
                                value={servicePrice} 
                                onChange={(e) => setServicePrice(e.target.value)}
                                placeholder="500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration (minutes)</Label>
                              <Input 
                                type="number"
                                value={serviceDuration} 
                                onChange={(e) => setServiceDuration(e.target.value)}
                                placeholder="30"
                              />
                            </div>
                          </div>
                          <Button onClick={saveService} className="w-full">
                            {editingService ? 'Update Service' : 'Create Service'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map(category => (
                      <div key={category}>
                        <h3 className="font-semibold text-foreground mb-2">{category}</h3>
                        <div className="space-y-2">
                          {services.filter(s => s.category === category).map(service => (
                            <div key={service.id} className={`flex items-center justify-between p-3 rounded-lg ${service.is_active ? 'bg-muted/50' : 'bg-muted/20 opacity-60'}`}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{service.name}</span>
                                  {!service.is_active && <Badge variant="secondary">Inactive</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {service.duration_minutes} min • R{service.price}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => openServiceDialog(service)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => toggleServiceStatus(service)}>
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteService(service.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Completed</span>
                        <Badge className="bg-green-500">{analytics?.completedBookings}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Confirmed</span>
                        <Badge>{bookings.filter(b => b.status === 'confirmed').length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pending</span>
                        <Badge variant="secondary">{bookings.filter(b => b.status === 'pending').length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cancelled</span>
                        <Badge variant="destructive">{analytics?.cancelledBookings}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Collected</span>
                        <span className="font-bold text-green-600">R{analytics?.totalRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Paid Bookings</span>
                        <span>{analytics?.paidBookings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pending Payments</span>
                        <span>{bookings.filter(b => b.payment_status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Booking Value</span>
                        <span>R{analytics && analytics.paidBookings > 0 ? (analytics.totalRevenue / analytics.paidBookings).toFixed(2) : '0'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Popular Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.slice(0, 5).map(service => {
                        const serviceBookings = bookings.filter(b => b.service?.name === service.name).length;
                        return (
                          <div key={service.id} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{service.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">{service.category}</span>
                            </div>
                            <Badge variant="outline">{serviceBookings} bookings</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
