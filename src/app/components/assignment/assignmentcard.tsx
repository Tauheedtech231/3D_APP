'use client';

import Link from 'next/link';
import { Assignment } from '@/types/assignment';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment & { status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue' };
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const isPending = assignment.status === 'Pending';
  const isSubmitted = assignment.status === 'Submitted';
  const isGraded = assignment.status === 'Graded';
  const isOverdue = assignment.status === 'Overdue';

  const getStatusColor = () => {
    switch (assignment.status) {
      case 'Graded':
        return 'text-green-500 dark:text-green-400';
      case 'Submitted':
        return 'text-blue-500 dark:text-blue-400';
      case 'Overdue':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-yellow-500 dark:text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'Graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'Submitted':
        return <Clock className="h-4 w-4" />;
      case 'Overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {assignment.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <FileText className="h-4 w-4 mr-2" />
              <span>{assignment.courses?.title || `Course ${assignment.course_id}`}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
              {assignment.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                Due {format(new Date(assignment.due_date), 'PPP')}
              </span>
            </div>
            <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs">{assignment.status}</span>
            </div>
          </div>

          <Link 
            href={isPending ? `/student/assignments/${assignment.id}/submit` : `/student/assignments/${assignment.id}`}
            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-all
              ${isOverdue ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900' :
              'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900'}`}
          >
            {isGraded ? "View Feedback" : isSubmitted ? "View Submission" : isOverdue ? "Submit Late" : "Submit Assignment"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
