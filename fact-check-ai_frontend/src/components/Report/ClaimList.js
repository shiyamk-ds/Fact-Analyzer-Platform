import React, { useState } from "react";
import {
  Box,
  Sheet,
  Typography,
  Chip,
  Link,
  Stack,
  CardContent,
  IconButton,
  Snackbar,
} from "@mui/joy";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const ClaimList = ({ filteredClaims, actualReport, mode }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const openWithHighlight = (url, text) => {
    if (window.chrome) {
      const encodedText = encodeURIComponent(text);
      window.open(`${url}#:~:text=${encodedText}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setOpenSnackbar(true);
  };

  const getCategoryTextColor = (category) => {
    switch (category) {
      case "True":
        return "#34d399";
      case "False":
        return "#f87171";
      case "Misleading":
        return "#fbbf24";
      default:
        return "#9ca3af";
    }
  };

  return (
    <Box sx={{ width: "95%" }}>
      {filteredClaims.length === 0 ? (
        <Sheet
          variant="soft"
          sx={{
            p: 4,
            borderRadius: "lg",
            textAlign: "center",
            bgcolor: "background.level1",
            width: "90%",
            minHeight: "80vh",
          }}
        >
          <Typography level="h4" sx={{ mb: 1 }}>
            No claims selected
          </Typography>
          <Typography>
            Click on the category cards above to filter claims
          </Typography>
        </Sheet>
      ) : (
        <Stack width="100%">
          {filteredClaims.map((claim, index) => (
            <CardContent key={index} sx={{ p: 3 }}>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  level="h4"
                  sx={{
                    mb: 3,
                    lineHeight: 1.4,
                    color: mode === "dark" ? "neutral.50" : "neutral.900",
                  }}
                >
                  "{claim.claim}"
                </Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    backgroundColor: mode === "dark" ? "neutral.700" : "neutral.300",
                  }}
                >
                  Claim #{actualReport.claims.indexOf(claim) + 1}
                </Chip>
              </Stack>
              {claim.sources.length > 0 && (
                <Box
                  sx={{
                    borderRadius: "md",
                    p: 2,
                    borderLeft: `3px solid ${getCategoryTextColor(claim.fact_check_category)}`,
                    borderRight: `3px solid ${getCategoryTextColor(claim.fact_check_category)}`,
                  }}
                >
                  <Stack spacing={2}>
                    {claim.sources.map((source, sourceIndex) => {
                      const domain = new URL(source.url).hostname.replace("www.", "");
                      return (
                        <Box
                          key={sourceIndex}
                          sx={{
                            p: 2,
                            bgcolor: "background.surface",
                            borderRadius: "sm",
                            border: "1px solid",
                            borderColor: "neutral.200",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Chip size="sm" variant="outlined" color="primary">
                              {domain}
                            </Chip>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                openWithHighlight(source.url, source.relevant_evidence_excerpt);
                              }}
                              sx={{
                                fontSize: "sm",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontWeight: "bold",
                              }}
                            >
                              "{source.relevant_evidence_excerpt}"
                            </Link>
                            <IconButton
                              size="sm"
                              onClick={() => copyToClipboard(source.relevant_evidence_excerpt)}
                              sx={{ color: mode === "dark" ? "neutral.50" : "neutral.900" }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </CardContent>
          ))}
        </Stack>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        variant="soft"
        color="success"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        Text copied to clipboard
      </Snackbar>
    </Box>
  );
};