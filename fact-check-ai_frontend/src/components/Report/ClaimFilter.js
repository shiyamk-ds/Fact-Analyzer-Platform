// ClaimFilters Component
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useColorScheme,
} from "@mui/joy";
import { CheckCircle, Cancel, Warning, HelpOutline } from "@mui/icons-material";
import theme from "../../style/palette";

export const ClaimFilters = ({
  claimCounts,
  selectedFilters,
  toggleFilter,
}) => {
  const { mode } = useColorScheme();
  const getCategoryColor = (category) => {
    switch (category) {
      case "True":
        return "success";
      case "False":
        return "danger";
      case "Misleading":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getCategoryIcon = (category) => {
    const iconProps = {
      sx: { fontSize: "1.75em", verticalAlign: "middle", mr: 0.5 },
    };
    const getCategoryThemeColor = (category) => {
      switch (category) {
        case "True":
          return theme.palette.success.solidBg;
        case "False":
          return theme.palette.danger.solidBg;
        case "Misleading":
          return theme.palette.warning.solidBg;
        default:
          return theme.palette.neutral.solidBg;
      }
    };
    switch (category) {
      case "True":
        return (
          <CheckCircle
            {...iconProps}
            sx={{ ...iconProps.sx, color: getCategoryThemeColor(category) }}
          />
        );
      case "False":
        return (
          <Cancel
            {...iconProps}
            sx={{ ...iconProps.sx, color: getCategoryThemeColor(category) }}
          />
        );
      case "Misleading":
        return (
          <Warning
            {...iconProps}
            sx={{ ...iconProps.sx, color: getCategoryThemeColor(category) }}
          />
        );
      default:
        return (
          <HelpOutline
            {...iconProps}
            sx={{ ...iconProps.sx, color: getCategoryThemeColor(category) }}
          />
        );
    }
  };
  console.log(mode);

  return (
    <Box sx={{ mb: 1, width: "95%" }}>
      <Grid container gap={3} alignItems="center" justifyContent="center">
        {Object.entries(claimCounts)
          .filter(([category]) => category !== "total") // Exclude the "total" entry
          .map(([category, count]) => (
            <Grid md={2.3} key={category}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: selectedFilters.has(category)
                    ? "scale(1.05)"
                    : "scale(1)",
                  boxShadow: selectedFilters.has(category) ? "lg" : "sm",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "md",
                  },
                  height: "70%",
                  backgroundColor: selectedFilters.has(category)
                    ? `${getCategoryColor(category)}.200`
                    : mode === "dark"
                      ? "neutral.800"
                      : "neutral.50",
                }}
                onClick={() => toggleFilter(category)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getCategoryIcon(category)}
                    <Typography
                      level="h3"
                      sx={{
                        ml: 1,
                        color: selectedFilters.has(category)
                          ? "neutral.800"
                          : mode === "dark"
                            ? "neutral.200"
                            : "neutral.800",
                      }}
                    >
                      {count}
                    </Typography>
                  </Box>
                  <Typography
                    level="body2"
                    sx={{
                      opacity: 0.8,
                      color: selectedFilters.has(category)
                        ? "neutral.700"
                        : mode === "dark"
                          ? "neutral.400"
                          : "neutral.700",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis", 
                      maxWidth: "100%", 
                      display: "block",
                    }}
                  >
                    {Math.round((count / claimCounts.total) * 100)}% {category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
