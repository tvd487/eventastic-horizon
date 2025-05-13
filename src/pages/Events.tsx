
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import EventList from '../components/events/EventList';
import { allEvents } from '../data/sampleEvents';
import { EventProps } from '../components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<EventProps[]>(allEvents);
  const [activeTab, setActiveTab] = useState('all');

  // Handle search and filtering
  useEffect(() => {
    const filterEvents = () => {
      let results = allEvents;
      
      // Filter by search term
      if (searchTerm) {
        results = results.filter(
          event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by event type (tab)
      if (activeTab !== 'all') {
        results = results.filter(event => event.type.toLowerCase() === activeTab.toLowerCase());
      }
      
      setFilteredEvents(results);
    };
    
    filterEvents();
  }, [searchTerm, activeTab]);

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Discover Events</h1>
            
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search events by name, location, or type..."
                className="pl-10 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute right-1 top-1 bg-oceanBlue hover:bg-oceanBlue-dark" 
                onClick={() => setSearchTerm(searchTerm)}
              >
                Search
              </Button>
            </div>
            
            {/* Event Type Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="sports">Sports</TabsTrigger>
                <TabsTrigger value="investment">Investment</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        {filteredEvents.length > 0 ? (
          <>
            <p className="mb-6 text-gray-600">{filteredEvents.length} events found</p>
            <EventList events={filteredEvents} />
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => {setSearchTerm(''); setActiveTab('all');}}>Clear filters</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
