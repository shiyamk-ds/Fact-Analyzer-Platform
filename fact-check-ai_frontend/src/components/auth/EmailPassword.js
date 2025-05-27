import React, { useState } from 'react';
import { Sheet, Typography, FormControl, FormLabel, Input, Button, IconButton, FormHelperText, Box } from '@mui/joy';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthContext from '../../context/auth/authContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailPasswordStep({ onNext }) {
  const { signupEmail, addSignupEmail, signupPassword, addSignupPassword } = useAuthContext();
  console.log("Email ", signupEmail)
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (field === 'email') {
      addSignupEmail(value);
    } else {
      addSignupPassword(value);
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!signupEmail) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(signupEmail)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!signupPassword) {
      newErrors.password = 'Password is required';
    } else if (signupPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log("Register")
      await onNext();
    }
  };

  return (
    <Sheet variant="outlined" sx={{ width: '100%', maxWidth: '400px', p: 4, position: 'relative' }}>
      <Typography level="body-sm" sx={{ mb: 3, color: 'neutral.500' }}>
        Enter your email and create a password to get started
      </Typography>
      <FormControl error={!!errors.email} sx={{ mb: 2 }}>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="your.email@example.com"
          value={signupEmail}
          onChange={handleChange('email')}
          startDecorator={<Mail size={18} />}
          sx={{ mb: 0.5 }}
        />
        {errors.email && (
          <FormHelperText>
            <AlertCircle size={14} style={{ marginRight: '4px' }} />
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl error={!!errors.password} sx={{ mb: 3 }}>
        <FormLabel>Password</FormLabel>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a secure password"
          value={signupPassword}
          onChange={handleChange('password')}
          startDecorator={<Lock size={18} />}
          endDecorator={
            <IconButton onClick={() => setShowPassword(!showPassword)} variant="plain" color="neutral">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          }
          sx={{ mb: 0.5 }}
        />
        {errors.password && (
          <FormHelperText>
            <AlertCircle size={14} style={{ marginRight: '4px' }} />
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <Button fullWidth endDecorator={<ArrowRight size={18} />} onClick={handleSubmit} sx={{ mt: 2 }}>
        Continue
      </Button>
    </Sheet>
  );
} 

