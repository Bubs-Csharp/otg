import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <Card className="max-w-md w-full glass-card border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your booking has been confirmed and payment received. You'll receive a confirmation email shortly.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Bookings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
