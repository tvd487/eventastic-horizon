import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Settings, Image, Plus, Trash2, Clock, List } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Định nghĩa các kiểu dữ liệu
interface Speaker {
  id: string;
  name: string;
  title: string;
  bio?: string;
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
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  
  // Khởi tạo state cho event data
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    category: 'Technology',
    location: '',
    startDate: '',
    endDate: '',
    days: [],
    speakers: [],
  });

  // State for new speaker form
  const [newSpeaker, setNewSpeaker] = useState<Omit<Speaker, 'id'>>({
    name: '',
    title: '',
    bio: '',
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

  // Handler cho các input field cơ bản
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
  };

  // Handler cho việc thêm ngày mới khi thay đổi ngày bắt đầu/kết thúc
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
    
    // Nếu cả ngày bắt đầu và kết thúc đã được chọn
    if ((id === 'startDate' && eventData.endDate) || (id === 'endDate' && eventData.startDate)) {
      const start = id === 'startDate' ? new Date(value) : new Date(eventData.startDate);
      const end = id === 'endDate' ? new Date(value) : new Date(eventData.endDate);
      
      // Kiểm tra nếu ngày bắt đầu sau ngày kết thúc
      if (start > end) {
        alert("Ngày bắt đầu không thể sau ngày kết thúc");
        return;
      }
      
      // Tạo danh sách các ngày
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

  // Handler thêm speaker mới
  const handleAddSpeaker = () => {
    if (!newSpeaker.name.trim() || !newSpeaker.title.trim()) {
      return;
    }

    const newSpeakerWithId: Speaker = {
      ...newSpeaker,
      id: `speaker-${Date.now()}`,
    };

    setEventData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeakerWithId],
    }));

    setNewSpeaker({
      name: '',
      title: '',
      bio: '',
    });
  };

  // Handler xóa speaker
  const handleRemoveSpeaker = (speakerId: string) => {
    setEventData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker.id !== speakerId),
      // Cũng cần xóa speaker khỏi các activity đang sử dụng
      days: prev.days.map(day => ({
        ...day,
        activities: day.activities.map(activity => ({
          ...activity,
          speakerIds: activity.speakerIds?.filter(id => id !== speakerId),
        })),
      })),
    }));
  };

  // Handler thêm activity mới vào ngày đã chọn
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

  // Handler xóa activity
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

  // Handler chọn speaker cho activity
  const handleActivitySpeakerChange = (selected: string[]) => {
    setNewActivity(prev => ({
      ...prev,
      speakerIds: selected,
    }));
  };

  // Handler thay đổi các field của activity
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler cho việc submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra xem có đủ thông tin cần thiết không
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      alert("Vui lòng điền đầy đủ các thông tin cơ bản của sự kiện.");
      return;
    }
    
    // Trong thực tế sẽ gửi dữ liệu lên server
    console.log("Submitted event data:", eventData);
    alert("Sự kiện đã được tạo thành công!");
    navigate('/organizer/dashboard');
  };

  // Helper function to get event day by id
  const getSelectedDay = () => {
    return eventData.days.find(day => day.id === selectedDayId);
  };

  // Helper function to format time from HH:MM to display format
  const formatTime = (time: string) => {
    return time;
  };

  // Helper function to sort activities by start time
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tạo Sự Kiện Mới</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/organizer/dashboard')}
          >
            Hủy
          </Button>
        </div>
        
        <Card className="mb-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông Tin Cơ Bản</TabsTrigger>
              <TabsTrigger value="schedule">Lịch Trình</TabsTrigger>
              <TabsTrigger value="tickets">Vé</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tên Sự Kiện</Label>
                    <Input 
                      id="title" 
                      placeholder="Nhập tên sự kiện" 
                      value={eventData.title} 
                      onChange={handleBasicInfoChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô Tả</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Mô tả sự kiện..." 
                      rows={5}
                      value={eventData.description}
                      onChange={handleBasicInfoChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh Mục</Label>
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
                      <Label htmlFor="location">Địa Điểm</Label>
                      <Input 
                        id="location" 
                        placeholder="Địa điểm sự kiện hoặc Online" 
                        value={eventData.location} 
                        onChange={handleBasicInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={eventData.startDate} 
                        onChange={handleDateChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Ngày Kết Thúc</Label>
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
                      Lưu & Tiếp Tục
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
                    <h3 className="mt-4 text-lg font-medium">Thiết Lập Lịch Trình Sự Kiện</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Hãy chọn ngày bắt đầu và kết thúc trong thông tin cơ bản trước
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigateToTab("basic")}
                    >
                      Quay Lại Thông Tin Cơ Bản
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Danh sách speakers */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Diễn Giả</h3>
                      
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
                            <CardContent className="pt-6">
                              <p className="font-semibold">{speaker.name}</p>
                              <p className="text-sm text-muted-foreground">{speaker.title}</p>
                              {speaker.bio && <p className="text-sm mt-2">{speaker.bio}</p>}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Form thêm speaker mới */}
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-md">Thêm Diễn Giả Mới</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="speakerName">Tên</Label>
                              <Input 
                                id="speakerName" 
                                value={newSpeaker.name} 
                                onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Tên diễn giả"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="speakerTitle">Chức Danh</Label>
                              <Input 
                                id="speakerTitle" 
                                value={newSpeaker.title} 
                                onChange={(e) => setNewSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Chức danh/Công ty"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="speakerBio">Giới Thiệu</Label>
                            <Textarea 
                              id="speakerBio" 
                              value={newSpeaker.bio} 
                              onChange={(e) => setNewSpeaker(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Thông tin giới thiệu diễn giả"
                              rows={3}
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                          <Button onClick={handleAddSpeaker} className="flex items-center gap-2">
                            <Plus size={16} /> Thêm Diễn Giả
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Separator className="my-8" />
                    </div>
                    
                    {/* Lịch trình theo ngày */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Lịch Trình Sự Kiện</h3>
                      
                      {/* Tab chọn ngày */}
                      <Tabs 
                        value={selectedDayId || undefined} 
                        onValueChange={(value) => setSelectedDayId(value)} 
                        className="mb-6"
                      >
                        <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
                          {eventData.days.map(day => (
                            <TabsTrigger key={day.id} value={day.id} className="whitespace-nowrap">
                              {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {eventData.days.map(day => (
                          <TabsContent key={day.id} value={day.id}>
                            {/* Hiển thị các hoạt động trong ngày */}
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
                                          <p className="text-xs text-muted-foreground">đến</p>
                                          <p className="text-sm font-medium">{formatTime(activity.endTime)}</p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{activity.title}</h4>
                                            <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                                          </div>
                                          {activity.location && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                              Địa điểm: {activity.location}
                                            </p>
                                          )}
                                          {activity.description && (
                                            <p className="text-sm mt-2">{activity.description}</p>
                                          )}
                                          {activity.speakerIds && activity.speakerIds.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                              <p className="text-sm font-medium">Diễn giả:</p>
                                              <div className="flex flex-wrap gap-1">
                                                {activity.speakerIds.map(speakerId => {
                                                  const speaker = eventData.speakers.find(s => s.id === speakerId);
                                                  return speaker ? (
                                                    <Badge key={speakerId} variant="secondary" className="mr-1 mb-1">
                                                      {speaker.name}
                                                    </Badge>
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
                                  Chưa có hoạt động nào cho ngày này
                                </p>
                              </div>
                            )}
                            
                            {/* Form thêm hoạt động mới */}
                            <Card className="mt-6">
                              <CardHeader>
                                <CardTitle className="text-md">Thêm Hoạt Động Mới</CardTitle>
                                <CardDescription>
                                  Thêm workshop, trình diễn, hoặc các buổi gặp gỡ
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="activityTitle">Tên Hoạt Động</Label>
                                    <Input 
                                      id="activityTitle" 
                                      name="title"
                                      value={newActivity.title} 
                                      onChange={handleActivityChange} 
                                      placeholder="Tên hoạt động"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="activityType">Loại</Label>
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
                                      <option value="other">Khác</option>
                                    </select>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="activityStartTime">Thời Gian Bắt Đầu</Label>
                                    <Input 
                                      id="activityStartTime" 
                                      name="startTime"
                                      type="time" 
                                      value={newActivity.startTime} 
                                      onChange={handleActivityChange} 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="activityEndTime">Thời Gian Kết Thúc</Label>
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
                                  <Label htmlFor="activityLocation">Địa Điểm</Label>
                                  <Input 
                                    id="activityLocation" 
                                    name="location"
                                    value={newActivity.location} 
                                    onChange={handleActivityChange}
                                    placeholder="Vị trí tổ chức hoạt động"
                                  />
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <Label htmlFor="activityDescription">Mô Tả</Label>
                                  <Textarea 
                                    id="activityDescription" 
                                    name="description"
                                    value={newActivity.description} 
                                    onChange={handleActivityChange}
                                    placeholder="Mô tả chi tiết về hoạt động"
                                    rows={3}
                                  />
                                </div>
                                
                                {eventData.speakers.length > 0 && (
                                  <div className="space-y-2">
                                    <Label>Diễn Giả</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {eventData.speakers.map(speaker => (
                                        <Badge 
                                          variant={newActivity.speakerIds?.includes(speaker.id) ? "default" : "outline"} 
                                          key={speaker.id} 
                                          className="cursor-pointer"
                                          onClick={() => {
                                            const isSelected = newActivity.speakerIds?.includes(speaker.id);
                                            const updated = isSelected 
                                              ? newActivity.speakerIds?.filter(id => id !== speaker.id) 
                                              : [...(newActivity.speakerIds || []), speaker.id];
                                            handleActivitySpeakerChange(updated);
                                          }}
                                        >
                                          {speaker.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-end border-t pt-4">
                                <Button onClick={handleAddActivity} className="flex items-center gap-2">
                                  <Plus size={16} /> Thêm Hoạt Động
                                </Button>
                              </CardFooter>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    {/* Hiển thị Agenda tổng quan */}
                    <Separator className="my-8" />
                    <div>
                      <h3 className="text-lg font-medium mb-4">Agenda Tổng Quan</h3>
                      
                      {eventData.days.map(day => (
                        <div key={day.id} className="mb-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-100 rounded-full p-2">
                              <Calendar className="h-5 w-5 text-purple-700" />
                            </div>
                            <h4 className="font-medium">
                              {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                                              <Badge key={speakerId} variant="secondary" className="text-xs">
                                                {speaker.name}
                                              </Badge>
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
                              Chưa có hoạt động nào cho ngày này
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="tickets">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Thiết Lập Vé</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thiết lập các loại vé, giá và số lượng có sẵn
                  </p>
                  <Button className="mt-4">Thêm Loại Vé</Button>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="media">
              <CardContent className="py-6">
                <div className="text-center py-8">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Media Sự Kiện</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tải lên banner, logo và tài liệu quảng bá
                  </p>
                  <Button className="mt-4">Tải Lên Hình Ảnh</Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
          <CardFooter className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              Tạo Sự Kiện
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mẹo Tạo Sự Kiện Thành Công</CardTitle>
            <CardDescription>
              Làm theo các hướng dẫn này để tối đa hóa lượng người tham dự và sự tương tác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sử dụng tiêu đề rõ ràng, mô tả đầy đủ thông tin chính</li>
              <li>Thêm hình ảnh chất lượng cao đại diện cho sự kiện</li>
              <li>Cung cấp thông tin chi tiết về diễn giả và các buổi hội thảo</li>
              <li>Tạo các loại vé khác nhau để thu hút nhiều đối tượng tham dự</li>
              <li>Quảng bá sự kiện trên mạng xã hội và các nền tảng liên quan</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateEvent;
