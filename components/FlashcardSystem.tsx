import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, RotateCcw, ChevronLeft, ChevronRight, Brain, Clock } from 'lucide-react';

export default function FlashcardSystem({ flashcards, onBack, onCreateFlashcard, initialCardId }) {
  const [studyMode, setStudyMode] = useState(!!initialCardId);
  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    if (initialCardId) {
      const index = flashcards.findIndex(card => card.id === initialCardId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const startStudySession = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const nextCard = (wasCorrect = null) => {
    if (wasCorrect !== null) {
      setSessionStats(prev => ({
        ...prev,
        [wasCorrect ? 'correct' : 'incorrect']: prev[wasCorrect ? 'correct' : 'incorrect'] + 1
      }));
    }
    
    if (currentCardIndex < flashcards.length - 1) {
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

  if (studyMode && flashcards.length > 0) {
    const currentCard = flashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

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
                Carte {currentCardIndex + 1} sur {flashcards.length}
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
              disabled={currentCardIndex === flashcards.length - 1 && !showAnswer}
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

        {flashcards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Aucune flashcard créée</h3>
              <p className="text-muted-foreground">
                Créez vos premières flashcards pour commencer à réviser efficacement
              </p>
              <Button variant={'main-cta'} onClick={onCreateFlashcard}>
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première flashcard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Study Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
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
                      <span className="font-medium">{flashcards.length}</span>
                    </div>
                    <Button onClick={startStudySession} className="w-full">
                      Commencer la révision
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Révision rapide
                  </CardTitle>
                  <CardDescription>
                    Parcourez rapidement vos fiches pour une révision express
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Bientôt disponible
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Flashcards List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Vos flashcards</h2>
              <div className="grid gap-4">
                {flashcards.map((card, index) => (
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
          </>
        )}
      </div>
    </div>
  );
}