
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { allEvents } from '@/data/sampleEvents';

interface TicketInfo {
  id: string;
  eventId: string;
  userId: string;
  type: string;
  price: number;
  purchaseDate: string;
  status: 'confirmed' | 'used' | 'canceled';
}

interface EventTicketProps {
  ticket: TicketInfo;
  event: any;
}

const EventTicket: React.FC<EventTicketProps> = ({ ticket, event }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-oceanBlue p-4 text-white flex items-center justify-between">
        <h3 className="font-semibold">{event?.title || "Event"}</h3>
        <Badge variant="outline" className="text-white border-white">
          {ticket.status === 'confirmed' ? 'Confirmed' : ticket.status === 'used' ? 'Used' : 'Canceled'}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <p className="font-medium">{ticket.type}</p>
          
          {event && (
            <>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-2 text-oceanBlue" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-oceanBlue" />
                <span>{event.location}</span>
              </div>
            </>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            <div>Ticket ID: {ticket.id}</div>
            <div>Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100">
        <div className="flex w-full justify-between items-center">
          <div>
            {ticket.price === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span className="font-medium">${ticket.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button variant="default" size="sm" className="bg-oceanBlue hover:bg-oceanBlue-dark">
              <Ticket className="mr-1 h-4 w-4" />
              {ticket.status === 'confirmed' ? 'Show QR Code' : 'Download'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const UserTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use localStorage
    const storedTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    setTickets(storedTickets);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
          <p className="text-gray-500 mb-4">You haven't purchased any tickets yet.</p>
          <Button
            className="bg-oceanBlue hover:bg-oceanBlue-dark"
            onClick={() => window.location.href = '/events'}
          >
            Browse Events
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Tickets</h2>
      {tickets.map((ticket) => {
        const event = allEvents.find(e => e.id === ticket.eventId);
        return (
          <EventTicket 
            key={ticket.id} 
            ticket={ticket} 
            event={event} 
          />
        );
      })}
    </div>
  );
};

export default UserTickets;
