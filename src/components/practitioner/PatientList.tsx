import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User, Calendar, Phone, Mail, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Patient {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  total_bookings: number;
  last_visit: string | null;
}

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Patients</span>
          <Badge variant="secondary">{patients.length} total</Badge>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No patients found' : 'No patients yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.user_id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-4"
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {patient.total_bookings} visits
                      </span>
                      {patient.last_visit && (
                        <span>Last: {format(parseISO(patient.last_visit), 'MMM d')}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
