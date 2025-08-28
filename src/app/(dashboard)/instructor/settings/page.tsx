"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, BookOpen, Shield, Upload } from "lucide-react";

export default function InstructorSettings() {
  // Profile state
  const [profile, setProfile] = useState({
    name: "Muhammad Ali",
    email: "m.ali@example.com",
    phone: "+92 300 1234567",
    bio: "Experienced web developer and instructor with over 8 years of experience in teaching HTML, CSS, JavaScript, and modern web frameworks. Passionate about helping students build real-world projects and develop practical skills.",
    title: "Senior Web Development Instructor",
    expertise: ["HTML & CSS", "JavaScript", "React", "Node.js", "Database Design"],
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    studentSubmissions: true,
    courseEnrollments: true,
    feedbackReceived: true,
    systemUpdates: false,
    marketingEmails: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfileToStudents: true,
    showContactInfo: false,
    showSocialLinks: true,
    allowStudentMessages: true
  });

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to the backend
    alert("Profile updated successfully!");
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full overflow-hidden">
                        <Image 
                          src={profile.avatar} 
                          alt="Profile" 
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="absolute bottom-0 right-0 rounded-full p-2"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload new image</p>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input 
                            id="name" 
                            placeholder="Your full name" 
                            className="pl-8"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <div className="relative">
                          <BookOpen className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input 
                            id="title" 
                            placeholder="Your job title" 
                            className="pl-8"
                            value={profile.title}
                            onChange={(e) => setProfile({...profile, title: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Your email address" 
                            className="pl-8"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input 
                            id="phone" 
                            placeholder="Your phone number" 
                            className="pl-8"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell students about yourself and your expertise" 
                        className="min-h-[100px]"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">This will be displayed on your public profile</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button 
                          type="button"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          onClick={() => {
                            const newExpertise = [...profile.expertise];
                            newExpertise.splice(index, 1);
                            setProfile({...profile, expertise: newExpertise});
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <Input 
                      placeholder="Add a skill"
                      className="w-32 h-8"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          setProfile({
                            ...profile, 
                            expertise: [...profile.expertise, e.currentTarget.value.trim()]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter your current password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Student Submissions</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when students submit assignments</p>
                  </div>
                  <Switch 
                    checked={notifications.studentSubmissions}
                    onCheckedChange={() => handleNotificationToggle('studentSubmissions')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Course Enrollments</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when students enroll in your courses</p>
                  </div>
                  <Switch 
                    checked={notifications.courseEnrollments}
                    onCheckedChange={() => handleNotificationToggle('courseEnrollments')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Feedback Received</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive feedback from students</p>
                  </div>
                  <Switch 
                    checked={notifications.feedbackReceived}
                    onCheckedChange={() => handleNotificationToggle('feedbackReceived')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Updates</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about system updates and maintenance</p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional emails and offers</p>
                  </div>
                  <Switch 
                    checked={notifications.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Notification Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="notification-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and visibility preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Profile to Students</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to enrolled students</p>
                  </div>
                  <Switch 
                    checked={privacy.showProfileToStudents}
                    onCheckedChange={() => handlePrivacyToggle('showProfileToStudents')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Contact Information</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display your email and phone number on your profile</p>
                  </div>
                  <Switch 
                    checked={privacy.showContactInfo}
                    onCheckedChange={() => handlePrivacyToggle('showContactInfo')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Social Media Links</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display your social media profiles on your public profile</p>
                  </div>
                  <Switch 
                    checked={privacy.showSocialLinks}
                    onCheckedChange={() => handlePrivacyToggle('showSocialLinks')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Student Messages</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Let students send you direct messages</p>
                  </div>
                  <Switch 
                    checked={privacy.allowStudentMessages}
                    onCheckedChange={() => handlePrivacyToggle('allowStudentMessages')}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <Label className="text-base">Data and Privacy</Label>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Download Your Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                      <Shield className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Privacy Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}