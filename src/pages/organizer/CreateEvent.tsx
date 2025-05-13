
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Settings, Image } from 'lucide-react';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  
  // For demo purposes - would actually submit to backend in a real app
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Event creation functionality would be implemented with a backend");
    navigate('/organizer/dashboard');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/organizer/dashboard')}
          >
            Cancel
          </Button>
        </div>
        
        <Card className="mb-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" placeholder="Enter event title" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your event..." 
                      rows={5}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select 
                        id="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option>Technology</option>
                        <option>Music</option>
                        <option>Sports</option>
                        <option>Business</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Event location or Online" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Save & Continue</Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="schedule">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Set Up Your Event Schedule</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create sessions, add speakers, and organize your event agenda
                  </p>
                  <Button className="mt-4">Add Session</Button>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="tickets">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Configure Ticket Options</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Set up different ticket types, prices, and availability
                  </p>
                  <Button className="mt-4">Add Ticket Type</Button>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="media">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Event Media</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload event banner, logo, and promotional materials
                  </p>
                  <Button className="mt-4">Upload Images</Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tips for Successful Events</CardTitle>
            <CardDescription>
              Follow these guidelines to maximize attendance and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use clear, descriptive titles that include key information</li>
              <li>Add high-quality images that represent your event well</li>
              <li>Provide detailed information about speakers and sessions</li>
              <li>Create different ticket types to appeal to various audiences</li>
              <li>Promote your event on social media and relevant platforms</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateEvent;
