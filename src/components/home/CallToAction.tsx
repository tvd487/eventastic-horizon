import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-oceanBlue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Host Your Next Event?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of event organizers who trust Eventomorrow to create memorable experiences for their attendees.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-white text-oceanBlue hover:bg-gray-100">
            <Link to="/signup">
              Get Started for Free
            </Link>
          </Button>
          <Button size="lg" asChild variant="outline" className="border-white text-oceanBlue hover:bg-white/10">
            <Link to="/contact">
              Contact Sales
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
