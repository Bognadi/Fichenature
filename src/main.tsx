import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Brain, TrendingUp, Plus, Play, RotateCcw, GraduationCap } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import BookSection from '../components/BookSection';
import FlashcardSystem from '../components/FlashcardSystem';
import CreateFlashcard from '../components/CreateFlashcard';
import MethodologySection from '../components/MethodologySection';
import ThemeSection from '../components/ThemeSection';
import "../styles/globals.css";
import fichesData from './fiches.json';

export default function App() {
  type BookProgress = {
    completed: number;
    total: number;
    fichesSeen: string[];
  };

  type StudyData = {
    booksProgress: {
      [key: string]: BookProgress;
    };
    flashcards: Flashcard[];
    totalStudyTime: number;
    streakDays: number;
    lastStudyDate: string | null;
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedFlashcardId, setSelectedFlashcardId] = useState<number | null>(null);
  const [studyData, setStudyData] = useState<StudyData>(() => {
    const defaultData: StudyData = {
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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('philosophyStudyData');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          // Ensure all required progress objects exist
          const booksProgress = {
            ...defaultData.booksProgress,
            ...parsedData.booksProgress
          };
          // Parse createdAt back to Date object if present in flashcards
          const flashcards = Array.isArray(parsedData.flashcards)
            ? parsedData.flashcards.map((fc: any) => ({
                ...fc,
                createdAt: fc.createdAt ? new Date(fc.createdAt) : undefined
              }))
            : [];
          return {
            ...defaultData,
            ...parsedData,
            booksProgress,
            flashcards
          };
        } catch (error) {
          console.error('Error parsing saved data:', error);
          return defaultData;
        }
      }
    }
    return defaultData;
    return defaultData;
  });

  // Helper to get fiches for a book or methodology
  const normalize = (str: string) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();

  // Move books array definition BEFORE getFichesForSection and getTotalFichesForSection
  const books = [
    {
      id: 'connaissance-vie',
      title: 'La Connaissance de la vie',
      author: 'Georges Canguilhem',
      description: 'Épistémologie et philosophie des sciences du vivant',
      color: 'bg-blue-50 border-blue-200',
      // progress will be set after getTotalFichesForSection is defined
      type: 'book',
      citation: "« Le propre du vivant, c’est de se faire son milieu, de se composer son milieu. »"
    },
    {
      id: 'vingt-mille-lieues',
      title: 'Vingt mille lieues sous les mers',
      author: 'Jules Verne',
      description: 'Nature, technique et exploration scientifique',
      color: 'bg-green-50 border-green-200',
      type: 'book',
      citation: "« Mobilis in mobili. »"
    },
    {
      id: 'mur-invisible',
      title: 'Le Mur invisible',
      author: 'Marlen Haushofer',
      description: 'Isolement, nature et condition humaine',
      color: 'bg-purple-50 border-purple-200',
      type: 'book',
      citation: "« Je vois que ce n’est pas la fin. Tout continue. »"
    },
    {
      id: 'methodologie',
      title: 'Méthodologie',
      author: 'Divers',
      description: 'Conseils pour apprendre efficacement',
      color: 'bg-yellow-50 border-yellow-200',
      type: 'book'
    }
  ];

  // Now define getFichesForSection and getTotalFichesForSection
  const getFichesForSection = (sectionId: string) => {
    if (sectionId === 'methodologie') {
      return fichesData.fiches
        .filter(f => f.type === 'methodology')
        .sort((a, b) => {
          // Sort by fiche_numero if present, else by id
          if (a.fiche_numero && b.fiche_numero) {
            return a.fiche_numero - b.fiche_numero;
          }
          if (a.fiche_numero) return -1;
          if (b.fiche_numero) return 1;
          return a.id.localeCompare(b.id);
        });
    }
    const book = books.find(b => b.id === sectionId);
    if (!book) return [];
    // Get all fiches for this group (book and citations), then sort by fiche_numero if present, else by id
    return fichesData.fiches
      .filter(
        f =>
          (f.type === 'book' || f.type === 'citations') &&
          normalize(f.group) === normalize(book.title)
      )
      .sort((a, b) => {
        if (a.fiche_numero && b.fiche_numero) {
          return a.fiche_numero - b.fiche_numero;
        }
        if (a.fiche_numero) return -1;
        if (b.fiche_numero) return 1;
        return a.id.localeCompare(b.id);
      });
  };

  // Helper to get theme fiches
  const getThemeFiches = () =>
    fichesData.fiches
      .filter(f => f.type === 'theme')
      .sort((a, b) => {
        if (a.fiche_numero && b.fiche_numero) {
          return a.fiche_numero - b.fiche_numero;
        }
        if (a.fiche_numero) return -1;
        if (b.fiche_numero) return 1;
        return a.id.localeCompare(b.id);
      });

  // --- Theme progress state ---
  const [themeFichesSeen, setThemeFichesSeen] = useState<string[]>([]);
  const themeFiches = getThemeFiches();
  const themeProgress = {
    completed: themeFichesSeen.length,
    total: themeFiches.length,
    fichesSeen: themeFichesSeen,
  };

  // Mark a theme fiche as seen
  const updateThemeProgress = (ficheId: string) => {
    setThemeFichesSeen(prev =>
      prev.includes(ficheId) ? prev : [...prev, ficheId]
    );
  };

  const getTotalFichesForSection = (sectionId: string) => getFichesForSection(sectionId).length;

  // Now set progress dynamically for each book/methodology
  const booksWithProgress = books.map(book => ({
    ...book,
    progress: {
      ...(studyData.booksProgress[book.id] || { completed: 0, fichesSeen: [] }),
      total: getTotalFichesForSection(book.id)
    }
  }));

  const updateProgress = (sectionId: string, ficheId: string) => {
    setStudyData(prev => {
      const prevBookProgress = prev.booksProgress[sectionId];
      if (!prevBookProgress.fichesSeen.includes(ficheId)) {
        const updatedFichesSeen = [...prevBookProgress.fichesSeen, ficheId];
        return {
          ...prev,
          booksProgress: {
            ...prev.booksProgress,
            [sectionId]: {
              ...prevBookProgress,
              fichesSeen: updatedFichesSeen,
              completed: updatedFichesSeen.length
            }
          }
        };
      }
      return prev;
    });
  };

  const addFlashcard = (flashcard: any) => {
    setStudyData(prev => ({
      ...prev,
      flashcards: [
        ...prev.flashcards,
        { ...flashcard, id: uuidv4(), createdAt: new Date() }
      ]
    }));
  };

  // Save studyData to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Avoid saving Date objects directly (convert to string)
      const dataToSave = {
        ...studyData,
        flashcards: studyData.flashcards.map(fc => ({
          ...fc,
          createdAt: fc.createdAt ? new Date(fc.createdAt).toISOString() : undefined
        }))
      };
      localStorage.setItem('philosophyStudyData', JSON.stringify(dataToSave));
    }
  }, [studyData]);

  // Add a reset function to clear all progress and flashcards
  const resetAdvancement = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toute votre progression ? Cette action est irréversible.")) {
      setStudyData({
        booksProgress: {
          'connaissance-vie': { completed: 0, total: getTotalFichesForSection('connaissance-vie'), fichesSeen: [] },
          'vingt-mille-lieues': { completed: 0, total: getTotalFichesForSection('vingt-mille-lieues'), fichesSeen: [] },
          'mur-invisible': { completed: 0, total: getTotalFichesForSection('mur-invisible'), fichesSeen: [] },
          'methodologie': { completed: 0, total: getTotalFichesForSection('methodologie'), fichesSeen: [] }
        },
        flashcards: [],
        totalStudyTime: 0,
        streakDays: 0,
        lastStudyDate: null
      });
      setThemeFichesSeen([]);
      localStorage.removeItem('philosophyStudyData');
    }
  };

  if (activeTab === 'dashboard') {
    return <Dashboard 
      studyData={studyData} 
      books={booksWithProgress}
      methodology={booksWithProgress.find(book => book.id === 'methodologie')}
      onNavigateToBook={(bookId) => setActiveTab(bookId)}
      onNavigateToMethodology={() => setActiveTab('methodologie')}
      onNavigateToFlashcards={() => setActiveTab('flashcards')}
      onCreateFlashcard={() => setActiveTab('create-fiche')}
      addFlashcard={addFlashcard}
      onOpenFlashcard={(cardId) => {
        setSelectedFlashcardId(cardId);
        setActiveTab('flashcards');
      }}
      onNavigateToThemes={() => setActiveTab('themes')}
      themeProgress={themeProgress}
      resetAdvancement={resetAdvancement} // <-- Pass the reset function
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
    return <CreateFlashcard 
      onBack={() => setActiveTab('flashcards')}
      onCreateFlashcard={addFlashcard}
    />;
  }

  if (activeTab === 'methodologie') {
    return <MethodologySection 
      methodology={booksWithProgress.find(book => book.id === 'methodologie')}
      fiches={getFichesForSection('methodologie')}
      onBack={() => setActiveTab('dashboard')}
      onProgress={updateProgress}
    />;
  }

  if (activeTab === 'themes') {
    return <ThemeSection
      fiches={themeFiches}
      onBack={() => setActiveTab('dashboard')}
      themeProgress={themeProgress}
      onProgress={updateThemeProgress}
    />;
  }

  const currentBook = booksWithProgress.find(book => book.id === activeTab);
  if (currentBook) {
    return <BookSection 
      book={currentBook}
      fiches={getFichesForSection(currentBook.id)}
      onBack={() => setActiveTab('dashboard')}
      onProgress={updateProgress}
      // No need to pass citation separately, it's in book
    />;
  }

  return <Dashboard 
    studyData={studyData} 
    books={booksWithProgress}
    methodology={booksWithProgress.find(book => book.id === 'methodologie')}
    onNavigateToBook={(bookId) => setActiveTab(bookId)}
    onNavigateToMethodology={() => setActiveTab('methodologie')}
    onNavigateToFlashcards={() => setActiveTab('flashcards')}
    onCreateFlashcard={() => setActiveTab('create-fiche')}
    addFlashcard={addFlashcard}
    onOpenFlashcard={(cardId) => {
      setSelectedFlashcardId(cardId);
      setActiveTab('flashcards');
    }}
    onNavigateToThemes={() => setActiveTab('themes')}
    resetAdvancement={resetAdvancement} // <-- Pass the reset function
  />;
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}