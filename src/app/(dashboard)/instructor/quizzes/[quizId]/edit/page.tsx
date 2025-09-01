'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Question {
  id?: number;
  question_text: string;
  question_type: 'MCQ' | 'TrueFalse';
  options: string[];
  correct_answer: string;
}

interface Quiz {
  id: number;
  title: string;
  instructions: string;
  total_points: number;
  time_limit: number;
  due_date: string;
  questions: Question[];
}

const EditQuizPage = () => {
  const { quizId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    timeLimit: '',
    totalPoints: ''
  });

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
    try {
      const response = await fetch(`http://31.97.49.20/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      const quiz: Quiz = await response.json();

      setFormData({
        title: quiz.title,
        instructions: quiz.instructions,
        timeLimit: quiz.time_limit.toString(),
        totalPoints: quiz.total_points.toString()
      });

      setDueDate(quiz.due_date ? new Date(quiz.due_date) : null);
      setQuestions(quiz.questions);
    } catch (err) {
      setError('Error loading quiz');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchQuiz();
  }, [quizId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      const options = [...updated[questionIndex].options];
      options[optionIndex] = value;
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      question_text: '',
      question_type: 'MCQ',
      options: ['', '', '', ''],
      correct_answer: ''
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate questions
    const validQuestions = questions.filter(q => (
      q.question_text.trim() !== '' &&
      q.correct_answer.trim() !== '' &&
      (q.question_type === 'TrueFalse' || q.options.every(opt => opt.trim() !== ''))
    ));

    if (validQuestions.length === 0) {
      alert('Please add at least one valid question');
      return;
    }

    try {
      const quizData = {
        title: formData.title,
        instructions: formData.instructions,
        time_limit: parseInt(formData.timeLimit),
        total_points: parseInt(formData.totalPoints),
        due_date: dueDate?.toISOString(),
        questions: validQuestions
      };

      const response = await fetch(`http://31.97.49.20/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });

      if (!response.ok) throw new Error('Failed to update quiz');

      router.push('/instructor/quizzes');
    } catch (err) {
      console.error('Error updating quiz:', err);
      alert('Failed to update quiz');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center h-64">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Edit Quiz</h1>
        <Link
          href="/instructor/quizzes"
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Back to Quizzes
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Info */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Quiz Info</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Limit (minutes)</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Points</label>
              <input
                type="number"
                name="totalPoints"
                value={formData.totalPoints}
                onChange={handleInputChange}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Question {qIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Text</label>
                <input
                  type="text"
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
                <select
                  value={question.question_type}
                  onChange={(e) => handleQuestionChange(qIndex, 'question_type', e.target.value as 'MCQ' | 'TrueFalse')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TrueFalse">True/False</option>
                </select>
              </div>

              {question.question_type === 'MCQ' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {question.question_type === 'MCQ' ? 'Correct Option' : 'Correct Answer'}
                </label>
                {question.question_type === 'MCQ' ? (
                  <select
                    value={question.correct_answer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select correct option</option>
                    {question.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>{option || `Option ${oIndex + 1}`}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={question.correct_answer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/instructor/quizzes"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuizPage;
