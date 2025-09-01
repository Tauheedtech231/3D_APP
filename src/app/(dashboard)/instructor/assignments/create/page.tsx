'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  modules: Module[];
}

interface Module {
  id: number;
  title: string;
}

const CreateAssignment: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    maxPoints: '',
    allowLateSubmission: false,
    latePenalty: '',
    submissionFormat: 'file' // 'file', 'text', 'both'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://31.97.49.20/api/courses');
      if (response.ok) {
        const coursesData = await response.json();
        console.log("the data c",coursesData)
        setCourses(coursesData);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Validate required fields
      if (!formData.title || !formData.instructions || !selectedCourse || !selectedModule || !formData.maxPoints) {
        throw new Error('Please fill in all required fields');
      }
  
      // Validate due date
      if (!dueDate || !(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
        throw new Error('Please select a valid due date');
      }
  
      // Ensure the date is in the future
      const now = new Date();
      if (dueDate < now) {
        throw new Error('Due date must be in the future');
      }
  
      // Validate numeric fields
      const maxPoints = parseInt(formData.maxPoints);
      if (isNaN(maxPoints) || maxPoints <= 0) {
        throw new Error('Maximum points must be a positive number');
      }
  
      const latePenalty = formData.latePenalty ? parseInt(formData.latePenalty) : 0;
      if (isNaN(latePenalty) || latePenalty < 0 || latePenalty > 100) {
        throw new Error('Late penalty must be between 0 and 100');
      }
  
      const assignmentData = {
        ...formData,
        courseId: parseInt(selectedCourse),
        moduleId: parseInt(selectedModule),
        dueDate: dueDate.toISOString(), // Already set to end of day (23:59:59)
        maxPoints,
        latePenalty,
        instructorId: 1 // Replace with actual instructor ID from auth
      };
  
      console.log('Submitting assignment data:', assignmentData); // Debug log
  
      const response = await fetch('http://31.97.49.20/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Assignment created successfully:', result);
      router.push('/instructor/assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.find(course => course.id.toString() === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/instructor">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
          <p className="text-muted-foreground">Create a new assignment for your students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Assignment details and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the assignment"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions *</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Detailed instructions for students"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Course and Module Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Course Assignment</CardTitle>
              <CardDescription>Select course and module for this assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Course *</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {`${course.id} - ${course.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Module *</Label>
                <Select 
                  value={selectedModule} 
                  onValueChange={setSelectedModule} 
                  disabled={!selectedCourse}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourseData?.modules.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {`${module.id} - ${module.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
<div className="space-y-2">
  <Label>Due Date *</Label>
  <div className="flex gap-2">
    <div className="flex-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${!dueDate ? 'text-muted-foreground' : ''}`}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate
              ? format(dueDate, 'PPP')
              : format(new Date(new Date().setDate(new Date().getDate() + 2)), 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate || new Date(new Date().setDate(new Date().getDate() + 2))}
            onSelect={(date) => {
              if (date) {
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                setDueDate(endOfDay);
              }
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d < today; // disable past dates
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
    <div className="w-32">
      <Input
        type="number"
        min="1"
        placeholder="Days from today"
        onChange={(e) => {
          const days = parseInt(e.target.value);
          if (!isNaN(days) && days > 0) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + days);
            futureDate.setHours(23, 59, 59, 999);
            setDueDate(futureDate);
          }
        }}
      />
    </div>
  </div>
</div>


            </CardContent>
          </Card>
        </div>

        {/* Grading and Submission Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Grading & Submission Settings</CardTitle>
            <CardDescription>Configure how students will submit and how you ll grade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxPoints">Maximum Points *</Label>
                <Input
                  id="maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => handleInputChange('maxPoints', e.target.value)}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Submission Format</Label>
                <Select 
                  value={formData.submissionFormat} 
                  onValueChange={(value) => handleInputChange('submissionFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload Only</SelectItem>
                    <SelectItem value="text">Text Submission Only</SelectItem>
                    <SelectItem value="both">Both File and Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="latePenalty">Late Penalty (%)</Label>
                <Input
                  id="latePenalty"
                  type="number"
                  value={formData.latePenalty}
                  onChange={(e) => handleInputChange('latePenalty', e.target.value)}
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowLateSubmission"
                  checked={formData.allowLateSubmission}
                  onChange={(e) => handleInputChange('allowLateSubmission', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="allowLateSubmission">Allow late submissions</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/instructor">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Assignment'}
            <FileText className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;