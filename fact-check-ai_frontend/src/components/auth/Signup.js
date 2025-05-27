import React, { useState } from "react";
import EmailPasswordStep from "./EmailPassword";
import VerificationStep from "./Verification";
import CountryStep from "./CountrySelection";
import TopicsStep from "./TopicSelection";
import UsernameStep from "./Username";
import useAuthContext from "../../context/auth/authContext";
import { useColorScheme, Box, Alert } from "@mui/joy";
import {
  registerUser,
  verifyUser,
  loginUser,
  updateTopicSelection,
  updateCountrySelection,
  updateProfile,
} from "../../services/authService/AuthService";
import {
  auth,
  registerWithEmail,
  checkEmailVerified,
} from "../../services/authService/firebase_setup";
import { RectangleGoggles } from "lucide-react";

function ProgressBar({ step, totalSteps, country, mode }) {
  const isCountrySkipped = step > 4 && !country;

  return (
    <Box sx={{ display: "flex", my: 2, gap: 0.5 }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 === step;
        const isCompleted = index + 1 < step;
        const isCountryStep = index + 1 === 4;
        const stepColor =
          isCountryStep && isCountrySkipped
            ? "warning.500"
            : isActive
              ? mode === "light"
                ? "neutral.100"
                : "neutral.50"
              : isCompleted
                ? mode === "light"
                  ? "success.600"
                  : "success.500"
                : mode === "light"
                  ? "neutral.500"
                  : "neutral.400";

        return (
          <Box
            key={index}
            sx={{
              height: "4px",
              flex: 1,
              borderRadius: "4px",
              bgcolor: stepColor,
              transition: "all 0.4s ease",
              animation: isActive ? "blink 1.5s infinite ease-in-out" : "none",
              "@keyframes blink": {
                "0%": { opacity: 0.5 },
                "50%": { opacity: 0.2 },
                "100%": { opacity: 0.5 },
              },
            }}
          />
        );
      })}
    </Box>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const { mode, setMode } = useColorScheme();

  const [error, setError] = useState({ status: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const {
    signupEmail,
    signupPassword,
    username,
    country,
    topics,
    addToken,
    addIsVerified,
    addUserId,
    userId,
  } = useAuthContext();

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      console.log("Form submitted:", {
        signupEmail,
        signupPassword,
        username,
        country,
        topics,
      });
      alert("Registration completed successfully!");
    }
  };

  const handleBack = () => {
    if (step > 1 && step !== 2) {
      setStep(step - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <EmailPasswordStep onNext={handleSubmit} />;
      case 2:
        return <VerificationStep onNext={handleNext} />;
      case 3:
        return <UsernameStep onNext={handleUpdate} onBack={handleBack} />;
      case 4:
        return (
          <CountryStep onNext={handleCountrySelection} onBack={handleBack} />
        );
      case 5:
        return <TopicsStep onNext={handleTopicsSelection} onBack={handleBack} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setError({ status: false, message: "" });
      const register = await registerWithEmail(signupEmail, signupPassword);
      console.log(register);
      addUserId(register?.user?.uid);

      handleNext();
    } catch (error) {
      setError({
        status: true,
        message: error?.response?.data?.detail || "Registration failed",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProfile(signupEmail, username);
      handleNext();
      console.log(response);
      setError({ status: false, message: "" });
    } catch (error) {
      console.log(error);
      setError({
        status: true,
        message: error?.response?.data?.detail || "Registration failed",
      });
    }
  };

  const handleCountrySelection = async () => {
    try {
      const response = await updateCountrySelection(signupEmail, country);
      handleNext();
      console.log(response);
      setError({ status: false, message: "" });
    } catch (error) {
      console.log(error);
      setError({
        status: true,
        message: error?.response?.data?.detail || "Registration failed",
      });
    }
  };

    const handleTopicsSelection = async () => {
    try {
      const response = await updateTopicSelection(signupEmail, topics);
      handleNext();
      console.log(response);
      setError({ status: false, message: "" });
    } catch (error) {
      console.log(error);
      setError({
        status: true,
        message: error?.response?.data?.detail || "Registration failed",
      });
    }
  };

  return (
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
        <Box sx={{ width: "100%", mx: "auto", mb: 2 }}>
          <ProgressBar
            step={step}
            totalSteps={5}
            country={country}
            mode={mode}
          />
        </Box>
        {renderCurrentStep()}

        {error?.status === true && (
          <Alert variant="soft" color="danger">
            {error?.message}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
