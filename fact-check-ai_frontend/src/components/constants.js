import { Sparkles, Film, Dumbbell, Heart, FlaskConical, Briefcase, Cpu, Globe } from 'lucide-react';

// Email validation regex
const EMAILREFEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const topicsList = [
  { id: 1, name: 'Entertainment', icon: <Film size={18} /> },
  { id: 2, name: 'Sports', icon: <Dumbbell size={18} /> },
  { id: 3, name: 'Health', icon: <Heart size={18} /> },
  { id: 4, name: 'Science', icon: <FlaskConical size={18} /> },
  { id: 5, name: 'Business', icon: <Briefcase size={18} /> },
  { id: 6, name: 'Technology', icon: <Cpu size={18} /> },
  { id: 7, name: 'General', icon: <Globe size={18} /> },
];