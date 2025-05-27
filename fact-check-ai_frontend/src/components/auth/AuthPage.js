import React, { useState, useEffect } from "react";
import {
  CssVarsProvider,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Typography,
} from "@mui/joy";
import { LogIn, UserPlus } from "lucide-react";
import SignupPage from "./Signup";
import LoginPage from "./Login";
import theme from "../../style/palette";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Sync tab with route
  useEffect(() => {
    if (location.pathname === "/login") {
      setTabIndex(0);
    } else if (location.pathname === "/signup") {
      setTabIndex(1);
    }
  }, [location]);

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
    // Update URL when tab changes
    navigate(newValue === 0 ? "/login" : "/signup");
  };

  return (
    <CssVarsProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "calc(100vh - 56px)", sm: "100vh" },
          p: { xs: 2, sm: 3, md: 5 },
          bgcolor: "background.level1",
          background:
            "radial-gradient(circle at top right, rgba(58, 112, 252, 0.1), transparent 70%)",
          backgroundSize: { xs: "150% 150%", sm: "100% 100%" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "90%", sm: "80%", md: "600px" },
            minHeight: { xs: "400px", sm: "500px", md: "600px" },
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ px: 2, pt: 2, width: "100%", height: "100%" }}
          >
            {/* Rest of your existing tab components... */}
            <TabList
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  flex: 1,
                  py: 1.5,
                  borderRadius: "sm",
                  fontWeight: "md",
                  '&[aria-selected="true"]': {
                    bgcolor: "primary.softBg",
                    color: "primary.plainColor",
                    "& svg": {
                      color: "primary.plainColor",
                    },
                  },
                },
              }}
            >
              <Tab
                value={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                disableIndicator
              >
                <LogIn size={18} />
                <Typography level="body-sm" fontWeight="lg">
                  Login
                </Typography>
              </Tab>
              <Tab
                value={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                disableIndicator
              >
                <UserPlus size={18} />
                <Typography level="body-sm" fontWeight="lg">
                  Sign Up
                </Typography>
              </Tab>
            </TabList>

            <TabPanel
              value={0}
              sx={{
                p: 0,
                minHeight: { xs: "300px", sm: "350px", md: "400px" },
                overflow: "auto",
                width: "100%",
              }}
            >
              <LoginPage />
            </TabPanel>
            <TabPanel
              value={1}
              sx={{
                p: 0,
                minHeight: { xs: "300px", sm: "350px", md: "400px" },
                overflow: "auto",
                width: "100%",
              }}
            >
              <SignupPage />
            </TabPanel>

            <Box sx={{ p: 3, pt: 0, textAlign: "center" }}>
              <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                {tabIndex === 0
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Typography
                  component="span"
                  level="body-xs"
                  sx={{
                    color: "primary.plainColor",
                    fontWeight: "lg",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => navigate(tabIndex === 0 ? "/signup" : "/login")}
                >
                  {tabIndex === 0 ? "Sign up" : "Sign in"}
                </Typography>
              </Typography>
            </Box>
          </Tabs>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}