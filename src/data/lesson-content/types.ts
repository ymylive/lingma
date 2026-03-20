import type { ReactNode } from 'react';

export interface LessonContent {
  title: string;
  category: string;
  duration: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  demoLink?: string;
  sections: {
    title: string;
    content: ReactNode;
  }[];
}

