import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Estilo para o coração pulsante
const heartStyles = `
  @keyframes beatingHeart {
    0% {
      transform: scale(1);
    }
    15% {
      transform: scale(1.15);
    }
    30% {
      transform: scale(1);
    }
    45% {
      transform: scale(1.15);
    }
    60% {
      transform: scale(1);
    }
  }
  
  .heart-beat {
    fill: rgb(255, 110, 110);
    color: rgb(255, 110, 110);
    animation: beatingHeart 1.2s infinite;
    display: inline-block;
  }
`;

interface BeatingHeartProps {
  className?: string;
  size?: number;
}

const BeatingHeart: React.FC<BeatingHeartProps> = ({ className, size = 24 }) => {
  return (
    <>
      <style>{heartStyles}</style>
      <Heart 
        size={size} 
        className={cn('heart-beat', className)} 
        fill="currentColor" 
      />
    </>
  );
};

export default BeatingHeart; 