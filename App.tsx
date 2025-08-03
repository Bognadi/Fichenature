import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BookOpen, Brain, TrendingUp, Plus, Play, RotateCcw, GraduationCap } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BookSection from './components/BookSection';
import FlashcardSystem from './components/FlashcardSystem';
import CreateFiche from './components/CreateFiche';
import MethodologySection from './components/MethodologySection';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);
  const [studyData, setStudyData] = useState(() => {
    const saved = localStorage.getItem('philosophyStudyData');
    const defaultData = {
      booksProgress: {
        'connaissance-vie': { completed: 0, total: 12, fichesSeen: [] },
        'vingt-mille-lieues': { completed: 0, total: 10, fichesSeen: [] },
        'mur-invisible': { completed: 0, total: 8, fichesSeen: [] },
        'methodologie': { completed: 0, total: 6, fichesSeen: [] }
      },
      flashcards: [],
      totalStudyTime: 0,
      streakDays: 0,
      lastStudyDate: null
    };
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Ensure all required progress objects exist
        const booksProgress = {
          ...defaultData.booksProgress,
          ...parsedData.booksProgress
        };
        return {
          ...defaultData,
          ...parsedData,
          booksProgress
        };
      } catch (error) {
        console.error('Error parsing saved data:', error);
        return defaultData;
      }
    }
    return defaultData;
  });

  const books = [
    {
      id: 'connaissance-vie',
      title: 'La Connaissance de la vie',
      author: 'Georges Canguilhem',
      description: 'Épistémologie et philosophie des sciences du vivant',
      color: 'bg-blue-50 border-blue-200',
      progress: studyData.booksProgress['connaissance-vie'] || { completed: 0, total: 12, fichesSeen: [] },
      type: 'book'
    },
    {
      id: 'vingt-mille-lieues',
      title: 'Vingt mille lieues sous les mers',
      author: 'Jules Verne',
      description: 'Nature, technique et exploration scientifique',
      color: 'bg-green-50 border-green-200',
      progress: studyData.booksProgress['vingt-mille-lieues'] || { completed: 0, total: 10, fichesSeen: [] },
      type: 'book'
    },
    {
      id: 'mur-invisible',
      title: 'Le Mur invisible',
      author: 'Marlen Haushofer',
      description: 'Isolement, nature et condition humaine',
      color: 'bg-purple-50 border-purple-200',
      progress: studyData.booksProgress['mur-invisible'] || { completed: 0, total: 8, fichesSeen: [] },
      type: 'book'
    }
  ];

  const methodology = {
    id: 'methodologie',
    title: 'Méthodologie',
    description: 'Méthodes d\'analyse et techniques de dissertation',
    color: 'bg-orange-50 border-orange-200',
    progress: studyData.booksProgress['methodologie'] || { completed: 0, total: 6, fichesSeen: [] },
    type: 'methodology'
  };

  useEffect(() => {
    localStorage.setItem('philosophyStudyData', JSON.stringify(studyData));
  }, [studyData]);

  const updateProgress = (sectionId, ficheId) => {
    setStudyData(prev => {
      const newData = { ...prev };
      if (!newData.booksProgress[sectionId].fichesSeen.includes(ficheId)) {
        newData.booksProgress[sectionId].fichesSeen.push(ficheId);
        newData.booksProgress[sectionId].completed = newData.booksProgress[sectionId].fichesSeen.length;
      }
      return newData;
    });
  };

  const addFlashcard = (flashcard) => {
    setStudyData(prev => ({
      ...prev,
      flashcards: [...prev.flashcards, { ...flashcard, id: Date.now(), createdAt: new Date() }]
    }));
  };

  if (activeTab === 'dashboard') {
    return <Dashboard 
      studyData={studyData} 
      books={books}
      methodology={methodology}
      onNavigateToBook={(bookId) => setActiveTab(bookId)}
      onNavigateToMethodology={() => setActiveTab('methodologie')}
      onNavigateToFlashcards={() => setActiveTab('flashcards')}
      onCreateFlashcard={() => setActiveTab('create-fiche')}
      addFlashcard={addFlashcard}
      onOpenFlashcard={(cardId) => {
        setSelectedFlashcardId(cardId);
        setActiveTab('flashcards');
      }}
    />;
  }

  if (activeTab === 'flashcards') {
    return <FlashcardSystem 
      flashcards={studyData.flashcards}
      onBack={() => {
        setActiveTab('dashboard');
        setSelectedFlashcardId(null);
      }}
      onCreateFlashcard={() => setActiveTab('create-fiche')}
      initialCardId={selectedFlashcardId}
    />;
  }

  if (activeTab === 'create-fiche') {
    return <CreateFiche 
      onBack={() => setActiveTab('flashcards')}
      onCreateFlashcard={addFlashcard}
    />;
  }

  if (activeTab === 'methodologie') {
    return <MethodologySection 
      methodology={methodology}
      onBack={() => setActiveTab('dashboard')}
      onProgress={updateProgress}
    />;
  }

  const currentBook = books.find(book => book.id === activeTab);
  if (currentBook) {
    return <BookSection 
      book={currentBook}
      onBack={() => setActiveTab('dashboard')}
      onProgress={updateProgress}
    />;
  }

  return <Dashboard 
    studyData={studyData} 
    books={books}
    methodology={methodology}
    onNavigateToBook={(bookId) => setActiveTab(bookId)}
    onNavigateToMethodology={() => setActiveTab('methodologie')}
    onNavigateToFlashcards={() => setActiveTab('flashcards')}
    onCreateFlashcard={() => setActiveTab('create-fiche')}
    addFlashcard={addFlashcard}
    onOpenFlashcard={(cardId) => {
      setSelectedFlashcardId(cardId);
      setActiveTab('flashcards');
    }}
  />;
}