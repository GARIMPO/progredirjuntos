import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Heart } from "lucide-react";
import { ProfileData } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import EditProfileSheet from "./EditProfileSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import WishlistModal from "./WishlistModal";

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { setActiveMessage, activeMessage, updateProfile } = useAppContext();
  const isMobile = useIsMobile();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const handleLetterClick = () => {
    const isActive = activeMessage === profile.id;
    setActiveMessage(isActive ? null : profile.id);
  };

  const handlePhoneClick = (phone: string) => {
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleEmailClick = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
  };

  return (
    <>
      <div className="p-2 md:p-4 w-full md:max-w-md">
        <div className="flex flex-col items-center relative z-10 bg-white/50 rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <Avatar className={cn(
            "border-2 border-primary mb-3", 
            isMobile ? "w-32 h-32" : "w-36 h-36"
          )}>
            <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-medium">{profile.name}</h3>
            <EditProfileSheet 
              profile={profile} 
              onProfileUpdate={updateProfile} 
            />
          </div>
        
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4 justify-center">
              {profile.phone && (
                <button 
                  onClick={() => handlePhoneClick(profile.phone!)}
                  className="text-love-dark hover:text-primary transition-colors flex items-center gap-1 text-sm"
                >
                  <Phone size={18} />
                  {!isMobile && <span>{profile.phone}</span>}
                </button>
              )}
              
              {profile.email && (
                <button 
                  onClick={() => handleEmailClick(profile.email!)}
                  className="text-love-dark hover:text-primary transition-colors flex items-center gap-1 text-sm"
                >
                  <Mail size={18} />
                  {!isMobile && <span>{profile.email}</span>}
                </button>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline"
                size="sm" 
                className="text-xs gap-1"
                onClick={openWishlist}
              >
                <Heart size={14} className="text-red-500" />
                Lista de Desejos
              </Button>
              
              <button
                onClick={handleLetterClick}
                className={cn(
                  "p-2 text-love-dark hover:text-primary transition-all",
                  activeMessage === profile.id && "animate-letter-open"
                )}
              >
                <Mail size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <WishlistModal 
        profile={profile}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default ProfileCard;
