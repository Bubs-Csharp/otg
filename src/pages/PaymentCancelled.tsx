import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <Card className="max-w-md w-full glass-card border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground mb-6">
              Your payment was cancelled. Your booking has been saved and you can complete the payment later from your dashboard.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/book">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentCancelled;
