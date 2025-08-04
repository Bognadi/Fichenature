import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Lightbulb, FileText, TrendingUp } from 'lucide-react';

// Helper to render **bold** text
function renderBold(text: string) {
  // Replace **text** with <strong>text</strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

export default function ThemeSection({ fiches, onBack, themeProgress, onProgress }) {
  const [expandedFiche, setExpandedFiche] = useState(null);

  const markFicheComplete = (ficheId) => {
    if (!themeProgress.fichesSeen.includes(ficheId)) {
      onProgress(ficheId);
    }
  };

  const toggleFicheExpansion = (ficheId) => {
    setExpandedFiche(expandedFiche === ficheId ? null : ficheId);
    markFicheComplete(ficheId);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Thèmes transversaux</h1>
          </div>
          <Badge variant="secondary">
            {themeProgress.completed} / {themeProgress.total} fiches vues
          </Badge>
        </div>
        <Card className="bg-pink-50 border-pink-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thèmes transversaux du programme
                </CardTitle>
                <CardDescription>
                  Analysez les grands axes reliant les œuvres au programme.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs self-start">
                {themeProgress.completed} / {themeProgress.total}
              </Badge>
            </div>
          </CardHeader>
        </Card>
        {/* --- END: Methodology-style theme card --- */}

        {/* Fiches Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Fiches thématiques</h2>
          <div className="grid gap-4">
            {fiches.map((fiche) => {
              const isExpanded = expandedFiche === fiche.id;
              const isCompleted = themeProgress.fichesSeen.includes(fiche.id);
              return (
                <Card key={fiche.id} className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markFicheComplete(fiche.id)}
                            className="p-0 h-6 w-6"
                          >
                            {isCompleted ? 
                              <span className="text-green-600 font-bold">✓</span> : 
                              <span className="text-muted-foreground">○</span>
                            }
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            {fiche.group}
                          </Badge>
                        </div>
                        <CardTitle className={`text-lg ${isCompleted ? 'text-green-800' : ''}`}>
                          {fiche.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                          {renderBold(fiche.summary)}
                        </p>
                      </div>
                      {/* Fiche number badge */}
                      {fiche.fiche_numero && (
                        <Badge variant="secondary" className="ml-2 text-xs self-start">
                          #{fiche.fiche_numero}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Concepts clés
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {fiche.concepts.map((concept, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {renderBold(concept)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleFicheExpansion(fiche.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        {isExpanded ? 'Masquer le détail' : 'Voir le détail'}
                      </Button>
                      {!isCompleted && (
                        <Button
                          onClick={() => markFicheComplete(fiche.id)}
                          className="flex-1"
                        >
                          Marquer comme vue
                        </Button>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                        <h4 className="font-semibold">Développement</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {renderBold(fiche.content)}
                        </p>
                        {fiche.questions && fiche.questions.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Questions de réflexion
                            </h5>
                            <ul className="space-y-1">
                              {fiche.questions.map((question, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  • {renderBold(question)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
