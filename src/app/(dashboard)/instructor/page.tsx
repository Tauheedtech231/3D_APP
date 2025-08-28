"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  Upload
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CourseStats {
  totalStudents: number;
  activeAssignments: number;
  pendingGrades: number;
  averageProgress: number;
}

export default function InstructorDashboard() {
  const [courseStats, setCourseStats] = useState<CourseStats>({
    totalStudents: 0,
    activeAssignments: 0,
    pendingGrades: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock instructor ID - in real app, get from auth context
  const instructorId = '1';

  // Fetch instructor data
  const fetchInstructorData = async () => {
    try {
      // Calculate course statistics
      const stats: CourseStats = {
        totalStudents: 0,
        activeAssignments: 0,
        pendingGrades: 0,
        averageProgress: 0
      };
      setCourseStats(stats);

   

    } catch (error) {
      console.error('Error fetching instructor data:', error);
      toast.error('Failed to load dashboard data');
      
      setCourseStats({
        totalStudents: 0,
        activeAssignments: 0,
        pendingGrades: 0,
        averageProgress: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, [instructorId]);

  // // Handle assignment grading
  // const handleGradeAssignment = async (submissionId: string, grade: number, feedback: string) => {
  //   try {
  //     const response = await fetch(`/api/assignments/submissions/${submissionId}/grade`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ grade, feedback, instructor_id: instructorId }),
  //     });

  //     if (response.ok) {
  //       toast.success('Assignment graded successfully');
  //       fetchInstructorData(); // Refresh data
  //     } else {
  //       toast.error('Failed to grade assignment');
  //     }
  //   } catch (error) {
  //     console.error('Error grading assignment:', error);
  //     toast.error('Failed to grade assignment');
  //   }
  // };



  // const getActivityIcon = (type: string) => {
  //   switch (type) {
  //     case 'submission':
  //       return <FileText className="h-4 w-4 text-blue-500" />;
  //     case 'quiz_attempt':
  //       return <CheckCircle className="h-4 w-4 text-green-500" />;
  //     case 'enrollment':
  //       return <Users className="h-4 w-4 text-purple-500" />;
  //     default:
  //       return <AlertCircle className="h-4 w-4 text-gray-500" />;
  //   }
  // };

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
       </div>
     );
   }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, students, and assignments</p>
        </div>
        <div className="flex gap-2">
         
          <Button asChild variant="outline">
            <Link href="/instructor/courses/create">
              <BookOpen className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats.activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting submissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats.pendingGrades}</div>
            <p className="text-xs text-muted-foreground">
              Submissions awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(courseStats.averageProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              Student completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
         
          
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.studentName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.details}
                        </p>
                        <p className="text-xs text-gray-400">
                          {activity.courseName} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common instructor tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/instructor/assignments">
                      <FileText className="h-4 w-4 mr-2" />
                      Grade Assignments
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/instructor/students">
                      <Users className="h-4 w-4 mr-2" />
                      View Student Progress
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/instructor/courses">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Course Materials
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/instructor/analytics">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

     


        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <Button asChild>
              <Link href="/instructor/quizzes/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </div>
    
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Course Materials</h2>
            <Button asChild>
              <Link href="/instructor/materials/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Material Management</CardTitle>
              <CardDescription>Upload and organize course content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Course Materials</h3>
                <p className="text-muted-foreground mb-4">
                  Support for videos (100-200MB), documents (50MB+), and presentations
                </p>
                <Button asChild>
                  <Link href="/instructor/materials/upload">
                    Choose Files
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

