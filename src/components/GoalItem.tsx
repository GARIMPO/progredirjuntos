import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Archive, Trash2, Pencil } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import EditGoalForm from './EditGoalForm';
import { Goal } from '@/types';

interface GoalItemProps {
  goal: Goal;
}

const GoalItem = ({ goal }: GoalItemProps) => {
  const { updateGoal, deleteGoal } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleComplete = async () => {
    await updateGoal(goal.id, { completed: !goal.completed });
  };

  const handleArchive = async () => {
    await updateGoal(goal.id, { archived: !goal.archived });
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      await deleteGoal(goal.id);
    }
  };

  const handleSave = async (updatedGoal: { title: string; objective: string; details?: string }) => {
    await updateGoal(goal.id, updatedGoal);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditGoalForm
        goal={goal}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">{goal.title}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleArchive}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{goal.objective}</p>
        {goal.details && (
          <p className="mt-2 text-sm text-gray-500">{goal.details}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant={goal.completed ? "default" : "outline"}
          className="w-full"
          onClick={handleComplete}
        >
          {goal.completed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Concluída
            </>
          ) : (
            'Marcar como concluída'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalItem;
