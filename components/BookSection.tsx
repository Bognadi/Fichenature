import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, FileText, Lightbulb } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default function BookSection({ book, onBack, onProgress }) {
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

  const getFichesForBook = (bookId) => {
    const fichesData = {
      'connaissance-vie': [
        {
          id: 'canguilhem-1',
          title: 'Le vivant et son milieu',
          group: 'La Connaissance de la vie - Chapitre 1',
          summary: 'Analyse de la relation fondamentale entre l\'organisme et son environnement selon Canguilhem. Introduction des concepts de milieu géographique et milieu biologique.',
          detailedSections: [
            {
              title: 'Le milieu géographique vs milieu biologique',
              content: 'Canguilhem distingue le milieu géographique (donné objectif) du milieu biologique (construit par l\'organisme). Cette distinction est fondamentale pour comprendre l\'originalité du vivant.'
            },
            {
              title: 'L\'adaptation comme processus actif',
              content: 'L\'adaptation n\'est pas une simple soumission passive aux conditions extérieures, mais un processus actif par lequel l\'organisme transforme son milieu autant qu\'il s\'y adapte.'
            },
            {
              title: 'La normativité vitale',
              content: 'Le vivant instaure ses propres normes et valeurs. Il ne subit pas passivement son milieu mais l\'évalue et le transforme selon ses besoins vitaux.'
            }
          ],
          concepts: ['Milieu', 'Adaptation', 'Norme biologique', 'Normativité'],
          questions: ['Qu\'est-ce qui distingue le milieu géographique du milieu biologique ?', 'Comment l\'organisme construit-il son milieu ?']
        },
        {
          id: 'canguilhem-2',
          title: 'La théorie cellulaire',
          group: 'La Connaissance de la vie - Chapitre 2',
          summary: 'Étude historique et épistémologique de la découverte de la cellule et de son impact sur la compréhension du vivant.',
          detailedSections: [
            {
              title: 'Histoire de la découverte cellulaire',
              content: 'De Hooke à Schwann, retrace l\'évolution de la compréhension de la cellule comme unité du vivant, en lien avec le développement des techniques d\'observation.'
            },
            {
              title: 'Technique et connaissance',
              content: 'Le microscope ne révèle pas seulement des structures invisibles, il transforme notre conception même du vivant et de ses propriétés.'
            },
            {
              title: 'Réductionnisme et totalité',
              content: 'La théorie cellulaire pose la question du rapport entre partie et tout : la cellule est-elle la réduction du vivant ou son expression élémentaire ?'
            }
          ],
          concepts: ['Cellule', 'Microscopie', 'Théorie scientifique', 'Technique'],
          questions: ['Comment la technique influence-t-elle la connaissance du vivant ?', 'Quel rapport entre partie et totalité dans le vivant ?']
        },
        {
          id: 'canguilhem-3',
          title: 'Expérimentation et connaissance du vivant',
          group: 'La Connaissance de la vie - Chapitre 3',
          summary: 'Claude Bernard et la méthode expérimentale appliquée au vivant. Possibilités et limites de l\'approche expérimentale en biologie.',
          detailedSections: [
            {
              title: 'La méthode expérimentale de Claude Bernard',
              content: 'Présentation de l\'Introduction à l\'étude de la médecine expérimentale et de ses principes : observation, hypothèse, expérience, conclusion.'
            },
            {
              title: 'Déterminisme et vivant',
              content: 'Le vivant peut-il être entièrement soumis au déterminisme scientifique ? Tension entre la complexité du vivant et l\'exigence de rigueur expérimentale.'
            },
            {
              title: 'Pathologie et normalité',
              content: 'L\'expérimentation révèle les mécanismes normaux à travers l\'étude du pathologique. Mais peut-on réduire la vie à ses mécanismes ?'
            }
          ],
          concepts: ['Méthode expérimentale', 'Déterminisme', 'Pathologie', 'Claude Bernard'],
          questions: ['Le vivant peut-il être entièrement soumis à la méthode expérimentale ?', 'Quel rôle de la pathologie dans la connaissance du normal ?']
        },
        {
          id: 'canguilhem-4',
          title: 'Normal et pathologique',
          group: 'La Connaissance de la vie - Chapitre 4',
          summary: 'La distinction fondamentale entre normalité et pathologie dans le vivant. Critique de la conception quantitative de la maladie.',
          detailedSections: [
            {
              title: 'Critique du positivisme médical',
              content: 'Broussais et l\'école positiviste réduisent la maladie à un excès ou un défaut quantitatif. Canguilhem montre les limites de cette approche.'
            },
            {
              title: 'La normativité du vivant',
              content: 'Le vivant est normatif : il instaure ses propres normes de vie. La santé n\'est pas l\'absence de maladie mais la capacité de créer de nouvelles normes.'
            },
            {
              title: 'Individualité et norme',
              content: 'Chaque individu a sa norme propre. Il n\'y a pas de norme universelle de la santé, mais des capacités individuelles d\'adaptation.'
            }
          ],
          concepts: ['Norme', 'Pathologie', 'Normalité', 'Valeur vitale', 'Broussais'],
          questions: ['Qu\'est-ce qui définit la norme du vivant ?', 'La maladie est-elle quantitative ou qualitative ?']
        }
      ],
      'vingt-mille-lieues': [
        {
          id: 'verne-1',
          title: 'La science et l\'exploration',
          group: 'Vingt mille lieues - Thème transversal',
          summary: 'L\'approche scientifique de la nature chez Verne : observation, classification, domination technique du monde naturel.',
          detailedSections: [
            {
              title: 'Le savant explorateur',
              content: 'Aronnax incarne le savant du XIXe siècle : observer, classer, comprendre. Mais aussi dominer et exploiter la nature.'
            },
            {
              title: 'Science et merveilleux',
              content: 'Chez Verne, la science ne désenchante pas le monde mais révèle de nouveaux mystères. L\'océan reste un espace de découverte infinie.'
            },
            {
              title: 'Positivisme et limites',
              content: 'La confiance positiviste dans le progrès scientifique se heurte aux mystères de Nemo et aux limites de la connaissance humaine.'
            }
          ],
          concepts: ['Science', 'Exploration', 'Progrès technique', 'Positivisme'],
          questions: ['Comment la science transforme-t-elle notre rapport à la nature ?', 'Quelles sont les limites de l\'approche scientifique ?']
        },
        {
          id: 'verne-2',
          title: 'Le Nautilus et la maîtrise technique',
          group: 'Vingt mille lieues - Analyse symbolique',
          summary: 'Le sous-marin comme symbole de la domination technique de la nature. Ambivalence entre libération et enfermement.',
          detailedSections: [
            {
              title: 'Prouesse technique et autonomie',
              content: 'Le Nautilus représente l\'aboutissement de la technique : autonomie énergétique, indépendance vis-à-vis du monde terrestre.'
            },
            {
              title: 'Domination et isolement',
              content: 'La technique permet de maîtriser la nature mais isole l\'homme. Le Nautilus est à la fois refuge et prison.'
            },
            {
              title: 'Nature artificielle',
              content: 'À bord du Nautilus, tout est reconstitué artificiellement : bibliothèque, salon, même la nature devient décor.'
            }
          ],
          concepts: ['Technique', 'Domination', 'Artifice', 'Autonomie'],
          questions: ['La technique nous éloigne-t-elle de la nature ?', 'Que symbolise le Nautilus ?']
        },
        {
          id: 'verne-3',
          title: 'L\'océan comme espace naturel',
          group: 'Vingt mille lieues - Géographie philosophique',
          summary: 'L\'océan comme dernière frontière naturelle, espace de liberté mais aussi de mystère et de danger.',
          detailedSections: [
            {
              title: 'L\'océan, dernier territoire vierge',
              content: 'En 1870, l\'océan représente le dernier espace non cartographié, non domestiqué par l\'homme moderne.'
            },
            {
              title: 'Liberté et anarchie',
              content: 'Pour Nemo, l\'océan est l\'espace de la liberté absolue, hors des lois terrestres. Mais cette liberté confine à l\'anarchie.'
            },
            {
              title: 'Nature sublime et terrifiante',
              content: 'L\'océan révèle la dimension sublime de la nature : beauté fascinante mais aussi puissance destructrice.'
            }
          ],
          concepts: ['Nature sauvage', 'Territoire', 'Conquête', 'Sublime'],
          questions: ['Que représente l\'océan dans notre rapport à la nature ?', 'L\'exploration épuise-t-elle le mystère naturel ?']
        }
      ],
      'mur-invisible': [
        {
          id: 'haushofer-1',
          title: 'L\'isolement et la nature',
          group: 'Le Mur invisible - Thème central',
          summary: 'La relation entre solitude radicale et retour à la nature. L\'isolement comme révélateur de notre condition.',
          detailedSections: [
            {
              title: 'L\'isolement comme expérience limite',
              content: 'Le mur invisible crée une situation d\'isolement radical qui révèle la fragilité de notre rapport civilisé à la nature.'
            },
            {
              title: 'Retour forcé à la nature',
              content: 'Privée de la société humaine, la narratrice doit réapprendre à vivre avec la nature, retrouver des gestes primitifs.'
            },
            {
              title: 'Solitude et authenticité',
              content: 'L\'isolement révèle ce qui est essentiel : la relation aux animaux, aux plantes, aux rythmes naturels.'
            }
          ],
          concepts: ['Isolement', 'Solitude', 'Retour à la nature', 'Authenticité'],
          questions: ['L\'isolement peut-il révéler notre vraie nature ?', 'Que nous apprend la solitude sur notre humanité ?']
        },
        {
          id: 'haushofer-2',
          title: 'La survie et l\'instinct',
          group: 'Le Mur invisible - Anthropologie philosophique',
          summary: 'Comment l\'extrême nécessité de survivre révèle l\'animalité en nous et transforme notre rapport au vivant.',
          detailedSections: [
            {
              title: 'Nécessité vitale et transformation',
              content: 'La survie impose ses règles : la narratrice doit abandonner ses habitudes bourgeoises pour des gestes vitaux.'
            },
            {
              title: 'Animalité retrouvée',
              content: 'L\'instinct de survie réveille une animalité enfouie : relation directe au corps, aux besoins, aux cycles naturels.'
            },
            {
              title: 'Violence nécessaire',
              content: 'Pour survivre, il faut parfois tuer. Cette violence révèle la dure réalité de notre condition d\'être vivant.'
            }
          ],
          concepts: ['Survie', 'Instinct', 'Animalité', 'Violence'],
          questions: ['Que révèle la nécessité de survivre sur la condition humaine ?', 'L\'instinct efface-t-il la culture ?']
        }
      ]
    };
    return fichesData[bookId] || [];
  };

  const fiches = getFichesForBook(book.id);

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
                          <h4 className="font-semibold">Analyse détaillée</h4>
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