import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, FileText, Lightbulb } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default function BookSection({ book, fiches, onBack, onProgress }) {
  const [completedFiches, setCompletedFiches] = useState(new Set(book.progress.fichesSeen));
  const [expandedFiche, setExpandedFiche] = useState(null);

  const markFicheComplete = (ficheId) => {
    if (!completedFiches.has(ficheId)) {
      setCompletedFiches(prev => new Set([...prev, ficheId]));
      onProgress(book.id, ficheId);
    }
  };

  const toggleFicheExpansion = (ficheId) => {
    setExpandedFiche(expandedFiche === ficheId ? null : ficheId);
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
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-muted-foreground">{book.author}</p>
          </div>
          <Badge variant="secondary">
            {book.progress.completed} / {book.progress.total} fiches vues
          </Badge>
        </div>

        <Card className={book.color}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {book.description}
            </CardTitle>
            {/* Add citation below description if present */}
            {book.citation && (
              <CardDescription className="mt-2 italic text-base text-gray-600">
                {book.citation}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Fiches Content */}
        <Tabs defaultValue="fiches" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fiches">Fiches de lecture</TabsTrigger>
            <TabsTrigger value="themes">Thèmes clés</TabsTrigger>
          </TabsList>

          <TabsContent value="fiches" className="space-y-4">
            <div className="grid gap-4">
              {fiches.map((fiche) => {
                const isCompleted = completedFiches.has(fiche.id);
                const isExpanded = expandedFiche === fiche.id;
                
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
                                <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                                <Circle className="h-5 w-5 text-muted-foreground" />
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
                            {fiche.summary}
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
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Concepts clés
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {fiche.concepts.map((concept, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => toggleFicheExpansion(fiche.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
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
                          <h4 className="font-semibold">
                            {fiche.type === "citations" ? "Citations" : "Analyse détaillée"}
                          </h4>
                          {fiche.type === "citations" && Array.isArray(fiche.detailedSections) ? (
                            fiche.detailedSections.map((section, index) => (
                              <div key={index} className="space-y-2">
                                <h5 className="font-medium text-sm">{section.title}</h5>
                                <p className="text-sm text-muted-foreground">{section.content}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {fiche.content}
                            </p>
                          )}

                          {fiche.questions && fiche.questions.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Questions de réflexion
                              </h5>
                              <ul className="space-y-1">
                                {fiche.questions.map((question, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">
                                    • {question}
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
          </TabsContent>

          <TabsContent value="themes">
            <Card>
              <CardHeader>
                <CardTitle>Thèmes transversaux</CardTitle>
                <CardDescription>
                  Connexions avec les autres œuvres du programme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="nature-technique">
                    <AccordionTrigger>Nature et technique</AccordionTrigger>
                    <AccordionContent>
                      Comment cette œuvre interroge-t-elle le rapport entre nature et technique ? 
                      Quels sont les points de convergence avec les autres textes du programme ?
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="connaissance-science">
                    <AccordionTrigger>Connaissance et science</AccordionTrigger>
                    <AccordionContent>
                      Quelle conception de la connaissance scientifique se dégage de cette œuvre ?
                      Comment dialogue-t-elle avec les approches des autres auteurs ?
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="experience-vecu">
                    <AccordionTrigger>Expérience et vécu</AccordionTrigger>
                    <AccordionContent>
                      Quel rôle joue l'expérience vécue dans la compréhension de la nature ?
                      Comment cette dimension s'articule-t-elle aux autres œuvres ?
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}