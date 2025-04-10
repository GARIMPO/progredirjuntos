import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Gift, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';

interface WishlistItemProps {
  item: string;
  profileId: string;
  index: number;
}

const WishlistItem = ({ item, profileId, index }: WishlistItemProps) => {
  const { updateProfile, profiles } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item);

  const profile = profiles.find(p => p.id === profileId);
  
  if (!profile) return null;
  
  const wishlist = profile.wishlist || [];

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja remover este item da lista de desejos?')) {
      const updatedWishlist = [...wishlist];
      updatedWishlist.splice(index, 1);
      
      await updateProfile({
        ...profile,
        wishlist: updatedWishlist
      });
    }
  };
  
  const handleSave = async () => {
    if (editValue.trim()) {
      const updatedWishlist = [...wishlist];
      updatedWishlist[index] = editValue.trim();
      
      await updateProfile({
        ...profile,
        wishlist: updatedWishlist
      });
      
      setIsEditing(false);
    }
  };
  
  const handleMarkAsGifted = async () => {
    const updatedWishlist = [...wishlist];
    const currentItem = updatedWishlist[index];
    
    if (currentItem.includes("✓")) {
      updatedWishlist[index] = currentItem.replace(" ✓", "");
    } else {
      updatedWishlist[index] = currentItem + " ✓";
    }
    
    await updateProfile({
      ...profile,
      wishlist: updatedWishlist
    });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 border p-2 rounded-md">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <Button size="sm" onClick={handleSave} variant="default">Salvar</Button>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border p-2 rounded-md">
      <p className={`${item.includes("✓") ? "line-through text-gray-500" : ""}`}>
        {item}
      </p>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAsGifted}
          className="h-8 w-8 p-0"
        >
          <Gift className={`h-4 w-4 ${item.includes("✓") ? "text-green-500" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WishlistItem; 