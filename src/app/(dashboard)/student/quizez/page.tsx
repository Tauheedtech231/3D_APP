'use client';

import QuizList from '@/app/components/quizez/quizlist';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizezPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" size="sm" className="w-9 p-0">
            <Link href="/student">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Quizzes</h2>
        </div>
      </div>
      <QuizList />
    </div>
  );
}