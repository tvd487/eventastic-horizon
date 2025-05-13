
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface EventProps {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  price: number | 'Free';
}

const EventCard: React.FC<EventProps> = ({ 
  id, 
  title, 
  type, 
  date, 
  location, 
  imageUrl, 
  attendees, 
  price 
}) => {
  return (
    <Link to={`/events/${id}`}>
      <Card className="event-card overflow-hidden border border-gray-200 h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
          />
          <Badge className="absolute top-4 right-4 bg-oceanBlue hover:bg-oceanBlue-dark">
            {type}
          </Badge>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-2 text-oceanBlue" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-oceanBlue" />
            <span>{location}</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-100 pt-4 flex justify-between">
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{attendees} attending</span>
          </div>
          <div className="font-medium">
            {price === 'Free' ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${price}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
