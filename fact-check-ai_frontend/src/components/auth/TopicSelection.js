import React from 'react';
import { Sheet, Typography, Box, Button, Chip } from '@mui/joy';
import { Sparkles, Film, Dumbbell, Heart, FlaskConical, Briefcase, Cpu, Globe } from 'lucide-react';
import useAuthContext from '../../context/auth/authContext';

const topicsList = [
  { id: 1, name: 'Entertainment', icon: <Film size={18} /> },
  { id: 2, name: 'Sports', icon: <Dumbbell size={18} /> },
  { id: 3, name: 'Health', icon: <Heart size={18} /> },
  { id: 4, name: 'Science', icon: <FlaskConical size={18} /> },
  { id: 5, name: 'Business', icon: <Briefcase size={18} /> },
  { id: 6, name: 'Technology', icon: <Cpu size={18} /> },
  { id: 7, name: 'General', icon: <Globe size={18} /> },
];

export default function TopicsStep({ onNext, onBack }) {
  const { topics, addTopics } = useAuthContext();

  const handleInterestToggle = (id) => {
    if (topics.includes(id)) {
      const newTopics = topics.filter((i) => i !== id);
      addTopics(newTopics);
    } else if (topics.length < 3) {
      const newTopics = [...topics, id];
      addTopics(newTopics);
    }
  };

  return (
    <Sheet variant="outlined" sx={{ width: '100%', maxWidth: '400px', p: 4, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Sparkles size={24} color="#3a70fc" />
        <Typography level="h4" sx={{ ml: 1 }}>What interests you?</Typography>
      </Box>
      <Typography level="body-sm" sx={{ mb: 3, color: 'neutral.500' }}>
        Select up to 3 topics you're interested in for a customized experience
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {topicsList.map((topic) => {
          const isSelected = topics.includes(topic.name);
          const isDisabled = topics.length >= 3 && !isSelected;
          return (
            <Chip
              key={topic.id}
              variant={isSelected ? "solid" : "outlined"}
              color={isSelected ? "primary" : isDisabled ? "neutral" : "neutral"}
              startDecorator={topic.icon}
              onClick={() => handleInterestToggle(topic.name)}
              disabled={isDisabled}
              sx={{
                px: 1.5,
                py: 0.5,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                opacity: isDisabled ? 0.5 : 1,
                '&:hover': {
                  bgcolor: isSelected ? 'primary.600' : isDisabled ? 'neutral.100' : 'neutral.100',
                  transform: isSelected ? 'scale(1.05)' : isDisabled ? 'scale(1)' : 'scale(1.05)',
                },
              }}
            >
              {topic.name}
            </Chip>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="neutral" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth onClick={onNext}>
          Complete Registration
        </Button>
      </Box>
    </Sheet>
  );
}