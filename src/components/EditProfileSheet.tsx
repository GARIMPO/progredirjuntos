import React, { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, Upload } from "lucide-react";
import { ProfileData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { uploadImage, deleteImage } from "@/lib/storage";

interface EditProfileSheetProps {
  profile: ProfileData;
  onProfileUpdate: (profile: ProfileData) => void;
}

const EditProfileSheet: React.FC<EditProfileSheetProps> = ({ profile, onProfileUpdate }) => {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || "");
  const [email, setEmail] = useState(profile.email || "");
  const [image, setImage] = useState(profile.image);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { updateProfile } = useSupabase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create a preview for immediate feedback
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Delete old image if it exists and is not a default image
      if (profile.image && !profile.image.includes('placeholder.svg')) {
        await deleteImage(profile.image);
      }
      
      // Upload new image
      const newImageUrl = await uploadImage(file, profile.id);
      setImage(newImageUrl);
      
      toast({
        title: "Imagem atualizada",
        description: "A imagem do perfil foi atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedProfile = await updateProfile(profile.id, {
        name,
        image,
        phone,
        email,
      });
      
      onProfileUpdate(updatedProfile);
      
      toast({
        title: "Perfil atualizado",
        description: "As informações do seu perfil foram atualizadas com sucesso!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <PencilIcon size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              <Upload size={16} />
              {isUploading ? "Enviando..." : "Alterar Foto"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="exemplo@email.com"
            />
          </div>
          
          <Button type="submit" className="w-full mt-6">Salvar Alterações</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditProfileSheet;
