'use client';

import { useEffect, useState } from 'react';
import AssignmentCard from './assignmentcard';
import { Assignment } from '@/types/assignment';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const studentId = 2; // TODO: Get from auth session
        const response = await fetch(`http://localhost:5000/api/assignments/student/${studentId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Raw API response:', data);
          setAssignments(data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to fetch assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error(error instanceof Error ? error.message : 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getAssignmentStatus = (assignment: Assignment) => {
    if (assignment.submission?.grade) return 'Graded';
    if (assignment.submission) return 'Submitted';
    if (new Date(assignment.due_date) < new Date() && !assignment.allow_late_submission) return 'Overdue';
    return 'Pending';
  };

  // Sort assignments: overdue first, then pending, then submitted, then graded
  const sortedAssignments = [...assignments].sort((a, b) => {
    const statusOrder = { Overdue: 0, Pending: 1, Submitted: 2, Graded: 3 };
    return statusOrder[getAssignmentStatus(a)] - statusOrder[getAssignmentStatus(b)];
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedAssignments.map((assignment) => (
        <AssignmentCard 
          key={assignment.id} 
          assignment={{
            ...assignment,
            status: getAssignmentStatus(assignment)
          }} 
        />
      ))}
      {!loading && sortedAssignments.length === 0 && (
        <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
          No assignments found
        </div>
      )}
    </div>
  );
}