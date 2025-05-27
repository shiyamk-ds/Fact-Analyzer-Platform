import React from "react";
import {
  Sheet,
  Box,
  Typography,
  Button,
  Avatar,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/joy";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { useColorScheme, useTheme } from "@mui/joy/styles";
import { NavLink } from "react-router-dom";
import KaniniLogo from "../../assets/logo/kanini_logo.png";
import useAuthContext from "../../context/auth/authContext";

// ResponsiveNavBar Component
export const NavBar = () => {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const { authToken, user, usermail, logout } = useAuthContext();
  const isLoggedIn = !!(authToken && user && usermail);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pages = [
    { name: "Article", path: "/articles" },
    { name: "Reports", path: "/report-dashboard" },
    { name: "Feed", path: "/feed" },
  ];

  const toggleColorScheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_name");
    localStorage.removeItem("email");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <Sheet
      variant="solid"
      sx={{
        width: "100%",
        background: theme.vars.palette.background.body,
        borderBottom: "1px solid",
        borderColor: theme.vars.palette.divider,
        boxShadow: "sm",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box
        sx={{
          maxWidth: "xl",
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Logo */}
        {/* <Box
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          component="a"
          href="/"
        >
          <Typography
            level="h3"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: "xl",
              letterSpacing: ".1rem",
              color: mode === "dark" ? "neutral.50" : "neutral.900",
              textDecoration: "none",
              "&:hover": {
                color: theme.vars.palette.primary[700],
              },
            }}
            startDecorator={
              <svg
                width="30"
                height="30"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M101.008 42L190.99 124.905V124.886V42.1913H208.506V125.276L298.891 42V136.524H336V272.866H299.005V357.035L208.506 277.525V357.948H190.99V278.836L101.11 358V272.866H64V136.524H101.008V42ZM177.785 153.826H81.5159V255.564H101.088V223.472L177.785 153.826ZM118.625 231.149V319.392L190.99 255.655V165.421L118.625 231.149ZM209.01 254.812V165.336L281.396 231.068V272.866H281.489V318.491L209.01 254.812ZM299.005 255.564H318.484V153.826H222.932L299.005 222.751V255.564ZM281.375 136.524V81.7983L221.977 136.524H281.375ZM177.921 136.524H118.524V81.7983L177.921 136.524Z"
                  fill={mode === "dark" ? "white" : "black"}
                />
              </svg>
            }
          >
            Perplexity
          </Typography>
          <Typography
            level="h3"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: "xl",
              letterSpacing: ".1rem",
              color: mode === "dark" ? "neutral.50" : "neutral.900",
              textDecoration: "none",
              "&:hover": {
                color: theme.vars.palette.primary[700],
              },
              padding: 0,
            }}
          >
            |
          </Typography>
          <Typography
            level="h3"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: "xl",
              letterSpacing: ".1rem",
              color: mode === "dark" ? "neutral.50" : "neutral.900",
              textDecoration: "none",
              "&:hover": {
                color: theme.vars.palette.primary[700],
              },
            }}
            startDecorator={<img src={KaniniLogo} width={30} height={30} alt="Kanini Logo" />}
          >
            Kanini
          </Typography>
        </Box> */}
        <Box
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          component="a"
          href="/"
        >
          <Typography
            level="h3"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: "xl",
              letterSpacing: ".1rem",
              color: mode === "dark" ? "neutral.50" : "neutral.900",
              textDecoration: "none",
              "&:hover": {
                color: theme.vars.palette.primary[700],
              },
            }}>
            Placeholder
          </Typography>
        </Box>

        {/* Mobile Menu Toggle */}
        <IconButton
          size="sm"
          variant="outlined"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </IconButton>

        {/* Navigation Links */}
        <Box
          sx={{
            display: { xs: mobileMenuOpen ? "flex" : "none", md: "flex" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 1, md: 2 },
            bgcolor: {
              xs: theme.vars.palette.background.level1,
              md: "transparent",
            },
            p: { xs: 2, md: 0 },
            position: { xs: "absolute", md: "static" },
            top: { xs: 64, md: 0 },
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: { xs: "sm", md: "none" },
          }}
        >
          {pages.map((page) => (
            <NavLink
              key={page.name}
              to={page.path}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Button
                  variant={isActive ? "solid" : "plain"}
                  color={isActive ? "primary" : "neutral"}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: theme.shadow.sm,
                    },
                  }}
                >
                  {page.name}
                </Button>
              )}
            </NavLink>
          ))}
        </Box>

        {/* Auth Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Tooltip
            title={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            variant="soft"
          >
            <Switch
              checked={mode === "dark"}
              onChange={toggleColorScheme}
              startDecorator={<Sun size={18} />}
              endDecorator={<Moon size={18} />}
              color={mode === "dark" ? "primary" : "neutral"}
              sx={{
                "--Switch-trackWidth": "48px",
                "--Switch-trackHeight": "24px",
                "--Switch-thumbSize": "20px",
                transition: "all 0.3s ease",
              }}
            />
          </Tooltip>

          {isLoggedIn ? (
            <>
              <Tooltip title={usermail} variant="soft">
                <Avatar
                  alt={usermail}
                  size="sm"
                  sx={{
                    bgcolor: theme.vars.palette.primary[500],
                    color: theme.vars.palette.common.white,
                    fontWeight: "md",
                    "&:hover": {
                      transform: "scale(1.1)",
                      transition: "transform 0.2s ease",
                    },
                  }}
                >
                  {usermail[0]?.toUpperCase()}
                </Avatar>
              </Tooltip>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<LogOut size={18} />}
                onClick={handleLogout}
                sx={{
                  borderRadius: theme.radius.md,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadow.sm,
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="neutral"
                component="a"
                href="/login"
                sx={{
                  borderRadius: theme.radius.md,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadow.sm,
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="solid"
                component="a"
                href="/signup"
                sx={{
                  borderRadius: theme.radius.md,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadow.sm,
                  },
                  backgroundColor:
                    mode === "dark" ? "neutral.100" : "neutral.900",
                  color: mode === "dark" ? "neutral.800" : "neutral.200",
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Sheet>
  );
};
