'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Assignment = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  total_points: number;
  submissionStatus: 'Submitted' | 'Pending';
  submittedAt: string | null;
  grade?: number | null;
};

const AssignmentDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const courseId = 2;
  const studentId = 2;

  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        `http://31.97.49.20/api/assignments/student/course?courseId=${courseId}&studentId=${studentId}`
      );
      const data: Assignment[] = await res.json();

      const enriched = await Promise.all(
        data.map(async (assignment) => {
          if (assignment.submissionStatus === 'Submitted') {
            const gradeRes = await fetch(
              `http://31.97.49.20/api/assignments/student/grade?assignmentId=${assignment.id}&studentId=${studentId}`
            );
            const gradeData = await gradeRes.json();
            return { ...assignment, grade: gradeData.graded ? gradeData.pointsEarned : null };
          }
          return assignment;
        })
      );

      setAssignments(enriched);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] text-blue-600 dark:text-blue-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-sm">Loading assignments...</p>
      </div>
    );

  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter((a) => a.submissionStatus === 'Submitted').length;
  const pendingCount = assignments.filter((a) => a.submissionStatus === 'Pending').length;
  const overdueCount = assignments.filter(
    (a) => new Date(a.due_date) < new Date() && a.submissionStatus === 'Pending'
  ).length;

  const gradedAssignments = assignments.filter((a) => a.grade !== undefined && a.grade !== null);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
        Current Assignments & Submissions
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Track your pending and submitted assignments along with grades
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: totalAssignments, color: 'text-blue-600' },
          { label: 'Submitted', value: submittedCount, color: 'text-blue-600' },
          { label: 'Pending', value: pendingCount, color: 'text-blue-600' },
          { label: 'Overdue', value: overdueCount, color: 'text-red-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-3 bg-white dark:bg-gray-800 rounded-3xl shadow flex flex-col items-center`}
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color} dark:${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {assignments.map((assignment) => {
          const isOverdue =
            new Date(assignment.due_date) < new Date() && assignment.submissionStatus === 'Pending';
          return (
            <div
              key={assignment.id}
              className={`p-4 rounded-3xl shadow-md flex flex-col justify-between bg-white dark:bg-gray-800 transition hover:shadow-xl border ${
                isOverdue ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div>
                <h4 className="font-semibold text-md text-blue-600 dark:text-blue-400 mb-1">{assignment.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{assignment.description}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Points: {assignment.total_points}
                </p>
                {isOverdue && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1">Overdue</p>
                )}
              </div>

              <div className="mt-3">
                {assignment.submissionStatus === 'Submitted' ? (
                  <button
                    disabled
                    className="w-full px-2 py-1 text-xs rounded-md font-medium bg-gray-400 text-white cursor-not-allowed"
                  >
                    Submitted
                  </button>
                ) : !isOverdue ? (
                  <button
                    onClick={() => router.push(`/student/assignments/${assignment.id}`)}
                    className="w-full px-2 py-1 text-xs rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grades Table */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Graded Assignments</h3>
      {gradedAssignments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Assignment</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Grade</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {gradedAssignments.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{a.title}</td>
                  <td className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">{a.grade}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{a.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No graded assignments yet.</p>
      )}
    </div>
  );
};

export default AssignmentDashboard;
