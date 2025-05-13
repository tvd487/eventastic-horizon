
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Ticket, MessageSquare, FileText, Star } from 'lucide-react';
import { EventProps } from '../../components/events/EventCard';
import EventList from '../../components/events/EventList';
import { allEvents } from '../../data/sampleEvents';

interface User {
  email: string;
  role: string;
}

const AttendeeNavigation: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

const AttendeeWelcome: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-oceanBlue to-oceanBlue-dark text-white rounded-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.email}</h1>
      <p className="opacity-90">Attendee Dashboard</p>
    </div>
  );
};

const AttendeeDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<EventProps[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<EventProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('currentUser');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userString);
    
    // Check if user has attendee role
    if (parsedUser.role !== 'attendee') {
      navigate('/select-role');
      return;
    }
    
    setUser(parsedUser);
    
    // For demo purposes, set some random events as registered
    const sampleRegisteredEvents = allEvents.slice(0, 2);
    setRegisteredEvents(sampleRegisteredEvents);
    
    // For demo purposes, set some random events as recommended
    const sampleRecommendedEvents = allEvents.slice(2, 5);
    setRecommendedEvents(sampleRecommendedEvents);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <AttendeeNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <AttendeeWelcome user={user} />
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Browse Events", icon: <Calendar />, action: () => navigate('/events') },
            { title: "My Tickets", icon: <Ticket />, action: () => {} },
            { title: "View Agenda", icon: <FileText />, action: () => {} },
            { title: "Submit Feedback", icon: <Star />, action: () => {} },
          ].map((action, index) => (
            <Card key={index} className="text-center hover:border-oceanBlue cursor-pointer transition-all" onClick={action.action}>
              <CardContent className="pt-6">
                <div className="mb-3 flex justify-center">
                  {action.icon}
                </div>
                <h3 className="font-medium">{action.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>
          {registeredEvents.length > 0 ? (
            <EventList events={registeredEvents} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                <Button onClick={() => navigate('/events')}>Browse Events</Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Recommended Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
          <EventList events={recommendedEvents} />
        </div>
        
        {/* AI Assistant */}
        <div className="fixed bottom-6 right-6">
          <Button 
            className="rounded-full h-16 w-16 shadow-lg flex items-center justify-center bg-oceanBlue hover:bg-oceanBlue-dark"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AttendeeDashboard;
