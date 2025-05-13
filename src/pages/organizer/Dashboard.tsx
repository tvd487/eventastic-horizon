
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart2, Users, Settings, PieChart } from 'lucide-react';
import { EventProps } from '../../components/events/EventCard';
import EventList from '../../components/events/EventList';
import { allEvents } from '../../data/sampleEvents';
import { Separator } from "@/components/ui/separator";
import OrganizerEventsList from '../../components/organizer/OrganizerEventsList';
import EventStatsCard from '../../components/organizer/EventStatsCard';

interface User {
  email: string;
  role: string;
}

const OrganizerNavigation: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

const OrganizerWelcome: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.email}</h1>
      <p className="opacity-90">Event Organizer Dashboard</p>
    </div>
  );
};

const OrganizerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myEvents, setMyEvents] = useState<EventProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('currentUser');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userString);
    
    // Check if user has organizer role
    if (parsedUser.role !== 'organizer') {
      navigate('/select-role');
      return;
    }
    
    setUser(parsedUser);
    
    // For demo purposes, set some random events as the organizer's events
    const sampleMyEvents = allEvents.slice(0, 3);
    setMyEvents(sampleMyEvents);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <OrganizerNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <OrganizerWelcome user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/organizer/events/create')}
          >
            <Calendar size={24} />
            <span>Create New Event</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => navigate('/organizer/tickets')}
          >
            <Users size={24} />
            <span>Manage Tickets</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => navigate('/organizer/analytics')}
          >
            <BarChart2 size={24} />
            <span>View Analytics</span>
          </Button>
        </div>
        
        {/* Event Performance Overview */}
        <h2 className="text-2xl font-bold mb-4">Event Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <EventStatsCard 
            title="Total Events" 
            value={myEvents.length.toString()} 
            icon={<Calendar className="h-5 w-5 text-purple-600" />}
            trend="+2 this month"
            trendUp={true}
          />
          <EventStatsCard 
            title="Total Attendees" 
            value="487" 
            icon={<Users className="h-5 w-5 text-purple-600" />}
            trend="+32 this week"
            trendUp={true}
          />
          <EventStatsCard 
            title="Tickets Sold" 
            value="352" 
            icon={<BarChart2 className="h-5 w-5 text-purple-600" />}
            trend="85% of capacity"
            trendUp={true}
          />
          <EventStatsCard 
            title="Average Rating" 
            value="4.7/5" 
            icon={<PieChart className="h-5 w-5 text-purple-600" />}
            trend="+0.3 from last event"
            trendUp={true}
          />
        </div>
        
        {/* Upcoming Events */}
        <h2 className="text-2xl font-bold mb-4">My Events</h2>
        <OrganizerEventsList events={myEvents} />
        
        <Separator className="my-8" />
        
        {/* Quick Links */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Manage Speakers", icon: <Users className="h-5 w-5" /> },
            { title: "Send Notifications", icon: <Calendar className="h-5 w-5" /> },
            { title: "View Reports", icon: <BarChart2 className="h-5 w-5" /> },
            { title: "Account Settings", icon: <Settings className="h-5 w-5" /> },
          ].map((action, index) => (
            <Card key={index} className="hover:border-purple-300 cursor-pointer transition-all">
              <CardContent className="pt-6 flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrganizerDashboard;
