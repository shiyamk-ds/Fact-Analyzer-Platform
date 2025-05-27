import React, { useState } from "react";
import {
  Box,
  Sheet,
  Typography,
  Chip,
  Divider,
  Link,
  Stack,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepButton,
  LinearProgress,
  Grid,
  useTheme,
} from "@mui/joy";
import { Source, Verified, Newspaper, Forum } from "@mui/icons-material";
import { useColorScheme } from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";

// SourceStepper Component
export const SourceStepper = ({
  sources,
  selectedSource,
  setSelectedSource,
  mode,
}) => {
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const maxVisible = 8;

  const getStepColor = (source) => {
    if (source.type === "target") return "primary";
    switch (source.source_tier) {
      case 1:
        return "success";
      case 2:
        return "primary";
      case 3:
        return "warning";
      default:
        return "neutral";
    }
  };

  const getStepIcon = (source) => {
    const iconProps = { sx: { fontSize: "1.2em" } };
    if (source.type === "target") return <Newspaper {...iconProps} />;
    return source.content_type === "Forums" ? (
      <Forum {...iconProps} />
    ) : (
      <Verified {...iconProps} />
    );
  };

  const renderStars = (tier) => {
    const stars = [];
    const starCount = Math.min(tier, 4); // Cap at 4 stars max

    for (let i = 1; i <= starCount; i++) {
      stars.push(
        <StarIcon
          key={i}
          fontSize="small"
          sx={{
            color:
              tier === 1
                ? theme.palette.warning[500] // Golden for tier 1
                : tier === 2
                  ? theme.palette.secondary[500] // Blue for tier 2
                  : theme.palette.neutral[500], // Gray for tiers 3+
          }}
        />
      );
    }

    return stars;
  };

  return (
    <Sheet
      sx={{
        borderRadius: theme.radius.xl,
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.surface,
        boxShadow: theme.shadow.sm,
        height: "fit-content",
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      <Typography
        level="h3"
        sx={{
          fontWeight: "lg",
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "text.primary",
          mb: 2,
        }}
      >
        <Source />
        Sources
      </Typography>

      <Stepper
        orientation="vertical"
        sx={{
          "--Step-connectorThickness": "2px",
          "--Step-connectorInset": "0.5rem",
        }}
      >
        {sources
          .slice(0, showAll ? sources.length : maxVisible)
          .map((source) => (
            <Step
              key={source.id}
              active={selectedSource?.id === source.id}
              indicator={
                <StepIndicator
                  variant={
                    selectedSource?.id === source.id ? "solid" : "outlined"
                  }
                  color={getStepColor(source)}
                  size="sm"
                >
                  {getStepIcon(source)}
                </StepIndicator>
              }
              sx={{
                cursor: "pointer",
                minHeight: "3rem",
              }}
            >
              <StepButton
                onClick={() => setSelectedSource(source)}
                sx={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  pl: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
                >
                  <Typography
                    level="body-sm"
                    sx={{
                      fontWeight:
                        selectedSource?.id === source.id ? "lg" : "md",
                      color:
                        selectedSource?.id === source.id
                          ? "primary.500"
                          : "text.primary",
                    }}
                  >
                    {source.domain_name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {renderStars(source.source_tier)}
                    <Typography level="body-xs" sx={{ ml: 0.5 }}>
                      Tier {source.source_tier}
                    </Typography>
                  </Box>
                </Box>
              </StepButton>
            </Step>
          ))}
      </Stepper>

      {sources.length > maxVisible && (
        <Button
          variant="outlined"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          sx={{ mt: 2, width: "100%" }}
        >
          {showAll
            ? `Show Less (${maxVisible})`
            : `Show All (${sources.length})`}
        </Button>
      )}
    </Sheet>
  );
};
