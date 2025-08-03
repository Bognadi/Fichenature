import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, CheckCircle2, Circle, GraduationCap, FileText, Lightbulb, BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default function MethodologySection({ methodology, onBack, onProgress }) {
  const [completedFiches, setCompletedFiches] = useState(new Set(methodology.progress.fichesSeen));
  const [expandedFiche, setExpandedFiche] = useState(null);

  const markFicheComplete = (ficheId) => {
    if (!completedFiches.has(ficheId)) {
      setCompletedFiches(prev => new Set([...prev, ficheId]));
      onProgress(methodology.id, ficheId);
    }
  };

  const methodologyFiches = [
    {
      id: 'methodo-1',
      title: 'La dissertation philosophique',
      group: 'Méthodologie générale',
      summary: 'Structure et méthode pour réussir la dissertation philosophique en PCSI',
      detailedSections: [
        {
          title: 'Introduction',
          content: 'L\'introduction doit poser le problème philosophique, définir les termes du sujet et annoncer le plan. Elle comprend une accroche, une définition des termes, la problématisation et l\'annonce du plan.'
        },
        {
          title: 'Développement',
          content: 'Le développement s\'articule généralement en trois parties : thèse, antithèse, synthèse ou trois aspects du problème. Chaque partie doit contenir des arguments, des exemples et des références aux auteurs.'
        },
        {
          title: 'Conclusion',
          content: 'La conclusion reprend les résultats de l\'analyse, répond à la problématique et peut ouvrir sur une question plus large.'
        }
      ],
      concepts: ['Problématisation', 'Argumentation', 'Plan dialectique'],
      questions: ['Comment bien problématiser un sujet ?', 'Quelle structure adopter pour le développement ?']
    },
    {
      id: 'methodo-2',
      title: 'L\'explication de texte',
      group: 'Méthodologie générale',
      summary: 'Méthode pour analyser et expliquer un texte philosophique',
      detailedSections: [
        {
          title: 'Lecture et compréhension',
          content: 'Première étape : lecture attentive du texte, identification du thème, de la thèse et de la structure argumentative de l\'auteur.'
        },
        {
          title: 'Analyse linéaire',
          content: 'Explication ligne par ligne du texte en montrant la progression de la pensée, les arguments utilisés et les concepts mobilisés.'
        },
        {
          title: 'Discussion critique',
          content: 'Évaluation critique des arguments de l\'auteur, confrontation avec d\'autres positions philosophiques.'
        }
      ],
      concepts: ['Analyse linéaire', 'Thèse', 'Arguments'],
      questions: ['Comment identifier la structure d\'un texte ?', 'Quelle attitude critique adopter ?']
    },
    {
      id: 'methodo-3',
      title: 'L\'analyse thématique transversale',
      group: 'Thème "L\'expérience de la nature"',
      summary: 'Comment analyser les thèmes communs aux trois œuvres du programme',
      detailedSections: [
        {
          title: 'Identifier les thèmes communs',
          content: 'Repérer les concepts qui traversent les trois œuvres : nature/culture, science/expérience, technique/vivant, etc.'
        },
        {
          title: 'Comparer les approches',
          content: 'Analyser comment chaque auteur aborde différemment les mêmes questions fondamentales.'
        },
        {
          title: 'Synthèse philosophique',
          content: 'Construire une réflexion cohérente qui mobilise les trois œuvres pour éclairer le thème de l\'expérience de la nature.'
        }
      ],
      concepts: ['Transversalité', 'Comparaison', 'Synthèse'],
      questions: ['Comment articuler les trois œuvres ?', 'Quels sont les enjeux du thème ?']
    },
    {
      id: 'methodo-4',
      title: 'Utilisation des citations',
      group: 'Techniques rédactionnelles',
      summary: 'Comment bien citer et analyser les passages des œuvres au programme',
      detailedSections: [
        {
          title: 'Choix des citations',
          content: 'Sélectionner des passages significatifs qui illustrent précisément l\'argument développé.'
        },
        {
          title: 'Intégration dans le développement',
          content: 'Présenter la citation, l\'analyser et montrer son lien avec l\'argumentation générale.'
        },
        {
          title: 'Analyse conceptuelle',
          content: 'Expliquer les concepts clés présents dans la citation et leur portée philosophique.'
        }
      ],
      concepts: ['Citation', 'Analyse', 'Contextualisation'],
      questions: ['Quand citer ?', 'Comment analyser une citation ?']
    },
    {
      id: 'methodo-5',
      title: 'Problématisation et enjeux',
      group: 'Techniques philosophiques',
      summary: 'Apprendre à problématiser les questions liées à l\'expérience de la nature',
      detailedSections: [
        {
          title: 'Qu\'est-ce que problématiser ?',
          content: 'Problématiser, c\'est transformer une question simple en problème philosophique en montrant les tensions et les difficultés qu\'elle soulève.'
        },
        {
          title: 'Les enjeux du thème',
          content: 'L\'expérience de la nature interroge nos rapports au vivant, à la science, à la technique et à notre propre humanité.'
        },
        {
          title: 'Formulation de problématiques',
          content: 'Exemples de problématiques : "L\'expérience de la nature nous éloigne-t-elle ou nous rapproche-t-elle de notre humanité ?"'
        }
      ],
      concepts: ['Problématique', 'Enjeux', 'Tensions conceptuelles'],
      questions: ['Comment bien problématiser ?', 'Quels sont les enjeux majeurs du thème ?']
    },
    {
      id: 'methodo-6',
      title: 'La synthèse des trois œuvres',
      group: 'Synthèse du programme',
      summary: 'Méthode pour construire une vision d\'ensemble cohérente du programme',
      detailedSections: [
        {
          title: 'Points de convergence',
          content: 'Identifier les points communs : tous trois interrogent le rapport entre nature et culture, science et expérience.'
        },
        {
          title: 'Spécificités de chaque œuvre',
          content: 'Canguilhem : épistémologie du vivant ; Verne : rapport technique à la nature ; Haushofer : expérience existentielle de la nature.'
        },
        {
          title: 'Construction d\'une problématique d\'ensemble',
          content: 'Comment articuler ces trois approches pour penser l\'expérience contemporaine de la nature ?'
        }
      ],
      concepts: ['Synthèse', 'Complémentarité', 'Vision d\'ensemble'],
      questions: ['Quelle cohérence entre les trois œuvres ?', 'Comment les articuler dans une copie ?']
    }
  ];

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
            <h1 className="text-3xl font-bold">{methodology.title}</h1>
            <p className="text-lg text-muted-foreground">{methodology.description}</p>
          </div>
          <Badge variant="secondary">
            {methodology.progress.completed} / {methodology.progress.total} fiches vues
          </Badge>
        </div>

        <Card className={methodology.color}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Fiches méthodologiques pour le programme PCSI
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Fiches Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Fiches méthodologiques</h2>
          <div className="grid gap-4">
            {methodologyFiches.map((fiche) => {
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
                        <h4 className="font-semibold">Développement détaillé</h4>
                        {fiche.detailedSections.map((section, index) => (
                          <div key={index} className="space-y-2">
                            <h5 className="font-medium text-sm">{section.title}</h5>
                            <p className="text-sm text-muted-foreground">{section.content}</p>
                          </div>
                        ))}
                        
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