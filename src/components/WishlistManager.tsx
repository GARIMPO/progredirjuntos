import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import WishlistItem from './WishlistItem';
import { ProfileData } from '@/types';

interface WishlistManagerProps {
  profileId: string;
}

const WishlistManager = ({ profileId }: WishlistManagerProps) => {
  const { profiles, updateProfile } = useAppContext();
  const [newItem, setNewItem] = useState('');
  
  const profile = profiles.find(p => p.id === profileId);
  
  if (!profile) return <p>Perfil não encontrado</p>;
  
  const wishlist = profile.wishlist || [];
  
  const handleAddItem = async () => {
    if (newItem.trim()) {
      const updatedProfile: ProfileData = {
        ...profile,
        wishlist: [...wishlist, newItem.trim()]
      };
      
      await updateProfile(updatedProfile);
      setNewItem('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };
  
  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Adicionar novo item à lista de desejos..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAddItem} disabled={!newItem.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>
      
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 my-4">
          Nenhum item na lista de desejos ainda. Adicione algo que você gostaria de ganhar!
        </p>
      ) : (
        <div className="space-y-2">
          {wishlist.map((item, index) => (
            <WishlistItem 
              key={index}
              item={item}
              profileId={profileId}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistManager; 