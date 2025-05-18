import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Ticket } from 'lucide-react';
import EventList from '@/components/events/EventList';
import UserTickets from '@/components/attendee/UserTickets';
import { featuredEvents } from '@/data/sampleEvents';
import { useLanguage } from '@/contexts/useLanguage';

const AttendeesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if user is logged in and role is attendee
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userString);
    if (userData.role !== 'attendee') {
      navigate('/select-role');
      return;
    }
    
    setUser(userData);
  }, [navigate]);
  
  if (!user) {
    return null; // Or a loading indicator
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {t('attendee.dashboard.welcome') + ' ' + (user.name || t('attendee.dashboard.attendee')) + '!'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-oceanBlue" />
                {t('attendee.dashboard.upcomingEvents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Ticket className="mr-2 h-5 w-5 text-oceanBlue" />
                {t('attendee.dashboard.myTickets')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem('userTickets') || '[]').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-oceanBlue" />
                {t('attendee.dashboard.connections')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-10">
          <UserTickets />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t('attendee.dashboard.recommendedEvents')}</h2>
            <Button 
              variant="outline" 
              className="border-oceanBlue text-oceanBlue hover:bg-oceanBlue hover:text-white"
              onClick={() => navigate('/events')}
            >
              {t('attendee.dashboard.viewAllEvents')}
            </Button>
          </div>
          <EventList events={featuredEvents.slice(0, 3)} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AttendeesDashboard;
