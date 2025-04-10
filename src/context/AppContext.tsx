import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileData, Message, Goal } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/use-supabase";
import { useToast } from "@/hooks/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface AppContextType {
  profiles: ProfileData[];
  goals: Goal[];
  messages: Message[];
  isLoading: boolean;
  activeMessage: string | null;
  setActiveMessage: (id: string | null) => void;
  updateProfile: (profile: ProfileData) => void;
  sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateMessage: (id: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "completed" | "archived">) => void;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  completeGoal: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  profiles: [],
  goals: [],
  messages: [],
  isLoading: true,
  activeMessage: null,
  setActiveMessage: () => {},
  updateProfile: () => {},
  sendMessage: () => {},
  updateMessage: async () => {},
  deleteMessage: async () => {},
  addGoal: () => {},
  updateGoal: async () => {},
  deleteGoal: async () => {},
  completeGoal: () => {},
});

export const useAppContext = () => useContext(AppContext);

// Dados iniciais vazios
const initialProfiles: ProfileData[] = [];
const initialGoals: Goal[] = [];

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profiles, setProfiles] = useState<ProfileData[]>(initialProfiles);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar perfis do Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedProfiles: ProfileData[] = data.map(profile => ({
            id: profile.id,
            name: profile.name,
            image: profile.image,
            phone: profile.phone,
            email: profile.email,
            wishlist: profile.wishlist
          }));
          setProfiles(formattedProfiles);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    
    const fetchGoals = async () => {
      try {
        const { data, error } = await supabase.from('goals').select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedGoals: Goal[] = data.map(goal => ({
            id: goal.id,
            title: goal.title,
            objective: goal.objective,
            details: goal.details || "",
            completed: goal.completed,
            archived: goal.archived,
            createdAt: new Date(goal.created_at),
          }));
          setGoals(formattedGoals);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase.from('messages').select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedMessages: Message[] = data.map(message => ({
            id: message.id,
            senderId: message.sender_id,
            receiverId: message.receiver_id,
            content: message.content,
            timestamp: new Date(message.timestamp),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
    fetchGoals();
    fetchMessages();
  }, []);

  // Configurar escuta de eventos em tempo real
  useRealtimeSubscription('profiles', (payload: any) => {
    const { eventType, new: newProfile, old: oldProfile } = payload;
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const profile = newProfile as any;
      setProfiles(prev => {
        const exists = prev.some(p => p.id === profile.id);
        if (exists) {
          return prev.map(p => p.id === profile.id ? {
            ...p,
            name: profile.name,
            image: profile.image,
            phone: profile.phone,
            email: profile.email,
            wishlist: profile.wishlist
          } : p);
        } else {
          return [...prev, {
            id: profile.id,
            name: profile.name,
            image: profile.image,
            phone: profile.phone,
            email: profile.email,
            wishlist: profile.wishlist
          }];
        }
      });
    }
  }, ['INSERT', 'UPDATE']);
  
  useRealtimeSubscription('goals', (payload: any) => {
    const { eventType, new: newGoal, old: oldGoal } = payload;
    if (eventType === 'INSERT') {
      const goal = newGoal as any;
      setGoals(prev => [...prev, {
        id: goal.id,
        title: goal.title,
        objective: goal.objective,
        details: goal.details || "",
        completed: goal.completed,
        archived: goal.archived,
        createdAt: new Date(goal.created_at),
      }]);
    } else if (eventType === 'UPDATE') {
      const goal = newGoal as any;
      setGoals(prev => prev.map(g => g.id === goal.id ? {
        ...g,
        title: goal.title,
        objective: goal.objective,
        details: goal.details || "",
        completed: goal.completed,
        archived: goal.archived,
      } : g));
    }
  }, ['INSERT', 'UPDATE']);
  
  useRealtimeSubscription('messages', (payload: any) => {
    const { eventType, new: newMessage, old: oldMessage } = payload;
    if (eventType === 'INSERT') {
      const message = newMessage as any;
      setMessages(prev => [...prev, {
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        content: message.content,
        timestamp: new Date(message.timestamp),
      }]);
    } else if (eventType === 'UPDATE') {
      const message = newMessage as any;
      setMessages(prev => prev.map(m => m.id === message.id ? {
        ...m,
        content: message.content,
      } : m));
    } else if (eventType === 'DELETE') {
      const message = oldMessage as any;
      setMessages(prev => prev.filter(m => m.id !== message.id));
    }
  }, ['INSERT', 'UPDATE', 'DELETE']);
  
  // Atualizar perfil
  const updateProfile = async (updatedProfile: ProfileData) => {
    try {
      // Update local state first for immediate UI response
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === updatedProfile.id ? updatedProfile : profile
        )
      );
      
      // Then update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedProfile.name,
          image: updatedProfile.image,
          phone: updatedProfile.phone,
          email: updatedProfile.email,
          wishlist: updatedProfile.wishlist || []
        })
        .eq('id', updatedProfile.id);
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Enviar mensagem
  const sendMessage = async (message: Omit<Message, "id" | "timestamp">) => {
    try {
      const timestamp = new Date();
      
      // Insert to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          content: message.content,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        content: data.content,
        timestamp: new Date(data.timestamp),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setActiveMessage(null);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso!",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Atualizar mensagem
  const updateMessage = async (id: string, updates: Partial<Message>) => {
    try {
      // Update local state first for immediate UI response
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === id ? { ...message, ...updates } : message
        )
      );
      
      // Then update in Supabase
      const { error } = await supabase
        .from('messages')
        .update({
          content: updates.content,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Mensagem atualizada",
        description: "Sua mensagem foi atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Excluir mensagem
  const deleteMessage = async (id: string) => {
    try {
      // Delete from Supabase first
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Then update local state
      setMessages(prevMessages =>
        prevMessages.filter(message => message.id !== id)
      );
      
      toast({
        title: "Mensagem excluída",
        description: "Sua mensagem foi excluída com sucesso!",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Adicionar meta
  const addGoal = async (goalData: Omit<Goal, "id" | "createdAt" | "completed" | "archived">) => {
    try {
      // Insert to Supabase
      const { data, error } = await supabase
        .from('goals')
        .insert({
          title: goalData.title,
          objective: goalData.objective,
          details: goalData.details,
          completed: false,
          archived: false,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        objective: data.objective,
        details: data.details || "",
        completed: data.completed,
        archived: data.archived,
        createdAt: new Date(data.created_at),
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      toast({
        title: "Meta adicionada",
        description: "Sua nova meta foi adicionada com sucesso!",
      });
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a meta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Atualizar meta
  const updateGoal = async (id: string, data: Partial<Goal>) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, ...data } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Completar meta
  const completeGoal = (id: string) => {
    updateGoal(id, { completed: true });
  };

  const value = {
    profiles,
    goals,
    messages,
    isLoading,
    activeMessage,
    setActiveMessage,
    updateProfile,
    sendMessage,
    updateMessage,
    deleteMessage,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
