import React, { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Clock, ChevronLeft, ChevronRight, ArrowLeft, Plus } from "lucide-react";

export default function FlashcardSystem({ flashcards, onBack, onCreateFlashcard, initialCardId }) {
  // Get unique books and categories from flashcards
  const books = Array.from(new Set(flashcards.map(card => card.book).filter(Boolean)));
  const categories = Array.from(new Set(flashcards.map(card => card.category).filter(Boolean)));

  // Filter state
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtered flashcards
  const filteredFlashcards = flashcards.filter(card => {
    if (selectedBook && card.book !== selectedBook) return false;
    if (selectedCategory && card.category !== selectedCategory) return false;
    return true;
  });


  // Number of cards per session
  const [sessionCount, setSessionCount] = useState<number>(Math.min(10, filteredFlashcards.length || 10));
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const [studyMode, setStudyMode] = useState(!!initialCardId);
  const [shuffledCards, setShuffledCards] = useState(filteredFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    if (initialCardId) {
      const index = flashcards.findIndex(card => card.id === initialCardId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Scroll to top when entering or exiting study mode
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [studyMode]);

  const startStudySession = () => {
    // Shuffle and take only sessionCount cards
    const shuffled = shuffleArray(filteredFlashcards).slice(0, sessionCount);
    setShuffledCards(shuffled);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const nextCard = (wasCorrect: boolean | null = null) => {
    if (wasCorrect !== null) {
      setSessionStats(prev => ({
        ...prev,
        [wasCorrect ? 'correct' : 'incorrect']: prev[wasCorrect ? 'correct' : 'incorrect'] + 1
      }));
    }
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // End session
      setStudyMode(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  if (studyMode && shuffledCards.length > 0) {
    const currentCard = shuffledCards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / shuffledCards.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6 pt-8">
          {/* Study Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setStudyMode(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quitter
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
              Carte {currentCardIndex + 1} sur {shuffledCards.length}
              </p>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-green-600">✓ {sessionStats.correct}</p>
              <p className="text-red-600">✗ {sessionStats.incorrect}</p>
            </div>
          </div>

          {/* Flashcard */}
          <Card className="min-h-[400px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
            <CardHeader className="text-center">
              <Badge variant="outline" className="w-fit mx-auto">
                {currentCard.category}
              </Badge>
              <CardTitle className="text-xl">
                {showAnswer ? "Réponse" : "Question"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <p className="text-lg leading-relaxed">
                  {showAnswer ? currentCard.answer : currentCard.question}
                </p>
                {!showAnswer && (
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour révéler la réponse
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevCard}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédente
            </Button>

            {showAnswer ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => nextCard(false)}>
                  Difficile
                </Button>
                <Button onClick={() => nextCard(true)}>
                  Facile
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAnswer(true)}>
                Révéler la réponse
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={() => nextCard()}
              disabled={currentCardIndex === shuffledCards.length - 1 && !showAnswer}
            >
              Suivante
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">Système de flashcards</h1>
          </div>
          <Button onClick={onCreateFlashcard}>
            <Plus className="w-4 h-4 mr-2" />
            Créer une fiche
          </Button>
        </div>

        {/* Filtres + Session Card dans le même conteneur responsive */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl mx-auto">
          {/* Filtres */}
          <section
            aria-label="Filtres flashcards"
            className="flex-1 bg-white rounded-lg shadow p-4 border flex flex-col gap-4 min-w-[220px]"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-book" className="font-medium text-sm text-black">
                Filtrer par livre
              </label>
              <select
                id="filter-book"
                className="border rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedBook || ''}
                onChange={e => setSelectedBook(e.target.value || null)}
                aria-label="Filtrer par livre"
              >
                <option value="">Tous</option>
                {books.map(book => (
                  <option key={String(book)} value={String(book)}>
                    {String(book)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-category" className="font-medium text-sm text-black">
                Filtrer par catégorie
              </label>
              <select
                id="filter-category"
                className="border rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory || ''}
                onChange={e => setSelectedCategory(e.target.value || null)}
                aria-label="Filtrer par catégorie"
              >
                <option value="">Toutes</option>
                {categories.map(category => (
                  <option key={String(category)} value={String(category)}>
                    {String(category)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="session-count" className="font-medium text-sm text-black">
                Nombre de cartes par session
              </label>
              <input
                id="session-count"
                type="number"
                min={1}
                max={filteredFlashcards.length}
                value={sessionCount}
                onChange={e => {
                  const val = Math.max(1, Math.min(filteredFlashcards.length, Number(e.target.value)));
                  setSessionCount(val);
                }}
                className="border rounded px-3 py-2 w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={filteredFlashcards.length === 0}
                aria-label="Nombre de cartes par session"
              />
            </div>
          </section>

          {/* Session Card */}
          <div className="flex-1 min-w-[260px] flex items-stretch">
            <Card className="flex flex-col justify-between w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Session d'étude
                </CardTitle>
                <CardDescription>
                  Révisez toutes vos flashcards dans un mode d'étude interactif
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Fiches disponibles</span>
                    <span className="font-medium">{filteredFlashcards.length}</span>
                  </div>
                  <Button onClick={startStudySession} className="w-full" variant="main-cta">
                    Commencer la révision
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liste des flashcards */}
        {filteredFlashcards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Aucune flashcard trouvée</h3>
              <p className="text-muted-foreground">
                Modifiez les filtres ou créez vos premières flashcards pour commencer à réviser efficacement
              </p>
              <Button variant={'main-cta'} onClick={onCreateFlashcard}>
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première flashcard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold">Vos flashcards</h2>
            <div className="grid gap-4">
              {filteredFlashcards.map((card, index) => (
                <Card key={card.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">{card.category}</Badge>
                        <CardTitle className="text-base">{card.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {card.answer.substring(0, 100)}{card.answer.length > 100 ? '...' : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}