import React, { useState } from "react";
import { 
  CssVarsProvider, 
  Box, 
  Sheet, 
  Typography, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  IconButton, 
  FormHelperText,
  Alert
} from "@mui/joy";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check } from "lucide-react";
import useAuthContext from "../../context/auth/authContext";
import theme from "../../style/palette";
import { loginUser } from "../../services/authService/AuthService";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const { loginEmail, addLoginEmail, loginPassword, addLoginPassword, addToken } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (field === "email") {
      addLoginEmail(value);
    } else {
      addLoginPassword(value);
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear any API errors when user types
    if (apiError) setApiError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!loginEmail) {
      newErrors.email = "Username or email is required";
    } else if (!emailRegex.test(loginEmail)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!loginPassword) {
      newErrors.password = "Password is required";
    } else if (loginPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await loginUser(loginEmail, loginPassword);
      console.log(response);
      
      // Store user data
      addToken(response?.access_token);
      localStorage.setItem("user_name", response?.user_name);
      localStorage.setItem("email", loginEmail);

      
      // Show success and redirect
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/articles'); // Redirect to dashboard after login
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setApiError(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet variant="outlined" sx={{ width: "100%", maxWidth: "400px", p: 4, position: "relative" }}>
      <Typography level="h4" sx={{ mb: 1 }}>Login</Typography>
      <Typography level="body-sm" sx={{ mb: 3, color: "neutral.500" }}>
        Enter your email and password to login
      </Typography>

      {/* Success Alert */}
      {loginSuccess && (
        <Alert
          color="success"
          variant="soft"
          sx={{ mb: 3 }}
          startDecorator={<Check size={18} />}
        >
          Login successful! Redirecting...
        </Alert>
      )}

      {/* Error Alert */}
      {apiError && (
        <Alert
          color="danger"
          variant="soft"
          sx={{ mb: 3 }}
          startDecorator={<AlertCircle size={18} />}
        >
          {apiError}
        </Alert>
      )}

      <FormControl error={!!errors.email} sx={{ mb: 2 }}>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="your.email@example.com"
          value={loginEmail}
          onChange={handleChange("email")}
          startDecorator={<Mail size={18} />}
          sx={{ mb: 0.5 }}
        />
        {errors.email && (
          <FormHelperText>
            <AlertCircle size={14} style={{ marginRight: "4px" }} />
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.password} sx={{ mb: 3 }}>
        <FormLabel>Password</FormLabel>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={loginPassword}
          onChange={handleChange("password")}
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
            <AlertCircle size={14} style={{ marginRight: "4px" }} />
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>

      <Button 
        fullWidth 
        endDecorator={<ArrowRight size={18} />} 
        onClick={handleSubmit} 
        loading={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </Sheet>
  );
}

export default function LoginPage() {
  return (
    <CssVarsProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 3, md: 5 },
          bgcolor: "background.level1",
          background: "rgba(58, 112, 252, 0.1)",
          backgroundSize: { xs: "150% 150%", sm: "100% 100%" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "90%", sm: "80%", md: "400px" },
            mx: "auto",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}