import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="hero-gradient text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Discover and Host Amazing Events
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your all-in-one platform for managing events of any size. From sports to music, investment to technology - we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" asChild className="bg-white text-oceanBlue hover:bg-gray-100">
              <Link to="/events">
                <Search className="mr-2 h-4 w-4" />
                Browse Events
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-oceanBlue hover:bg-white/10">
              <Link to="/create">
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
