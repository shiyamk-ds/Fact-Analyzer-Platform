import React, { useEffect, useState } from "react";
import {
  Sheet,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/joy";
import { Mail, Check } from "lucide-react";
import useAuthContext from "../../context/auth/authContext";
import { auth } from "../../services/authService/firebase_setup";
import { registerUser } from "../../services/authService/AuthService";

export default function VerificationStep({ onNext, onResend, isLoading }) {
  const { addIsVerified, signupEmail, signupPassword, userId, addToken } =
    useAuthContext();
  const [isVerified, setIsVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const checkEmailVerified = async () => {
    try {
      // Force refresh to get latest verification status
      await auth.currentUser?.reload();
      const user = auth.currentUser;
      const verified = user?.emailVerified || false;
      setIsVerified(verified);
      addIsVerified(verified);

      if (verified) {
        setShowSuccess(true);
        const response = await registerUser({
          email: signupEmail,
          password: signupPassword,
          firebase_uid: userId,
        });
        addToken(response?.access_token);
        // Automatically proceed after 2 seconds
        setTimeout(() => onNext(), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkEmailVerified();

    // Set up interval to check every 5 seconds
    const interval = setInterval(checkEmailVerified, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sheet
      variant="outlined"
      sx={{ width: "100%", maxWidth: "400px", p: 4, position: "relative" }}
    >
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Box
          sx={{
            position: "relative",
            height: "100px",
            width: "100px",
            margin: "0 auto",
            mb: 3,
          }}
        >
          {showSuccess ? (
            <Check
              size={60}
              color="#4caf50"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : (
            <>
              <CircularProgress
                size="lg"
                determinate={false}
                value={25}
                thickness={4}
                sx={{ position: "absolute", top: 0, left: 0 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-115%, -95%)",
                }}
              >
                <Mail size={25} color="#3a70fc" />
              </Box>
            </>
          )}
        </Box>

        {showSuccess ? (
          <>
            <Typography level="h4" sx={{ mb: 1, color: "success.500" }}>
              Email Verified!
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500", mb: 2 }}>
              Your email has been successfully verified
            </Typography>
          </>
        ) : (
          <>
            <Typography level="h4" sx={{ mb: 1 }}>
              Verifying your email
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500", mb: 2 }}>
              Please check your inbox and verify your email address
            </Typography>
          </>
        )}

        {!showSuccess && (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 0.8, my: 1 }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  bgcolor: "primary.500",
                  opacity: 0.3,
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: `${i * 0.3}s`,
                  "@keyframes pulse": {
                    "0%": { opacity: 0.3, transform: "scale(1)" },
                    "50%": { opacity: 1, transform: "scale(1.2)" },
                    "100%": { opacity: 0.3, transform: "scale(1)" },
                  },
                }}
              />
            ))}
          </Box>
        )}

        {!showSuccess && (
          <Button
            variant="outlined"
            onClick={onResend}
            disabled={isLoading}
            sx={{ mt: 3 }}
            startIcon={isLoading ? <CircularProgress size="sm" /> : null}
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        )}

        {error && (
          <Alert color="danger" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Sheet>
  );
}
