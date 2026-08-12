import {
  Cpu, Drum, GraduationCap, Handshake, LayoutGrid, Martini, Music4, Palette, Trophy, Users,
  UtensilsCrossed, type LucideIcon,
} from 'lucide-react';
import type { CategoryId } from '@/types';

const map: Record<string, LucideIcon> = {
  music: Music4,
  nightlife: Martini,
  sports: Trophy,
  food: UtensilsCrossed,
  tech: Cpu,
  networking: Handshake,
  arts: Palette,
  culture: Drum,
  community: Users,
  workshops: GraduationCap,
  all: LayoutGrid,
};

export const CategoryIcon = ({
  id,
  className,
}: {
  id: CategoryId | 'all' | string;
  className?: string;
}) => {
  const Icon = map[id] ?? LayoutGrid;
  return <Icon className={className} aria-hidden />;
};
