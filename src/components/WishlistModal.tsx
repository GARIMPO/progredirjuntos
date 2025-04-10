import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import WishlistManager from "./WishlistManager";
import { ProfileData } from "@/types";

interface WishlistModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal = ({ profile, isOpen, onClose }: WishlistModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Lista de Desejos de {profile.name}
          </DialogTitle>
          <DialogDescription>
            Adicione, edite ou marque itens como presenteados
          </DialogDescription>
        </DialogHeader>
        <WishlistManager profileId={profile.id} />
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal; 