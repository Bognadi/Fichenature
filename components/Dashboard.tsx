import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Play,
  Calendar,
  Clock,
  Target,
  GraduationCap,
  Plus,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function Dashboard({
  studyData,
  books,
  methodology,
  onNavigateToBook,
  onNavigateToMethodology,
  onNavigateToFlashcards,
  onCreateFlashcard,
  addFlashcard,
  onOpenFlashcard,
  onNavigateToThemes,
  themeProgress, // <-- Add this prop
  resetAdvancement, // <-- Add this prop
}) {
  const totalProgress =
    books.reduce(
      (sum, book) => sum + (book.progress?.completed || 0),
      0,
    ) + (methodology.progress?.completed || 0);
  const totalFiches =
    books.reduce(
      (sum, book) => sum + (book.progress?.total || 0),
      0,
    ) + (methodology.progress?.total || 0);
  const completionPercentage =
    totalFiches > 0
      ? Math.round((totalProgress / totalFiches) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <Badge variant="outline" className="mb-4">
            Programme PCSI 2025-2026
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            L'expérience de la nature
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les trois œuvres au programme à travers des
            fiches de lecture détaillées, des analyses
            thématiques et un système de révision par
            flashcards.
          </p>
          <button
            className="text-xs text-red-600 underline mt-2"
            onClick={resetAdvancement}
            type="button"
          >
            Réinitialiser la progression
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Progression globale
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completionPercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalProgress} sur {totalFiches} fiches vues
              </p>
              <Progress
                value={completionPercentage}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Flashcards créées
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studyData.flashcards.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Cartes de révision personnalisées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Série actuelle
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studyData.streakDays}
              </div>
              <p className="text-xs text-muted-foreground">
                Jours d'étude consécutifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temps d'étude
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(studyData.totalStudyTime / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                Total accumulé
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Flashcards Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Système de révision</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flashcards Overview */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <Badge variant="secondary">
                    {studyData.flashcards.length} cartes
                  </Badge>
                </div>
                <CardTitle className="text-lg">Mes flashcards</CardTitle>
                <CardDescription>
                  Vos cartes de révision personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={onCreateFlashcard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer
                  </Button>
                  <Button 
                    onClick={onNavigateToFlashcards}
                    variant="main-cta"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réviser
                  </Button>
                </div>
                {studyData.flashcards.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Dernière carte créée : {new Date(studyData.flashcards[studyData.flashcards.length - 1]?.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Revision by Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Révision rapide
                </CardTitle>
                <CardDescription>
                  Accès direct aux sections d'étude
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => onNavigateToBook('connaissance-vie')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Canguilhem
                  </Button>
                  <Button
                    onClick={() => onNavigateToBook('vingt-mille-lieues')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Verne
                  </Button>
                  <Button
                    onClick={() => onNavigateToBook('mur-invisible')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Haushofer
                  </Button>
                  <Button
                    onClick={onNavigateToMethodology}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Méthodo
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Cliquez pour accéder directement à une section
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Flashcards Preview */}
          {studyData.flashcards.length > 0 && (
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg">Dernières flashcards créées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {studyData.flashcards.slice(-3).map((card, index) => (
                    <div 
                      key={card.id || index} 
                      className="p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all duration-200"
                      onClick={() => onOpenFlashcard(card.id)}
                    >
                      <div className="text-sm font-medium mb-1">{card.question?.substring(0, 50)}...</div>
                      <Badge variant="outline" className="text-xs">
                        {card.category || 'Général'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={onNavigateToFlashcards}
                  variant="outline" 
                  className="w-full mt-3"
                >
                  Voir toutes les flashcards
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Books Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Œuvres au programme
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {books
              // Filter out the methodology card if it's present in books
              .filter((book) => book.id !== methodology.id)
              .map((book) => (
          <Card
            key={book.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${book.color}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-6 w-6 text-primary" />
                <Badge variant="secondary">
            {book.progress?.completed || 0}/
            {book.progress?.total || 0}
                </Badge>
              </div>
              <CardTitle className="text-lg">
                {book.title}
              </CardTitle>
              <CardDescription className="font-medium">
                {book.author}
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                {book.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>
              {Math.round(
                ((book.progress?.completed || 0) /
                  (book.progress?.total || 1)) *
                  100,
              )}
              %
            </span>
                </div>
                <Progress
            value={
              ((book.progress?.completed || 0) /
                (book.progress?.total || 1)) *
              100
            }
            className="h-2"
                />
              </div>
              <Button
                onClick={() => onNavigateToBook(book.id)}
                className="w-full"
                variant={
            (book.progress?.completed || 0) === 0
              ? "main-cta"
              : "outline"
                }
              >
                <Play className="w-4 h-4 mr-2" />
                {(book.progress?.completed || 0) === 0
            ? "Commencer"
            : "Continuer"}
              </Button>
            </CardContent>
          </Card>
              ))}
          </div>
        </div>

        {/* Methodology and Themes Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Méthodologie et thèmes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${methodology.color}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <Badge variant="secondary">
                    {methodology.progress?.completed || 0}/
                    {methodology.progress?.total || 0}
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {methodology.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {methodology.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>
                      {Math.round(
                        ((methodology.progress?.completed ||
                          0) /
                          (methodology.progress?.total || 1)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      ((methodology.progress?.completed || 0) /
                        (methodology.progress?.total || 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <Button
                  onClick={onNavigateToMethodology}
                  className="w-full"
                  variant={
                    (methodology.progress?.completed || 0) === 0
                      ? "main-cta"
                      : "outline"
                  }
                >
                  <Play className="w-4 h-4 mr-2" />
                  {(methodology.progress?.completed || 0) === 0
                    ? "Commencer"
                    : "Continuer"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-pink-50 border-pink-200 cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <Badge variant="secondary" className="text-xs self-start">
                    {themeProgress?.completed || 0} / {themeProgress?.total || 0}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">
                  Thèmes transversaux
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Explorez les connexions entre les œuvres et les grands thèmes philosophiques
                </CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>
                      {themeProgress?.total
                        ? Math.round((themeProgress.completed / themeProgress.total) * 100)
                        : 0
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (themeProgress?.completed || 0) / (themeProgress?.total || 1) * 100
                    }
                    className="h-2"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="main-cta"
                  className="w-full"
                  onClick={() => onNavigateToThemes()}
                >
                  Accéder aux thèmes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}