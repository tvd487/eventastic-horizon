
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Settings, Image, Plus, Trash2, Clock, List, Building, Award, Upload } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

// Define types
interface Speaker {
  id: string;
  name: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
}

interface Sponsor {
  id: string;
  name: string;
  level: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
  description?: string;
  logoUrl?: string;
}

interface ExhibitionBooth {
  id: string;
  name: string;
  company: string;
  description?: string;
  location?: string;
  coverImageUrl?: string;
}

interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'workshop' | 'exhibit' | 'networking' | 'other';
  location?: string;
  speakerIds?: string[];
}

interface EventDay {
  id: string;
  date: string;
  activities: Activity[];
}

interface EventData {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  days: EventDay[];
  speakers: Speaker[];
  sponsors: Sponsor[];
  booths: ExhibitionBooth[];
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize event data state
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    category: 'Technology',
    location: '',
    startDate: '',
    endDate: '',
    days: [],
    speakers: [],
    sponsors: [],
    booths: []
  });

  // State for new speaker form
  const [newSpeaker, setNewSpeaker] = useState<Omit<Speaker, 'id'>>({
    name: '',
    title: '',
    bio: '',
    avatarUrl: ''
  });

  // State for new sponsor form
  const [newSponsor, setNewSponsor] = useState<Omit<Sponsor, 'id'>>({
    name: '',
    level: 'gold',
    website: '',
    description: '',
    logoUrl: ''
  });

  // State for new booth form
  const [newBooth, setNewBooth] = useState<Omit<ExhibitionBooth, 'id'>>({
    name: '',
    company: '',
    description: '',
    location: '',
    coverImageUrl: ''
  });

  // State for selected day when adding activities
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // State for new activity form
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'workshop',
    location: '',
    speakerIds: [],
  });

  // Handler for basic info fields
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
  };

  // Handler for date changes - creates event days
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
    
    // If both start and end dates are selected
    if ((id === 'startDate' && eventData.endDate) || (id === 'endDate' && eventData.startDate)) {
      const start = id === 'startDate' ? new Date(value) : new Date(eventData.startDate);
      const end = id === 'endDate' ? new Date(value) : new Date(eventData.endDate);
      
      // Check if start date is after end date
      if (start > end) {
        alert("Start date cannot be after end date");
        return;
      }
      
      // Create list of days
      const days: EventDay[] = [];
      const currentDate = new Date(start);
      
      let dayCount = 0;
      while (currentDate <= end) {
        days.push({
          id: `day-${dayCount}`,
          date: currentDate.toISOString().split('T')[0],
          activities: [],
        });
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }
      
      setEventData(prev => ({ ...prev, days }));
      if (days.length > 0 && !selectedDayId) {
        setSelectedDayId(days[0].id);
      }
    }
  };

  // Handle image uploads 
  const handleImageUpload = (entityType: 'speaker' | 'sponsor' | 'booth', field: string, value: string) => {
    // In a real app, we would upload the file to a server and get a URL
    // For this example, we'll use placeholder URLs
    const placeholders = [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1501286353178-1ec881214838",
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
    ];
    
    // Select a random placeholder
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    
    switch (entityType) {
      case 'speaker':
        setNewSpeaker(prev => ({ ...prev, avatarUrl: randomPlaceholder }));
        break;
      case 'sponsor':
        setNewSponsor(prev => ({ ...prev, logoUrl: randomPlaceholder }));
        break;
      case 'booth':
        setNewBooth(prev => ({ ...prev, coverImageUrl: randomPlaceholder }));
        break;
    }
  };

  // Handler to add speaker
  const handleAddSpeaker = () => {
    if (!newSpeaker.name.trim() || !newSpeaker.title.trim()) {
      return;
    }

    const newSpeakerWithId: Speaker = {
      ...newSpeaker,
      id: `speaker-${Date.now()}`,
      avatarUrl: newSpeaker.avatarUrl || "/placeholder.svg"
    };

    setEventData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeakerWithId],
    }));

    setNewSpeaker({
      name: '',
      title: '',
      bio: '',
      avatarUrl: ''
    });
  };

  // Handler to add sponsor
  const handleAddSponsor = () => {
    if (!newSponsor.name.trim()) {
      return;
    }

    const newSponsorWithId: Sponsor = {
      ...newSponsor,
      id: `sponsor-${Date.now()}`,
      logoUrl: newSponsor.logoUrl || "/placeholder.svg"
    };

    setEventData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, newSponsorWithId],
    }));

    setNewSponsor({
      name: '',
      level: 'gold',
      website: '',
      description: '',
      logoUrl: ''
    });
  };

  // Handler to add booth
  const handleAddBooth = () => {
    if (!newBooth.name.trim() || !newBooth.company.trim()) {
      return;
    }

    const newBoothWithId: ExhibitionBooth = {
      ...newBooth,
      id: `booth-${Date.now()}`,
      coverImageUrl: newBooth.coverImageUrl || "/placeholder.svg"
    };

    setEventData(prev => ({
      ...prev,
      booths: [...prev.booths, newBoothWithId],
    }));

    setNewBooth({
      name: '',
      company: '',
      description: '',
      location: '',
      coverImageUrl: ''
    });
  };

  // Handler to remove speaker
  const handleRemoveSpeaker = (speakerId: string) => {
    setEventData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker.id !== speakerId),
      // Also remove speaker from any activities
      days: prev.days.map(day => ({
        ...day,
        activities: day.activities.map(activity => ({
          ...activity,
          speakerIds: activity.speakerIds?.filter(id => id !== speakerId) || [],
        })),
      })),
    }));
  };

  // Handler to remove sponsor
  const handleRemoveSponsor = (sponsorId: string) => {
    setEventData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
    }));
  };
  
  // Handler to remove booth
  const handleRemoveBooth = (boothId: string) => {
    setEventData(prev => ({
      ...prev,
      booths: prev.booths.filter(booth => booth.id !== boothId)
    }));
  };

  // Handler to add activity
  const handleAddActivity = () => {
    if (!selectedDayId || !newActivity.title.trim() || !newActivity.startTime || !newActivity.endTime) {
      return;
    }

    const newActivityWithId: Activity = {
      ...newActivity,
      id: `activity-${Date.now()}`,
    };

    setEventData(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === selectedDayId) {
          return {
            ...day,
            activities: [...day.activities, newActivityWithId],
          };
        }
        return day;
      }),
    }));

    setNewActivity({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      type: 'workshop',
      location: '',
      speakerIds: [],
    });
  };

  // Handler to remove activity
  const handleRemoveActivity = (dayId: string, activityId: string) => {
    setEventData(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId),
          };
        }
        return day;
      }),
    }));
  };

  // Handler for speaker selection in activity
  const handleActivitySpeakerChange = (selected: string[]) => {
    setNewActivity(prev => ({
      ...prev,
      speakerIds: selected,
    }));
  };

  // Handler for activity field changes
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for required fields
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      alert("Please fill in all required event information.");
      return;
    }
    
    // In a real app, we would send data to server
    console.log("Submitted event data:", eventData);
    alert("Event successfully created!");
    navigate('/organizer/dashboard');
  };

  // Helper to get selected day
  const getSelectedDay = () => {
    return eventData.days.find(day => day.id === selectedDayId);
  };

  // Helper to format time
  const formatTime = (time: string) => {
    return time;
  };

  // Helper to sort activities by start time
  const sortActivitiesByTime = (activities: Activity[]) => {
    return [...activities].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  // Fix for TypeScript errors - safely handle tab clicks
  const navigateToTab = (tabValue: string) => {
    const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement | null;
    if (tabElement && 'click' in tabElement) {
      tabElement.click();
    }
  };

  // Get sponsor level badge color
  const getSponsorLevelColor = (level: Sponsor['level']) => {
    switch (level) {
      case 'platinum': return 'bg-slate-300 hover:bg-slate-300';
      case 'gold': return 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900';
      case 'silver': return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
      case 'bronze': return 'bg-amber-700 hover:bg-amber-800 text-white';
      default: return '';
    }
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="booths">Exhibition</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Name</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter event name" 
                      value={eventData.title} 
                      onChange={handleBasicInfoChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your event..." 
                      rows={5}
                      value={eventData.description}
                      onChange={handleBasicInfoChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select 
                        id="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={eventData.category}
                        onChange={handleBasicInfoChange}
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
                      <Input 
                        id="location" 
                        placeholder="Event venue or Online" 
                        value={eventData.location} 
                        onChange={handleBasicInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={eventData.startDate} 
                        onChange={handleDateChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={eventData.endDate} 
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => navigateToTab("schedule")}>
                      Save & Continue
                    </Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="schedule">
              <CardContent className="py-6">
                {eventData.days.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Set Up Event Schedule</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Please select start and end dates in the Basic Info tab first
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigateToTab("basic")}
                    >
                      Back to Basic Info
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Speakers list */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Speakers</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {eventData.speakers.map(speaker => (
                          <Card key={speaker.id} className="relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6 text-destructive" 
                              onClick={() => handleRemoveSpeaker(speaker.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <CardContent className="pt-6 flex items-start gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                <AvatarFallback>{speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{speaker.name}</p>
                                <p className="text-sm text-muted-foreground">{speaker.title}</p>
                                {speaker.bio && <p className="text-sm mt-2">{speaker.bio}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Add new speaker form */}
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-md">Add New Speaker</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Avatar className="h-20 w-20">
                                {newSpeaker.avatarUrl ? (
                                  <AvatarImage src={newSpeaker.avatarUrl} alt="Speaker avatar" />
                                ) : (
                                  <AvatarFallback>
                                    <Users className="h-8 w-8" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleImageUpload('speaker', 'avatarUrl', 'some-url')}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Photo
                              </Button>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label htmlFor="speakerName">Name</Label>
                                  <Input 
                                    id="speakerName" 
                                    value={newSpeaker.name} 
                                    onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))} 
                                    placeholder="Speaker name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="speakerTitle">Title</Label>
                                  <Input 
                                    id="speakerTitle" 
                                    value={newSpeaker.title} 
                                    onChange={(e) => setNewSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Job title/Company"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="speakerBio">Bio</Label>
                                <Textarea 
                                  id="speakerBio" 
                                  value={newSpeaker.bio} 
                                  onChange={(e) => setNewSpeaker(prev => ({ ...prev, bio: e.target.value }))}
                                  placeholder="Speaker bio information"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                          <Button onClick={handleAddSpeaker} className="flex items-center gap-2">
                            <Plus size={16} /> Add Speaker
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Separator className="my-8" />
                    </div>
                    
                    {/* Event schedule by day */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Event Schedule</h3>
                      
                      {/* Day tabs */}
                      <Tabs 
                        value={selectedDayId || undefined} 
                        onValueChange={(value) => setSelectedDayId(value)} 
                        className="mb-6"
                      >
                        <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
                          {eventData.days.map(day => (
                            <TabsTrigger key={day.id} value={day.id} className="whitespace-nowrap">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {eventData.days.map(day => (
                          <TabsContent key={day.id} value={day.id}>
                            {/* Display day's activities */}
                            {day.activities.length > 0 ? (
                              <div className="space-y-4">
                                {sortActivitiesByTime(day.activities).map(activity => (
                                  <Card key={activity.id} className="relative group">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100" 
                                      onClick={() => handleRemoveActivity(day.id, activity.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <CardContent className="pt-6 pb-4">
                                      <div className="flex items-start gap-4">
                                        <div className="bg-slate-100 text-slate-700 p-2 rounded text-center min-w-[80px]">
                                          <p className="text-sm font-medium">{formatTime(activity.startTime)}</p>
                                          <p className="text-xs text-muted-foreground">to</p>
                                          <p className="text-sm font-medium">{formatTime(activity.endTime)}</p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{activity.title}</h4>
                                            <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                                          </div>
                                          {activity.location && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                              Location: {activity.location}
                                            </p>
                                          )}
                                          {activity.description && (
                                            <p className="text-sm mt-2">{activity.description}</p>
                                          )}
                                          {activity.speakerIds && activity.speakerIds.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                              <p className="text-sm font-medium">Speakers:</p>
                                              <div className="flex flex-wrap gap-1">
                                                {activity.speakerIds.map(speakerId => {
                                                  const speaker = eventData.speakers.find(s => s.id === speakerId);
                                                  return speaker ? (
                                                    <div key={speakerId} className="flex items-center gap-1">
                                                      <Avatar className="h-6 w-6">
                                                        <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                                        <AvatarFallback>{speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                      </Avatar>
                                                      <Badge variant="secondary" className="mr-1 mb-1">
                                                        {speaker.name}
                                                      </Badge>
                                                    </div>
                                                  ) : null;
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                                <List className="mx-auto h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                  No activities for this day yet
                                </p>
                              </div>
                            )}
                            
                            {/* Form to add new activity */}
                            <Card className="mt-6">
                              <CardHeader>
                                <CardTitle className="text-md">Add New Activity</CardTitle>
                                <CardDescription>
                                  Add workshops, presentations, or networking sessions
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="activityTitle">Activity Name</Label>
                                    <Input 
                                      id="activityTitle" 
                                      name="title"
                                      value={newActivity.title} 
                                      onChange={handleActivityChange} 
                                      placeholder="Activity name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="activityType">Type</Label>
                                    <select 
                                      id="activityType" 
                                      name="type"
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                      value={newActivity.type}
                                      onChange={handleActivityChange}
                                    >
                                      <option value="workshop">Workshop</option>
                                      <option value="meeting">Meeting</option>
                                      <option value="exhibit">Exhibition</option>
                                      <option value="networking">Networking</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="activityStartTime">Start Time</Label>
                                    <Input 
                                      id="activityStartTime" 
                                      name="startTime"
                                      type="time" 
                                      value={newActivity.startTime} 
                                      onChange={handleActivityChange} 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="activityEndTime">End Time</Label>
                                    <Input 
                                      id="activityEndTime" 
                                      name="endTime"
                                      type="time" 
                                      value={newActivity.endTime} 
                                      onChange={handleActivityChange} 
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <Label htmlFor="activityLocation">Location</Label>
                                  <Input 
                                    id="activityLocation" 
                                    name="location"
                                    value={newActivity.location} 
                                    onChange={handleActivityChange}
                                    placeholder="Activity location"
                                  />
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <Label htmlFor="activityDescription">Description</Label>
                                  <Textarea 
                                    id="activityDescription" 
                                    name="description"
                                    value={newActivity.description} 
                                    onChange={handleActivityChange}
                                    placeholder="Activity description"
                                    rows={3}
                                  />
                                </div>
                                
                                {eventData.speakers.length > 0 && (
                                  <div className="space-y-2">
                                    <Label>Speakers</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {eventData.speakers.map(speaker => (
                                        <Badge 
                                          variant={newActivity.speakerIds?.includes(speaker.id) ? "default" : "outline"} 
                                          key={speaker.id} 
                                          className="cursor-pointer flex items-center gap-1"
                                          onClick={() => {
                                            const isSelected = newActivity.speakerIds?.includes(speaker.id);
                                            const updated = isSelected 
                                              ? newActivity.speakerIds?.filter(id => id !== speaker.id) 
                                              : [...(newActivity.speakerIds || []), speaker.id];
                                            handleActivitySpeakerChange(updated);
                                          }}
                                        >
                                          <Avatar className="h-4 w-4 mr-1">
                                            <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                            <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                                          </Avatar>
                                          {speaker.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-end border-t pt-4">
                                <Button onClick={handleAddActivity} className="flex items-center gap-2">
                                  <Plus size={16} /> Add Activity
                                </Button>
                              </CardFooter>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    {/* Overall agenda view */}
                    <Separator className="my-8" />
                    <div>
                      <h3 className="text-lg font-medium mb-4">Overall Agenda</h3>
                      
                      {eventData.days.map(day => (
                        <div key={day.id} className="mb-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-100 rounded-full p-2">
                              <Calendar className="h-5 w-5 text-purple-700" />
                            </div>
                            <h4 className="font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h4>
                          </div>
                          
                          {day.activities.length > 0 ? (
                            <div className="pl-12 border-l border-gray-200 ml-5 space-y-4">
                              {sortActivitiesByTime(day.activities).map(activity => (
                                <div key={activity.id} className="relative">
                                  <div className="absolute -left-[42px] bg-white p-1 rounded border border-gray-200">
                                    <Clock className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="flex gap-3 items-start">
                                    <div className="bg-slate-50 py-1 px-2 rounded text-xs font-medium text-slate-600 whitespace-nowrap">
                                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium">{activity.title}</p>
                                        <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                                      </div>
                                      {activity.location && (
                                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                                      )}
                                      {activity.speakerIds && activity.speakerIds.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {activity.speakerIds.map(speakerId => {
                                            const speaker = eventData.speakers.find(s => s.id === speakerId);
                                            return speaker ? (
                                              <div key={speakerId} className="flex items-center">
                                                <Avatar className="h-4 w-4 mr-1">
                                                  <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                                  <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <Badge key={speakerId} variant="secondary" className="text-xs">
                                                  {speaker.name}
                                                </Badge>
                                              </div>
                                            ) : null;
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground ml-12">
                              No activities scheduled for this day
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="sponsors">
              <CardContent className="py-6">
                <div className="space-y-8">
                  <h3 className="text-lg font-medium mb-4">Sponsors</h3>
                  
                  {/* Display sponsors by level */}
                  <div className="space-y-6">
                    {['platinum', 'gold', 'silver', 'bronze'].map(level => {
                      const levelSponsors = eventData.sponsors.filter(sponsor => sponsor.level === level);
                      return levelSponsors.length > 0 ? (
                        <div key={level} className="space-y-4">
                          <h4 className="font-medium capitalize">{level} Sponsors</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {levelSponsors.map(sponsor => (
                              <Card key={sponsor.id} className="relative">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-2 right-2 h-6 w-6 text-destructive" 
                                  onClick={() => handleRemoveSponsor(sponsor.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardContent className="pt-6">
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-full h-32 relative mb-4 rounded-md overflow-hidden">
                                      <AspectRatio ratio={16 / 9} className="bg-muted">
                                        <img 
                                          src={sponsor.logoUrl} 
                                          alt={sponsor.name} 
                                          className="object-contain w-full h-full"
                                        />
                                      </AspectRatio>
                                    </div>
                                    <Badge className={cn("mb-2", getSponsorLevelColor(sponsor.level))}>
                                      {level.toUpperCase()}
                                    </Badge>
                                    <p className="font-semibold">{sponsor.name}</p>
                                    {sponsor.website && (
                                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" 
                                        className="text-sm text-blue-600 hover:underline">
                                        {sponsor.website}
                                      </a>
                                    )}
                                    {sponsor.description && <p className="text-sm mt-2">{sponsor.description}</p>}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  {eventData.sponsors.length === 0 && (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                      <Award className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No sponsors added yet
                      </p>
                    </div>
                  )}
                  
                  {/* Add new sponsor form */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-md">Add New Sponsor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                            {newSponsor.logoUrl ? (
                              <img 
                                src={newSponsor.logoUrl} 
                                alt="Sponsor logo preview" 
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <Image className="h-8 w-8 text-slate-400" />
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleImageUpload('sponsor', 'logoUrl', 'some-url')}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="sponsorName">Organization Name</Label>
                              <Input 
                                id="sponsorName" 
                                value={newSponsor.name} 
                                onChange={(e) => setNewSponsor(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Sponsor name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sponsorLevel">Sponsorship Level</Label>
                              <select 
                                id="sponsorLevel" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                value={newSponsor.level}
                                onChange={(e) => setNewSponsor(prev => ({ ...prev, level: e.target.value as 'platinum' | 'gold' | 'silver' | 'bronze' }))}
                              >
                                <option value="platinum">Platinum</option>
                                <option value="gold">Gold</option>
                                <option value="silver">Silver</option>
                                <option value="bronze">Bronze</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor="sponsorWebsite">Website</Label>
                            <Input 
                              id="sponsorWebsite" 
                              value={newSponsor.website} 
                              onChange={(e) => setNewSponsor(prev => ({ ...prev, website: e.target.value }))} 
                              placeholder="https://example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sponsorDescription">Description</Label>
                            <Textarea 
                              id="sponsorDescription" 
                              value={newSponsor.description} 
                              onChange={(e) => setNewSponsor(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="About the sponsor"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                      <Button onClick={handleAddSponsor} className="flex items-center gap-2">
                        <Plus size={16} /> Add Sponsor
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="booths">
              <CardContent className="py-6">
                <div className="space-y-8">
                  <h3 className="text-lg font-medium mb-4">Exhibition Booths</h3>
                  
                  {/* Display exhibition booths */}
                  {eventData.booths.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {eventData.booths.map(booth => (
                        <Card key={booth.id} className="relative overflow-hidden">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 text-destructive z-10 bg-white/80 hover:bg-white" 
                            onClick={() => handleRemoveBooth(booth.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="w-full h-36 relative">
                            <img 
                              src={booth.coverImageUrl || "/placeholder.svg"} 
                              alt={booth.name} 
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <h4 className="font-semibold">{booth.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{booth.company}</p>
                            {booth.location && (
                              <p className="text-xs flex items-center gap-1 mb-2">
                                <Building className="h-3 w-3" /> {booth.location}
                              </p>
                            )}
                            {booth.description && <p className="text-sm">{booth.description}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                      <Building className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No exhibition booths added yet
                      </p>
                    </div>
                  )}
                  
                  {/* Add new booth form */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-md">Add Exhibition Booth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                            {newBooth.coverImageUrl ? (
                              <img 
                                src={newBooth.coverImageUrl} 
                                alt="Booth cover preview" 
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Image className="h-8 w-8 text-slate-400" />
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleImageUpload('booth', 'coverImageUrl', 'some-url')}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Cover
                          </Button>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="boothName">Booth Name</Label>
                              <Input 
                                id="boothName" 
                                value={newBooth.name} 
                                onChange={(e) => setNewBooth(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Booth name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="boothCompany">Company</Label>
                              <Input 
                                id="boothCompany" 
                                value={newBooth.company} 
                                onChange={(e) => setNewBooth(prev => ({ ...prev, company: e.target.value }))} 
                                placeholder="Company name"
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor="boothLocation">Location</Label>
                            <Input 
                              id="boothLocation" 
                              value={newBooth.location} 
                              onChange={(e) => setNewBooth(prev => ({ ...prev, location: e.target.value }))} 
                              placeholder="Booth location (e.g., Hall A, Booth #123)"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="boothDescription">Description</Label>
                            <Textarea 
                              id="boothDescription" 
                              value={newBooth.description} 
                              onChange={(e) => setNewBooth(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Booth description"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                      <Button onClick={handleAddBooth} className="flex items-center gap-2">
                        <Plus size={16} /> Add Booth
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="media">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Event Media</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload banners, logos, and promotional materials
                  </p>
                  <Button className="mt-4">Upload Images</Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
          <CardFooter className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Event
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tips for a Successful Event</CardTitle>
            <CardDescription>
              Follow these guidelines to maximize attendance and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use a clear title and provide detailed information</li>
              <li>Add high-quality images to represent your event</li>
              <li>Provide detailed information about speakers and workshops</li>
              <li>Create different ticket types to attract various attendees</li>
              <li>Promote the event on social media and related platforms</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateEvent;
