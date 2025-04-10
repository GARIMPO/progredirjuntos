import React from "react";
import { useAppContext } from "@/context/AppContext";
import ProfileCard from "@/components/ProfileCard";
import MessagePanel from "@/components/MessagePanel";
import GoalItem from "@/components/GoalItem";
import AddGoalForm from "@/components/AddGoalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trophy, Mail, ArchiveIcon, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import BeatingHeart from "@/components/BeatingHeart";

const Index = () => {
  const { profiles, goals, activeMessage, isLoading } = useAppContext();
  const isMobile = useIsMobile();
  
  const activeGoals = goals.filter(goal => !goal.archived);
  const archivedGoals = goals.filter(goal => goal.archived);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-love-dark" />
          <p className="text-lg text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-love-dark">
          Progredir Juntos <BeatingHeart size={28} />
        </h1>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 mb-8 relative mx-auto">
        {profiles.slice(0, 2).map((profile, index) => (
          <ProfileCard 
            key={profile.id} 
            profile={profile} 
          />
        ))}
      </div>

      {activeMessage && (
        <div className="mb-8 animate-fade-in">
          <MessagePanel 
            sender={profiles.find(p => p.id !== activeMessage)!}
            receiver={profiles.find(p => p.id === activeMessage)!}
          />
        </div>
      )}

      <Separator className="my-8" />

      <section className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <Trophy size={24} className="mr-2 text-love-dark" />
            Metas do Casal
          </h2>
          <AddGoalForm />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="flex gap-2">
              <Trophy size={16} />
              Metas Ativas ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex gap-2">
              <ArchiveIcon size={16} />
              Arquivadas ({archivedGoals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Nenhuma meta ativa. Adicione uma meta para começar!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeGoals.map(goal => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="archived">
            {archivedGoals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Nenhuma meta arquivada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {archivedGoals.map(goal => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Index;
