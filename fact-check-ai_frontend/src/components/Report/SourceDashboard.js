import React from "react";
import {
  Box,
  Sheet,
  Typography,
  Chip,
  Divider,
  Stack,
  LinearProgress,
  Grid,
  useTheme,
  Link,
} from "@mui/joy";
import { Source } from "@mui/icons-material";
import { useColorScheme } from "@mui/joy";
import { ExternalLink } from "lucide-react";

export const SourceDashboard = ({ source }) => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  // Convert tonality scores to percentage (1-5 scale to 0-100)
  const getTonalityPercentage = (value) => (value / 5) * 100;

  // Convert authenticity scores to percentage
  const getAuthenticityPercentage = (value) => value * 100;

  const getTonalityColor = (value) => {
    if (value >= 4) return "danger"; // High tonality (positive tone)
    if (value >= 2) return "warning"; // Mid-range tonality
    return "success"; // Low tonality (negative/aggressive tone)
  };

  const getAuthenticityColor = (key, value) => {
    if (key === "verbatim_match") {
      if (value >= 0.7) return "success"; // High verbatim match is good
      if (value >= 0.4) return "warning"; // Moderate verbatim match
      return "danger"; // Low verbatim match
    } else {
      if (value >= 0.8) return "danger"; // High value is bad for other metrics
      if (value >= 0.5) return "warning"; // Moderate value
      return "success"; // Low value is good for other metrics
    }
  };

  return source ? (
    <Sheet
      sx={{
        borderRadius: theme.radius.xl,
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.surface,
        boxShadow: theme.shadow.lg,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: "md",
          bgcolor: "background.surface",
          boxShadow: mode === "dark" ? "sm" : "xs",
          border: "1px solid",
          borderColor: mode === "dark" ? "neutral.700" : "neutral.200",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: "md",
            borderColor: "primary.300",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            level="h2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            {source.domain_name}
          </Typography>
          <Link
            href={source.article_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 2,
              py: 1,
              borderRadius: "sm",
              bgcolor: "primary.500",
              color: "neutral.50",
              textDecoration: "none",
              fontWeight: "md",
              fontSize: "sm",
              "&:hover": {
                bgcolor: "primary.600",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s",
            }}
          >
            <ExternalLink size={16} />
            Visit Source
          </Link>
        </Stack>
        <Typography
          level="body-md"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            color: mode === "dark" ? "neutral.300" : "neutral.600",
          }}
        >
          {source.bias_summary}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 1 }}
        >
          {source.bias.institutional_affiliations.length > 0 && (
            <Chip
              size="sm"
              variant="outlined"
              color="neutral"
              sx={{
                borderRadius: "sm",
                boxShadow: "xs",
                fontWeight: "md",
              }}
            >
              Affiliations: {source.bias.institutional_affiliations.join(", ")}
            </Chip>
          )}
          <Chip
            size="sm"
            variant="soft"
            color={source.bias.commercial_interests ? "warning" : "success"}
            sx={{
              borderRadius: "sm",
              boxShadow: "xs",
              fontWeight: "md",
            }}
          >
            Commercial Interests: {source.bias.commercial_interests ? "Yes" : "No"}
          </Chip>
          <Chip
            size="md"
            color={source.type === "target" ? "primary" : "success"}
            variant="outlined"
            sx={{
              mr: 1,
              borderRadius: "sm",
              boxShadow: "xs",
              fontWeight: "md",
            }}
          >
            {source.type}
          </Chip>
          <Chip
            size="md"
            color={
              source.source_tier === 1
                ? "success"
                : source.source_tier === 2
                ? "neutral"
                : "warning"
            }
            variant="soft"
            sx={{
              borderRadius: "sm",
              boxShadow: "xs",
              fontWeight: "md",
            }}
          >
            Tier {source.source_tier}
          </Chip>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Tonality Analysis
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(source.tonality).map(([key, value]) => (
            <Grid xs={12} sm={6} key={key}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    level="body-sm"
                    sx={{ fontWeight: "md", textTransform: "capitalize" }}
                  >
                    {key.replace(/_/g, " ")}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    {value}/5
                  </Typography>
                </Box>
                <LinearProgress
                  determinate
                  value={getTonalityPercentage(value)}
                  color={getTonalityColor(value)}
                  size="md"
                  sx={{
                    backgroundColor: "neutral.500",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Authenticity Metrics
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(source.authenticity).map(([key, value]) => (
            <Grid xs={12} sm={6} key={key}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    level="body-sm"
                    sx={{ fontWeight: "md", textTransform: "capitalize" }}
                  >
                    {key.replace(/_/g, " ")}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    {typeof value === "number"
                      ? `${Math.round(getAuthenticityPercentage(value))}%`
                      : value}
                  </Typography>
                </Box>
                {typeof value === "number" && (
                  <LinearProgress
                    determinate
                    value={getAuthenticityPercentage(value)}
                    color={getAuthenticityColor(key, value)}
                    size="md"
                    sx={{
                      backgroundColor: "neutral.500",
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />
    </Sheet>
  ) : (
    <Sheet
      variant="soft"
      sx={{
        p: 6,
        borderRadius: theme.radius.xl,
        textAlign: "center",
        bgcolor: "background.level1",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Source sx={{ fontSize: "3rem", color: "text.tertiary", mb: 2 }} />
      <Typography level="h3" sx={{ mb: 1, color: "text.secondary" }}>
        No Source Selected
      </Typography>
      <Typography level="body-md" sx={{ color: "text.tertiary" }}>
        Choose a source from the sidebar to view detailed analysis
      </Typography>
    </Sheet>
  );
};