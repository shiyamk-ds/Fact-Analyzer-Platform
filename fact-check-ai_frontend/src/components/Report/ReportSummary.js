import React, { useState } from "react";
import {
  Box,
  Sheet,
  Typography,
  Chip,
  Divider,
  Stack,
  styled,
  Tooltip,
  Button,
  Snackbar,
} from "@mui/joy";
import { Source, Info } from "@mui/icons-material";
import { createPortal } from "react-dom";
import theme from "../../style/palette";
import PublicationSettingsForm from "./PublicationForm";
import { updateSettings } from "../../services/newsService/newsService";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export const ReportSummary = ({
  reports,
  articleId,
  report,
  percentages,
  sourceDomains,
  mode,
  reportId,
}) => {
  const StyledSourceStepper = styled(Sheet)(({ theme }) => ({
    borderRadius: theme.radius.xl,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.surface,
    boxShadow: theme.shadow.lg,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    height: "fit-content",
    maxHeight: "auto",
    overflowY: "auto",
    "&:hover": {
      boxShadow: theme.shadow.md,
    },
    transition: "all 0.2s ease-in-out",
  }));

  const ProgressBarSegment = styled(Box)(({ theme, color, width }) => ({
    height: "100%",
    width: width,
    backgroundColor: color,
    transition: "width 0.5s ease-in-out",
  }));

  const getCategoryThemeColor = (category, type = "main") => {
    switch (category) {
      case "True":
        return theme.palette.success[type] || theme.palette.success.solidBg;
      case "False":
        return theme.palette.danger[type] || theme.palette.danger.solidBg;
      case "Misleading":
        return theme.palette.warning[type] || theme.palette.warning.solidBg;
      case "Mixed":
        return theme.palette.primary[type] || theme.palette.primary.solidBg;
      default:
        return theme.palette.neutral[type] || theme.palette.neutral.solidBg;
    }
  };

  const [success, setSuccess] = useState({ status: false, message: "" });
  const [error, setError] = useState({ status: false, message: "" });

  // Check if the current user's email and report_id match
  const userEmail = localStorage.getItem("email");
  const reportsArray = Array.isArray(reports) ? reports : [];
  const userReport = reportsArray.find(
    (r) => r.user_email === userEmail && r.report_id === reportId
  );
  const isUserReportOwner = !!userReport;
  const [visibility, setVisibility] = useState(
    userReport?.settings || "private"
  );


  const handleSubmit = async () => {
    try {
      if (isUserReportOwner) {
        const settings = visibility;
        await updateSettings(settings, articleId, reportId);
        setSuccess({
          status: true,
          message: `Settings updated successfully to ${visibility}`,
        });
        setError({ status: false, message: "" });
      } else {
        setError({
          status: true,
          message: "User not authorized to update settings",
        });
        setSuccess({ status: false, message: "" });
      }
    } catch (error) {
      setError({
        status: true,
        message: error.message || "Failed to update settings",
      });
      setSuccess({ status: false, message: "" });
    }
  };

  const snackbarPortal = (
    <>
      {createPortal(
        <Snackbar
          open={success.status}
          autoHideDuration={6000}
          onClose={() => setSuccess({ status: false, message: "" })}
          color="success"
          variant="solid"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          startDecorator={<AutoAwesomeIcon size={20} />}
        >
          {success.message}
        </Snackbar>,
        document.body
      )}
      {createPortal(
        <Snackbar
          open={error.status}
          autoHideDuration={6000}
          onClose={() => setError({ status: false, message: "" })}
          color="danger"
          variant="solid"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {error.message}
        </Snackbar>,
        document.body
      )}
    </>
  );

  return (
    <StyledSourceStepper>
      {isUserReportOwner && (
        <PublicationSettingsForm
          visibility={visibility}
          setVisibility={setVisibility}
          handleSubmit={handleSubmit}
        />
      )}
      <Box>
        <Box
          sx={{
            height: 6,
            borderRadius: theme.radius.md,
            overflow: "hidden",
            display: "flex",
            bgcolor: "background.level1",
            boxShadow: `inset 0 1px 3px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
            marginTop: isUserReportOwner ? "10%" : "0",
          }}
        >
          {percentages.True > 0 && (
            <Tooltip
              title={`True: ${Math.round(percentages.True)}%`}
              variant="solid"
              placement="top"
            >
              <ProgressBarSegment
                color={getCategoryThemeColor(
                  "True",
                  theme.palette.mode === "dark" ? "400" : "300"
                )}
                width={`${percentages.True}%`}
              />
            </Tooltip>
          )}
          {percentages.Misleading > 0 && (
            <Tooltip
              title={`Misleading: ${Math.round(percentages.Misleading)}%`}
              variant="solid"
              placement="top"
            >
              <ProgressBarSegment
                color={getCategoryThemeColor(
                  "Misleading",
                  theme.palette.mode === "dark" ? "600" : "500"
                )}
                width={`${percentages.Misleading}%`}
              />
            </Tooltip>
          )}
          {percentages.False > 0 && (
            <Tooltip
              title={`False: ${Math.round(percentages.False)}%`}
              variant="solid"
              placement="top"
            >
              <ProgressBarSegment
                color={getCategoryThemeColor(
                  "False",
                  theme.palette.mode === "dark" ? "600" : "500"
                )}
                width={`${percentages.False}%`}
              />
            </Tooltip>
          )}
          {percentages.Unverifiable > 0 && (
            <Tooltip
              title={`Unverifiable: ${Math.round(percentages.Unverifiable)}%`}
              variant="solid"
              placement="top"
            >
              <ProgressBarSegment
                color={getCategoryThemeColor(
                  "Unverifiable",
                  theme.palette.mode === "dark" ? "600" : "500"
                )}
                width={`${percentages.Unverifiable}%`}
              />
            </Tooltip>
          )}
        </Box>
        <Stack
          direction="row"
          justifyContent="space-around"
          spacing={1}
          sx={{ mt: 1.5 }}
        >
          {Object.entries(percentages).map(([key, value]) => {
            if (value > 0) {
              return (
                <Typography
                  key={key}
                  level="body-sm"
                  sx={{
                    color: getCategoryThemeColor(
                      key,
                      theme.palette.mode === "dark" ? "50" : "700"
                    ),
                    fontWeight: "md",
                  }}
                >
                  {key}: {Math.round(value)}%
                </Typography>
              );
            }
            return null;
          })}
        </Stack>
      </Box>
      {report.notes && (
        <>
          <Divider />
          <Box>
            <Typography
              level="title-lg"
              sx={{
                mb: 1,
                fontWeight: "md",
                display: "flex",
                alignItems: "center",
                gap: 0.2,
                color: "text.primary",
              }}
            >
              <Info sx={{ color: "theme.palette.info.plainColor" }} />
              Analysis Notes
            </Typography>
            <Typography
              level="body-md"
              sx={{
                lineHeight: 1.5,
                color: "text.secondary",
              }}
            >
              {report.notes}
            </Typography>
          </Box>
        </>
      )}
      <Divider />
      {sourceDomains.length > 0 && (
        <Box>
          <Typography
            level="title-lg"
            sx={{
              mb: 1.5,
              fontWeight: "md",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Source sx={{ color: "theme.palette.primary.plainColor" }} />
            Source Domains
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {sourceDomains.map((domain, index) => (
              <Chip
                key={index}
                size="sm"
                variant="outlined"
                sx={{
                  fontWeight: "md",
                  borderRadius: "50px",
                  backgroundColor:
                    mode === "dark" ? "neutral.700" : "neutral.200",
                  color: mode === "dark" ? "neutral.200" : "neutral.800",
                }}
              >
                {domain}
              </Chip>
            ))}
          </Box>
        </Box>
      )}
      {snackbarPortal}
    </StyledSourceStepper>
  );
};
