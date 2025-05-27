import React, { useState } from 'react';
import { Sheet, Typography, FormControl, FormLabel, Input, Button, Box, FormHelperText } from '@mui/joy';
import { User, ChevronLeft, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthContext from '../../context/auth/authContext';


export default function UsernameStep({ onNext, onBack }) {
  const { username, addUsername } = useAuthContext();
  const [errors, setErrors] = useState({ username: '' });

  const handleChange = (event) => {
    const value = event.target.value;
    addUsername(value);
    if (errors.username) {
      setErrors({ username: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <Sheet variant="outlined" sx={{ width: '100%', maxWidth: '400px', p: 4, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <User size={24} color="#3a70fc" />
        <Typography level="h4" sx={{ ml: 1 }}>Choose a username</Typography>
      </Box>
      <Typography level="body-sm" sx={{ mb: 3, color: 'neutral.500' }}>
        Your username will be visible to other users
      </Typography>
      <FormControl error={!!errors.username} sx={{ mb: 3 }}>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Choose a unique username"
          value={username}
          onChange={handleChange}
          startDecorator={<User size={18} />}
          sx={{ mb: 0.5 }}
        />
        {errors.username && (
          <FormHelperText>
            <AlertCircle size={14} style={{ marginRight: '4px' }} />
            {errors.username}
          </FormHelperText>
        )}
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<ChevronLeft size={18} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          fullWidth
          endDecorator={<ArrowRight size={18} />}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </Box>
    </Sheet>
  );
}