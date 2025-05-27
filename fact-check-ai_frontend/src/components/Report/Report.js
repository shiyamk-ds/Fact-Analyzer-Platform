import React, { useState } from "react";
import {
  Box,
  Sheet,
  Typography,
  Chip,
  Divider,
  Link,
  Stack,
  Card,
  CardContent,
  Grid,
  styled,
  Tooltip,
  AspectRatio,
  Button,
} from "@mui/joy";
import {
  CheckCircle,
  Cancel,
  Warning,
  HelpOutline,
  Source,
  Info,
  Description,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/joy";
import { ReportSummary } from "./ReportSummary";
import { ClaimFilters } from "./ClaimFilter";
import { ClaimList } from "./ClaimList";
import { SourceStepper } from "./SourceStepper";
import { SourceDashboard } from "./SourceDashboard";

// ReportLayout Component
const ReportLayout = ({ article, report, sources, reports, articleId, reportId }) => {
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const { mode } = useColorScheme();
  const [view, setView] = useState(true);

  const actualReport = report;

  const claimCounts = {
    True: actualReport.claims.filter(
      (claim) => claim.fact_check_category === "True"
    ).length,
    False: actualReport.claims.filter(
      (claim) => claim.fact_check_category === "False"
    ).length,
    Misleading: actualReport.claims.filter(
      (claim) => claim.fact_check_category === "Misleading"
    ).length,
    Unverifiable: actualReport.claims.filter(
      (claim) => claim.fact_check_category === "Unverifiable"
    ).length,
    total: actualReport.claims.length,
  };

  const sourceDomains = [
    ...new Set(
      actualReport.claims.flatMap((claim) =>
        claim.sources.map((source) =>
          new URL(source.url).hostname.replace("www.", "").replace(".com", "")
        )
      )
    ),
  ];

  const percentages = {
    True: (claimCounts.True / claimCounts.total) * 100,
    Misleading: (claimCounts.Misleading / claimCounts.total) * 100,
    False: (claimCounts.False / claimCounts.total) * 100,
    Unverifiable: (claimCounts.Unverifiable / claimCounts.total) * 100,
  };

  const filteredClaims =
    selectedFilters.size === 0
      ? actualReport.claims
      : actualReport.claims.filter((claim) =>
          selectedFilters.has(claim.fact_check_category)
        );

  const toggleFilter = (category) => {
    setSelectedFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(category)) {
        newFilters.delete(category);
      } else {
        newFilters.add(category);
      }
      return newFilters;
    });
  };

  const [selectedSource, setSelectedSource] = useState(null);

  const sortedSources = [...sources].sort((a, b) => {
    if (a.type === "target" && b.type !== "target") return -1;
    if (b.type === "target" && a.type !== "target") return 1;
    return a.source_tier - b.source_tier;
  });

  return (
    <Box
      sx={{
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "background.body",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Stack sx={{ width: "30%", minWidth: "300px", height: "100%" }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <AspectRatio ratio="1" sx={{ width: 90 }}>
                <img
                  src={article?.urlToImage || "https://placeholder.com/150"}
                  alt={article?.title}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              </AspectRatio>
              <Stack spacing={1} flex={1}>
                <Typography level="title-md" fontWeight="bold">
                  {article?.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    variant="soft"
                    size="sm"
                    sx={{
                      backgroundColor:
                        mode === "dark" ? "neutral.600" : "neutral.200",
                    }}
                  >
                    {article?.source?.name}
                  </Chip>
                  <Button
                    color="primary"
                    variant="outlined"
                    startDecorator={view ? <Source /> : <Description />}
                    size="sm"
                    sx={{
                      borderRadius: 4,
                    }}
                    onClick={() => setView(!view)}
                  >
                    {view ? "View Source" : "View Report"}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {view === true ? (
          <ReportSummary
            reports={reports}
            articleId={articleId}
            report={actualReport}
            percentages={percentages}
            sourceDomains={sourceDomains}
            mode={mode}
            reportId={reportId}
          />
        ) : (
          <SourceStepper
            sources={sortedSources}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            mode={mode}
          />
        )}
      </Stack>
      {view === true ? (
        <Stack width="70%">
          <ClaimFilters
            claimCounts={claimCounts}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
          />
          <ClaimList
            filteredClaims={filteredClaims}
            actualReport={actualReport}
            mode={mode}
          />
        </Stack>
      ) : (
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <SourceDashboard source={selectedSource} mode={mode} />
        </Box>
      )}
    </Box>
  );
};

export default ReportLayout;
