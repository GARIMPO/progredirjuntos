import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Goal } from '@/types';

interface EditGoalFormProps {
  goal: Goal;
  onCancel: () => void;
  onSave: (goal: { title: string; objective: string; details?: string }) => void;
}

const EditGoalForm = ({ goal, onCancel, onSave }: EditGoalFormProps) => {
  const [title, setTitle] = useState(goal.title);
  const [objective, setObjective] = useState(goal.objective);
  const [details, setDetails] = useState(goal.details || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objective.trim()) return;
    
    onSave({
      title: title.trim(),
      objective: objective.trim(),
      details: details.trim() || undefined
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Editar Meta</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="objective" className="text-sm font-medium">
              Objetivo
            </label>
            <Input
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">
              Detalhes (opcional)
            </label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditGoalForm; 