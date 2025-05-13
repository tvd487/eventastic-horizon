
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface EventTypeProps {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const EventTypeCard: React.FC<EventTypeProps> = ({ name, description, icon, color }) => {
  return (
    <Link to={`/events?type=${name.toLowerCase()}`}>
      <Card className="h-full hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: color }}>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{icon}</span>
            <h3 className="text-xl font-semibold">{name}</h3>
          </div>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

const EventTypes: React.FC = () => {
  const eventTypes: EventTypeProps[] = [
    {
      name: "Sports",
      description: "From marathons to tournaments, manage all sports events efficiently.",
      icon: "🏆",
      color: "#4CAF50"
    },
    {
      name: "Music",
      description: "Concerts, festivals, and live performances with ticket management.",
      icon: "🎵",
      color: "#9C27B0"
    },
    {
      name: "Investment",
      description: "Seminars, workshops, and networking events for financial growth.",
      icon: "📈",
      color: "#FFC107"
    },
    {
      name: "Technology",
      description: "Conferences, hackathons, and product launches for tech enthusiasts.",
      icon: "💻",
      color: "#0EA5E9"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Event Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Eventomorrow supports a wide range of event types, each with specialized features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((type, index) => (
            <div key={index} className="animated-element" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventTypeCard {...type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
