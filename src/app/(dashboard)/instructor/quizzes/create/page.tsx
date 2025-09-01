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
import { CalendarIcon, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
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

interface Question {
  id: string;
  type: 'MCQ' | 'True/False';
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const CreateQuiz: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    timeLimit: '',
    totalPoints: ''
  });

  useEffect(() => {
    fetchCourses();
    addQuestion();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://31.97.49.20/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'MCQ',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleQuestionTypeChange = (questionId: string, type: 'MCQ' | 'True/False') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const options = type === 'True/False' ? ['True', 'False'] : ['', '', '', ''];
        const correctAnswer = type === 'True/False' ? 'True' : '';
        return { ...q, type, options, correctAnswer };
      }
      return q;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validQuestions = questions.filter(q =>
        q.questionText.trim() &&
        q.correctAnswer.trim() &&
        (q.type === 'True/False' || q.options.every(opt => opt.trim()))
      );

      if (validQuestions.length === 0) {
        alert('Please add at least one complete question.');
        setLoading(false);
        return;
      }

      const quizData = {
        title: formData.title,
        instructions: formData.instructions,
        coursemodule_id: parseInt(selectedModule),
        instructor_id: 1,
        due_date: dueDate?.toISOString(),
        time_limit: parseInt(formData.timeLimit),
        total_points: parseInt(formData.totalPoints),
        questions: validQuestions.map(q => ({
          question_text: q.questionText,
          question_type: q.type,
          options: q.options,
          correct_answer: q.correctAnswer
        }))
      };

      const response = await fetch('http://31.97.49.20/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        router.push('/instructor/quizzes');
      } else {
        throw new Error('Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.find(course => course.id.toString() === selectedCourse);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto text-sm">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/instructor/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Create Quiz</h1>
          <p className="text-muted-foreground text-xs">Create a new quiz for your students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 text-sm">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quiz Information</CardTitle>
              <CardDescription className="text-xs">Basic quiz details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs">Quiz Title *</Label>
                <Input
                  id="title"
                  className="text-sm"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-xs">Instructions</Label>
                <Textarea
                  id="instructions"
                  className="text-sm"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Instructions for students"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-xs">Time Limit (minutes) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    className="text-sm"
                    value={formData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPoints" className="text-xs">Total Points *</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    className="text-sm"
                    value={formData.totalPoints}
                    onChange={(e) => handleInputChange('totalPoints', e.target.value)}
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course and Module Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Assignment</CardTitle>
              <CardDescription className="text-xs">Select course and module for this quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Course *</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()} className="text-sm">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Module *</Label>
                <Select 
                  value={selectedModule} 
                  onValueChange={setSelectedModule} 
                  disabled={!selectedCourse}
                  required
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourseData?.modules.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()} className="text-sm">
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Days Until Due</Label>
                  <Input
                    type="number"
                    className="text-sm"
                    placeholder="Enter number of days"
                    min="1"
                    onChange={(e) => {
                      const days = parseInt(e.target.value);
                      if (!isNaN(days) && days > 0) {
                        const newDate = new Date();
                        newDate.setDate(newDate.getDate() + days);
                        setDueDate(newDate);
                      } else {
                        setDueDate(undefined);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-sm"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">Quiz Questions</CardTitle>
                <CardDescription className="text-xs">Add questions for your quiz</CardDescription>
              </div>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm" className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Question Type</Label>
                    <Select 
                      value={question.type} 
                      onValueChange={(value: 'MCQ' | 'True/False') => handleQuestionTypeChange(question.id, value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ" className="text-sm">Multiple Choice</SelectItem>
                        <SelectItem value="True/False" className="text-sm">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Correct Answer</Label>
                    <Select 
                      value={question.correctAnswer} 
                      onValueChange={(value) => updateQuestion(question.id, 'correctAnswer', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options
                          .filter(option => option.trim() !== '')
                          .map((option, optIndex) => (
                            <SelectItem key={optIndex} value={option} className="text-sm">
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Question Text</Label>
                  <Textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                    placeholder="Enter your question here"
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Answer Options</Label>
                  <div className="grid gap-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <span className="text-xs font-medium w-8">
                          {question.type === 'True/False' ? 
                            (optIndex === 0 ? 'T:' : 'F:') : 
                            `${String.fromCharCode(65 + optIndex)}:`}
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                          placeholder={question.type === 'True/False' ? 
                            (optIndex === 0 ? 'True' : 'False') : 
                            `Option ${optIndex + 1}`}
                          disabled={question.type === 'True/False'}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild size="sm" className="text-sm">
            <Link href="/instructor/quizzes">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading} size="sm" className="text-sm">
            {loading ? 'Creating...' : 'Create Quiz'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
