import React, { useState } from "react";
import {
  useColorScheme,
  Avatar,
  Tooltip,
  AvatarGroup,
  Modal,
  ModalDialog,
  List,
  ListItem,
  Typography,
  Button,
  Stack,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { getReport } from "../../services/newsService/newsService";

const ReportAvatar = ({ reports, articleId }) => {
  const { mode } = useColorScheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState({ status: false, message: "" });

  const publicReports = reports.filter(
    (report) =>
      report.user_email &&
      typeof report.user_email === "string" &&
      report.settings === "public"
  );

  const handleOpen = () => {
    if (publicReports.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError({ status: false, message: "" });
    setSuccess({ status: false, message: "" });
  };

  const handleGetReport = async (reportId, articleId) => {
    setLoading(true);
    setError({ status: false, message: "" });
    setSuccess({ status: false, message: "" });
    try {
      const response = await getReport(reportId, articleId);
      setSuccess({
        status: true,
        message: `Report fetched successfully. Report ID: ${reportId}`,
      });
      navigate(`/report/${reportId}`, {
        state: {
          report: response?.report?.fact_check_report,
          article: response?.article?.article,
          sources: response.report?.source_report || [],
          reports_: response?.article?.reports || [],
          articleId: response?.article?.article_id,
          reportId_: reportId,
        },
      });
    } catch (error) {
      setError({
        status: true,
        message: error.message || "Failed to fetch report",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip
        title={reports.length > 0 ? `${reports.length} Public Reports` : "No Public Reports"}
        sx={{
          bgcolor: mode === "dark" ? "neutral.800" : "background.surface",
          color: mode === "dark" ? "neutral.100" : "neutral.900",
          borderRadius: "sm",
          boxShadow:
            mode === "dark"
              ? "0 2px 8px rgba(0,0,0,0.4)"
              : "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "sm",
          padding: "8px 12px",
        }}
      >
        <AvatarGroup
          size="sm"
          sx={{
            "--Avatar-size": "28px",
            "--AvatarGroup-gap": "-10px",
            "& .MuiAvatar-root": {
              border: `2px solid ${mode === "dark" ? "#424242" : "#ffffff"}`,
              bgcolor: mode === "dark" ? "neutral.700" : "neutral.200",
              color: mode === "dark" ? "neutral.100" : "neutral.800",
              fontSize: "14px",
              fontWeight: 500,
              transition: "transform 0.2s ease",
              cursor: "pointer",
            },
          }}
          onClick={handleOpen}
        >
          {publicReports.slice(0, 3).map((report, idx) => (
            <Avatar key={idx} alt={report.user_email}>
              {report.user_email.charAt(0).toUpperCase()}
            </Avatar>
          ))}
          {publicReports.length > 3 && (
            <Avatar
              sx={{
                bgcolor: mode === "dark" ? "primary.700" : "primary.200",
                color: mode === "dark" ? "primary.100" : "primary.800",
              }}
            >
              +{publicReports.length - 3}
            </Avatar>
          )}
        </AvatarGroup>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            bgcolor: mode === "dark" ? "neutral.800" : "background.surface",
            borderRadius: "md",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0,0,0,0.4)"
                : "0 4px 12px rgba(0,0,0,0.15)",
            padding: 3,
            maxWidth: "700px",
            width: "90%",
          }}
        >
          <List
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              "--ListItem-paddingY": "12px",
              "--ListItem-paddingX": "16px",
            }}
          >
            {publicReports.map((report, idx) => (
              <ListItem
                key={idx}
                sx={{
                  bgcolor: mode === "dark" ? "neutral.700" : "neutral.100",
                  borderRadius: "sm",
                  mb: 1,
                  "&:last-child": { mb: 0 },
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "neutral.600" : "neutral.200",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
                  <Typography
                    level="body-sm"
                    sx={{
                      color: mode === "dark" ? "neutral.200" : "neutral.800",
                      fontWeight: "md",
                      width: "30px",
                    }}
                  >
                    {idx + 1}.
                  </Typography>
                  <Stack direction="column" sx={{ flex: 1 }}>
                    <Typography
                      level="body-sm"
                      sx={{
                        color: mode === "dark" ? "neutral.100" : "neutral.900",
                      }}
                    >
                      {report.user_email}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: mode === "dark" ? "neutral.400" : "neutral.600",
                      }}
                    >
                      Visibility: {report.settings}
                    </Typography>
                  </Stack>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleGetReport(report.report_id, articleId)}
                    disabled={loading}
                    sx={{
                      borderRadius: "sm",
                      fontWeight: "md",
                      bgcolor: mode === "dark" ? "primary.700" : "primary.100",
                      color: mode === "dark" ? "primary.100" : "primary.800",
                      "&:hover": {
                        bgcolor: mode === "dark" ? "primary.600" : "primary.200",
                      },
                    }}
                  >
                    Open
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
          {(error.status || success.status) && (
            <Typography
              level="body-sm"
              sx={{
                mt: 2,
                color: error.status
                  ? mode === "dark" ? "danger.300" : "danger.600"
                  : mode === "dark" ? "success.300" : "success.600",
                textAlign: "center",
              }}
            >
              {error.status ? error.message : success.message}
            </Typography>
          )}
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ReportAvatar;