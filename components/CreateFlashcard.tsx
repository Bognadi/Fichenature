import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateFlashcard({ onBack, onCreateFlashcard }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    difficulty: 'medium'
  });

  const categories = [
    'La Connaissance de la vie',
    'Vingt mille lieues sous les mers', 
    'Le Mur invisible',
    'Thèmes transversaux',
    'Méthodologie',
    'Concepts clés'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim() || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onCreateFlashcard({
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      category: formData.category,
      difficulty: formData.difficulty
    });

    toast.success('Flashcard créée avec succès !');
    
    // Reset form
    setFormData({
      question: '',
      answer: '',
      category: '',
      difficulty: 'medium'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Créer une flashcard</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle flashcard
            </CardTitle>
            <CardDescription>
              Créez une flashcard personnalisée pour réviser un concept, une citation ou une analyse
            </CardDescription>
          </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                <SelectValue placeholder="Choisissez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                  {category}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              </div>

              {/* Question */}
              <div className="space-y-2">
              <Label htmlFor="question">Question / Concept *</Label>
              <Textarea
                id="question"
                placeholder="Ex: Que signifie 'le vivant et son milieu' selon Canguilhem ?"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
              />
              </div>

              {/* Answer */}
              <div className="space-y-2">
              <Label htmlFor="answer">Réponse / Explication *</Label>
              <Textarea
                id="answer"
                placeholder="Développez votre réponse avec les éléments clés, citations importantes, exemples..."
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                rows={6}
              />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
              <Label htmlFor="difficulty">Niveau de difficulté</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
                </SelectContent>
              </Select>
              </div>

              <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Annuler
              </Button>
              <Button type="submit" variant="main-cta" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Créer la flashcard
              </Button>
              </div>
            </form>
            </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conseils pour créer des flashcards efficaces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Formulez des questions précises et concises</p>
            <p>• Incluez des citations importantes avec leur contexte</p>
            <p>• Connectez les concepts entre les différentes œuvres</p>
            <p>• Utilisez vos propres mots pour expliquer les concepts</p>
            <p>• N'hésitez pas à créer plusieurs cartes pour un même thème complexe</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}