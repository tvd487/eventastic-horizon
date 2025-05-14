
import React from 'react';
import { Calendar, Users, Search } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Easy Event Management",
      description: "Create and manage events with a simple, intuitive interface. Set up multi-day events with complex agendas in minutes."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Attendee Engagement",
      description: "Keep your attendees informed and engaged with QR check-ins, downloadable materials, and feedback collection."
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Powerful Analytics",
      description: "Gain valuable insights with comprehensive analytics. Track participation, revenue, and satisfaction metrics."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Eventomorrow</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to create, manage, and attend events successfully.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animated-element" style={{ animationDelay: `${index * 0.1}s` }}>
              <Feature {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
