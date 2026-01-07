import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  GraduationCap, 
  Clock, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface OnboardingData {
  // Personal info
  phone: string;
  dateOfBirth: string;
  idNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Professional
  qualifications: string[];
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  yearsOfExperience: string;
  professionalRegistration: string;
  
  // Bio & preferences
  bio: string;
  languages: string[];
  contactPreference: string;
  
  // Services
  servicesOffered: string[];
  consultationFee: string;
}

const STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Credentials', icon: GraduationCap },
  { id: 3, name: 'Availability & Services', icon: Clock },
  { id: 4, name: 'Complete', icon: CheckCircle2 },
];

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
];

const LANGUAGES = [
  'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho', 
  'Tswana', 'Pedi', 'Venda', 'Tsonga', 'Swati', 'Ndebele'
];

const PractitionerOnboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPractitioner, practitionerId, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [services, setServices] = useState<{ id: string; name: string; category: string }[]>([]);
  const [practitioner, setPractitioner] = useState<{ id: string; name: string } | null>(null);
  
  const [formData, setFormData] = useState<OnboardingData>({
    phone: '',
    dateOfBirth: '',
    idNumber: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    qualifications: [],
    licenseNumber: '',
    licenseExpiry: '',
    certifications: [],
    yearsOfExperience: '',
    professionalRegistration: '',
    bio: '',
    languages: [],
    contactPreference: 'email',
    servicesOffered: [],
    consultationFee: '',
  });

  const [qualificationInput, setQualificationInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to auth with return URL
      const token = searchParams.get('token');
      navigate(`/auth?redirect=/practitioner/onboarding${token ? `?token=${token}` : ''}`);
      return;
    }

    if (!authLoading && !roleLoading && user && !isPractitioner) {
      toast({
        title: 'Access Denied',
        description: 'You must be a practitioner to access this page.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    if (practitionerId) {
      loadExistingData();
    }
  }, [user, authLoading, roleLoading, isPractitioner, practitionerId]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, category')
      .eq('is_active', true)
      .order('category');
    
    if (data) setServices(data);
  };

  const loadExistingData = async () => {
    if (!practitionerId) return;
    
    setIsLoading(true);
    try {
      // Get practitioner info
      const { data: practData } = await supabase
        .from('practitioners')
        .select('id, name')
        .eq('id', practitionerId)
        .single();
      
      if (practData) setPractitioner(practData);

      // Get existing profile data
      const { data: profileData } = await supabase
        .from('practitioner_profiles')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .single();

      if (profileData) {
        if (profileData.onboarding_completed) {
          toast({
            title: 'Onboarding Complete',
            description: 'You have already completed onboarding. Redirecting to dashboard.',
          });
          navigate('/practitioner');
          return;
        }

        setFormData({
          phone: profileData.phone || '',
          dateOfBirth: profileData.date_of_birth || '',
          idNumber: profileData.id_number || '',
          address: profileData.address || '',
          city: profileData.city || '',
          province: profileData.province || '',
          postalCode: profileData.postal_code || '',
          emergencyContactName: profileData.emergency_contact_name || '',
          emergencyContactPhone: profileData.emergency_contact_phone || '',
          qualifications: profileData.qualifications || [],
          licenseNumber: profileData.license_number || '',
          licenseExpiry: profileData.license_expiry || '',
          certifications: profileData.certifications || [],
          yearsOfExperience: profileData.years_of_experience?.toString() || '',
          professionalRegistration: profileData.professional_registration || '',
          bio: profileData.bio || '',
          languages: profileData.languages || [],
          contactPreference: profileData.contact_preference || 'email',
          servicesOffered: profileData.services_offered || [],
          consultationFee: profileData.consultation_fee?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      updateField('qualifications', [...formData.qualifications, qualificationInput.trim()]);
      setQualificationInput('');
    }
  };

  const removeQualification = (index: number) => {
    updateField('qualifications', formData.qualifications.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      updateField('certifications', [...formData.certifications, certificationInput.trim()]);
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    updateField('certifications', formData.certifications.filter((_, i) => i !== index));
  };

  const toggleLanguage = (language: string) => {
    const current = formData.languages;
    if (current.includes(language)) {
      updateField('languages', current.filter(l => l !== language));
    } else {
      updateField('languages', [...current, language]);
    }
  };

  const toggleService = (serviceId: string) => {
    const current = formData.servicesOffered;
    if (current.includes(serviceId)) {
      updateField('servicesOffered', current.filter(s => s !== serviceId));
    } else {
      updateField('servicesOffered', [...current, serviceId]);
    }
  };

  const saveProgress = async () => {
    if (!practitionerId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('practitioner_profiles')
        .update({
          phone: formData.phone || null,
          date_of_birth: formData.dateOfBirth || null,
          id_number: formData.idNumber || null,
          address: formData.address || null,
          city: formData.city || null,
          province: formData.province || null,
          postal_code: formData.postalCode || null,
          emergency_contact_name: formData.emergencyContactName || null,
          emergency_contact_phone: formData.emergencyContactPhone || null,
          qualifications: formData.qualifications.length > 0 ? formData.qualifications : null,
          license_number: formData.licenseNumber || null,
          license_expiry: formData.licenseExpiry || null,
          certifications: formData.certifications.length > 0 ? formData.certifications : null,
          years_of_experience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
          professional_registration: formData.professionalRegistration || null,
          bio: formData.bio || null,
          languages: formData.languages.length > 0 ? formData.languages : null,
          contact_preference: formData.contactPreference || null,
          services_offered: formData.servicesOffered.length > 0 ? formData.servicesOffered : null,
          consultation_fee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        })
        .eq('practitioner_id', practitionerId);

      if (error) throw error;
      
      toast({ title: 'Progress saved' });
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: 'Error saving progress', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const completeOnboarding = async () => {
    if (!practitionerId || !user) return;
    
    setIsSaving(true);
    try {
      // Save final data
      await saveProgress();

      // Mark onboarding complete
      const { error: profileError } = await supabase
        .from('practitioner_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('practitioner_id', practitionerId);

      if (profileError) throw profileError;

      // Activate practitioner
      const { error: practitionerError } = await supabase
        .from('practitioners')
        .update({ is_active: true })
        .eq('id', practitionerId);

      if (practitionerError) throw practitionerError;

      // Sync personal data to the profiles table so practitioner doesn't have to re-enter it
      const { error: userProfileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.phone || null,
          date_of_birth: formData.dateOfBirth || null,
          id_number: formData.idNumber || null,
          address: formData.address || null,
          city: formData.city || null,
          province: formData.province || null,
          postal_code: formData.postalCode || null,
          emergency_contact_name: formData.emergencyContactName || null,
          emergency_contact_phone: formData.emergencyContactPhone || null,
        })
        .eq('user_id', user.id);

      if (userProfileError) {
        console.error('Error syncing to profiles:', userProfileError);
        // Don't fail the whole process for this
      }

      // Update invitation status if token exists
      const token = searchParams.get('token');
      if (token) {
        await supabase
          .from('practitioner_invitations')
          .update({ status: 'accepted' })
          .eq('token', token);
      }

      toast({
        title: 'Welcome aboard!',
        description: 'Your practitioner profile is now active.',
      });
      
      navigate('/practitioner');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({ title: 'Error completing onboarding', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    await saveProgress();
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome{practitioner ? `, ${practitioner.name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Complete your practitioner profile to start accepting appointments
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center gap-2 ${
                      isActive ? 'text-primary' : isComplete ? 'text-primary/70' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-primary-foreground' : 
                      isComplete ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Professional Credentials'}
                {currentStep === 3 && 'Services & Preferences'}
                {currentStep === 4 && 'Review & Complete'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Your personal and contact details'}
                {currentStep === 2 && 'Your qualifications and professional registrations'}
                {currentStep === 3 && 'Services you offer and your preferences'}
                {currentStep === 4 && 'Review your information and complete onboarding'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="e.g., 082 123 4567"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        placeholder="SA ID Number"
                        value={formData.idNumber}
                        onChange={(e) => updateField('idNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Select value={formData.province} onValueChange={(v) => updateField('province', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Contact Name</Label>
                        <Input
                          id="emergencyName"
                          value={formData.emergencyContactName}
                          onChange={(e) => updateField('emergencyContactName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Credentials */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Qualifications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Bachelor of Nursing"
                        value={qualificationInput}
                        onChange={(e) => setQualificationInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                      />
                      <Button type="button" onClick={addQualification}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.qualifications.map((q, i) => (
                        <span 
                          key={i}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {q}
                          <button onClick={() => removeQualification(i)} className="hover:text-destructive">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Professional License Number</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="e.g., HPCSA Registration"
                        value={formData.licenseNumber}
                        onChange={(e) => updateField('licenseNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                      <Input
                        id="licenseExpiry"
                        type="date"
                        value={formData.licenseExpiry}
                        onChange={(e) => updateField('licenseExpiry', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalRegistration">Professional Body Registration</Label>
                    <Input
                      id="professionalRegistration"
                      placeholder="e.g., SANC, HPCSA"
                      value={formData.professionalRegistration}
                      onChange={(e) => updateField('professionalRegistration', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Certifications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., BLS Certified"
                        value={certificationInput}
                        onChange={(e) => setCertificationInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <Button type="button" onClick={addCertification}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.certifications.map((c, i) => (
                        <span 
                          key={i}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {c}
                          <button onClick={() => removeCertification(i)} className="hover:text-destructive">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Services & Preferences */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell patients about yourself, your experience, and your approach to healthcare..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Languages Spoken</Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.languages.includes(lang)}
                            onCheckedChange={() => toggleLanguage(lang)}
                          />
                          <span className="text-sm">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Preference</Label>
                    <Select value={formData.contactPreference} onValueChange={(v) => updateField('contactPreference', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email only</SelectItem>
                        <SelectItem value="phone">Phone only</SelectItem>
                        <SelectItem value="both">Both email and phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Services You Can Provide</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                      {services.map((service) => (
                        <label key={service.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded">
                          <Checkbox
                            checked={formData.servicesOffered.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <div>
                            <span className="text-sm font-medium">{service.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({service.category})</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (R)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      min="0"
                      placeholder="e.g., 350"
                      value={formData.consultationFee}
                      onChange={(e) => updateField('consultationFee', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Step 4: Review & Complete */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">You're almost done!</h3>
                    <p className="text-muted-foreground">
                      Review your information and click "Complete Onboarding" to activate your practitioner account.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Personal Info</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Phone: {formData.phone || 'Not provided'}</li>
                        <li>City: {formData.city || 'Not provided'}</li>
                        <li>Province: {formData.province || 'Not provided'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Credentials</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>License: {formData.licenseNumber || 'Not provided'}</li>
                        <li>Experience: {formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : 'Not provided'}</li>
                        <li>Qualifications: {formData.qualifications.length}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Languages</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.languages.length > 0 ? formData.languages.join(', ') : 'None selected'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.servicesOffered.length} services selected
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < STEPS.length ? (
                  <Button onClick={nextStep} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={completeOnboarding} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Complete Onboarding
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PractitionerOnboarding;
