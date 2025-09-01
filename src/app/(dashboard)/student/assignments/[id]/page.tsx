'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

const AssignmentSubmitPage: React.FC = () => {
  const params = useParams();
  const assignmentId = Number(params.id);
  const studentId = 2; // Hardcoded for now

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `http://31.97.49.20/api/assignments/student/course?courseId=2&studentId=${studentId}`
        );
        const data: Assignment[] = await res.json();
        const current = data.find((a) => a.id === assignmentId) || null;
        setAssignment(current);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // const handleSubmit = async () => {
  //   setStatusMsg('');
  //   setErrorMsg('');

  //   try {
  //     let fileUrl = null;

  //     if (file) {
  //       fileUrl = `uploads/${file.name}`;
  //     }

  //     const res = await fetch('http://31.97.49.20/api/assignments/student/submit', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         assignmentId,
  //         studentId,
  //         submissionText,
  //         fileUrl,
  //         fileName: file?.name,
  //         fileSize: file?.size,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || 'Submission failed');

  //     setStatusMsg('Assignment submitted successfully!');
  //     setSubmissionText('');
  //     setFile(null);
  //     setAssignment({ ...assignment!, submissionStatus: 'Submitted' });
  //   } catch (err: unknown) {
  // if (err instanceof Error) {
  //   setErrorMsg(err.message);
  // } else {
  //   setErrorMsg('Error submitting assignment');
  // }}
  // };
  const handleSubmit = async () => {
  setStatusMsg('');
  setErrorMsg('');

  try {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId.toString());
    formData.append('studentId', studentId.toString());
    formData.append('submissionText', submissionText);
    if (file) formData.append('file', file);

    const res = await fetch('http://31.97.49.20/api/assignments/student/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');

    setStatusMsg('Assignment submitted successfully!');
    setSubmissionText('');
    setFile(null);
    setAssignment({ ...assignment!, submissionStatus: 'Submitted' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      setErrorMsg(err.message);
    } else {
      setErrorMsg('Error submitting assignment');
    }
  }
};


  if (loading)
    return <p className="text-center mt-6 text-blue-600 font-medium text-sm">Loading assignment...</p>;

  if (!assignment)
    return <p className="text-center mt-6 text-red-600 font-medium text-sm">Assignment not found</p>;

  const isOverdue =
    new Date(assignment.due_date) < new Date() && assignment.submissionStatus === 'Pending';

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* Assignment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6 border-l-4 border-blue-600">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{assignment.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{assignment.description}</p>
        <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-xs">
          <p><span className="font-semibold">Due:</span> {new Date(assignment.due_date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Points:</span> {assignment.total_points}</p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            {assignment.submissionStatus === 'Submitted' ? (
              <span className="text-green-600 dark:text-green-400 font-semibold">Submitted</span>
            ) : isOverdue ? (
              <span className="text-red-600 dark:text-red-400 font-semibold">Overdue</span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Pending</span>
            )}
          </p>
        </div>
      </div>

      {/* Submission Form */}
      {assignment.submissionStatus === 'Submitted' && (
        <p className="text-green-600 dark:text-green-400 text-center font-medium text-sm mb-4">
          Submitt Successfully.
        </p>
      )}

      {assignment.submissionStatus === 'Pending' && !isOverdue && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Submit Your Work</h2>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            placeholder="Write your submission here..."
            rows={4}
            className="w-full p-2 border rounded-md mb-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 text-sm text-gray-700 dark:text-gray-300"
            accept=".pdf,.doc,.docx,.txt"
          />
          {errorMsg && <p className="text-red-600 mb-2 text-sm">{errorMsg}</p>}
          {statusMsg && <p className="text-green-600 mb-2 text-sm">{statusMsg}</p>}
          <button
            onClick={handleSubmit}
            className="w-full py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit Assignment
          </button>
        </div>
      )}

      {isOverdue && (
        <p className="text-red-600 dark:text-red-400 font-medium text-sm text-center mt-3">
          Data Not Available (Overdue)
        </p>
      )}
    </div>
  );
};

export default AssignmentSubmitPage;