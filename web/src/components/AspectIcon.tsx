import Image from 'next/image';
import { cn, prefixPath } from '@/lib/utils';

interface AspectIconProps {
  aspect: string;
  className?: string;
  size?: number;
}

const aspectMap: Record<string, string> = {
  grail: 'de.grail.png',
  moth: 'de.moth.png',
  edge: 'edge.png',
  forge: 'forge.png',
  heart: 'heart.png',
  knock: 'knock.png',
  lantern: 'lantern.png',
  moon: 'moon.png',
  nectar: 'nectar.png',
  rose: 'rose.png',
  scale: 'scale.png',
  secrethistories: 'Secrethistories.png',
  sky: 'sky.png',
  winter: 'Winter.webp',
};

export function AspectIcon({ aspect, className, size = 24 }: AspectIconProps) {
  const filename = aspectMap[aspect.toLowerCase()];

  if (!filename) {
    console.warn(`Unknown aspect: ${aspect}`);
    return null;
  }

  return (
    <span 
      className={cn("relative inline-block align-middle", className)}
      style={{ width: size, height: size }}
      title={aspect}
    >
      <Image
        src={prefixPath(`/icons/${filename}`)}
        alt={aspect}
        fill
        className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
        sizes={`${size}px`}
      />
    </span>
  );
}
