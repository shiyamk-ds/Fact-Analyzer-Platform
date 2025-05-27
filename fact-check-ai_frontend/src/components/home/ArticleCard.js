import React, { useState } from "react";
import {
  useColorScheme,
  Card,
  CardOverflow,
  AspectRatio,
  Sheet,
  Chip,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/joy";
import { Eye, Clock, Sparkles, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  factAnalysis,
  getReport,
} from "../../services/newsService/newsService";
import ReportAvatar from "./ReportAvatar";

export const ArticleCard = ({ article, index }) => {
  const { mode } = useColorScheme();
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Check if article is within 3 days
  const isRecent = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInDays = Math.floor((now - publishedDate) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3;
  };

  const authorName = mode === "dark" ? "neutral.400" : "neutral.500";
  const chipText = mode === "dark" ? "neutral.200" : "neutral.900";
  const chipBG = mode === "dark" ? "neutral.900" : "neutral.50";
  const titleColor = mode === "dark" ? "neutral.50" : "neutral.900";
  const descriptColor = mode === "dark" ? "neutral.300" : "neutral.600";
  const recentBorderColor = mode === "dark" ? "primary.600" : "primary.400";

  // Ensure reports is an array, default to empty array if undefined or null
  const reports = Array.isArray(article.reports) ? article.reports : [];
  // Check if current user's email is in reports
  const userEmail = localStorage.getItem("email");
  const userReport = reports.find((report) => report.user_email === userEmail);
  const isAnalyzedByUser = !!userReport;

  const handleFactAnalysis = async (articleId) => {
    setLoading(true);
    setError({ status: false, message: "" });
    setSuccess({ status: false, message: "" });
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        setError({
          status: true,
          message: "Email not found. Please log in.",
        });
        setLoading(false);
        return;
      }
      const response = await factAnalysis(articleId, email);
      setSuccess({
        status: true,
        message: `Fact analysis completed. Report ID: ${response.report_id}`,
      });
    } catch (error) {
      setError({
        status: true,
        message: error.message || "Fact analysis failed",
      });
    } finally {
      setLoading(false);
    }
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
          reportId_ : reportId
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

  const handleGoToReport = () => {
    if (userReport) {
      handleGetReport(userReport.report_id, article?.article_id);
    }
  };

  const snackbarPortal = (
    <>
      {createPortal(
        <Snackbar
          open={success.status}
          autoHideDuration={600000}
          color="success"
          variant="solid"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          startDecorator={<Sparkles size={20} />}
          endDecorator={
            isAnalyzedByUser && (
              <Button
                onClick={() => handleGoToReport()}
                size="sm"
                variant="soft"
                startDecorator={<Eye size={16} />}
              >
                Go to Report
              </Button>
            )
          }
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
    <>
      <Card
        key={index}
        variant="outlined"
        sx={{
          height: "90%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "md",
            borderColor: "primary.300",
          },
          bgcolor: "background.surface",
          borderColor: isRecent(article.publishedAt) ? recentBorderColor : undefined,
        }}
      >
        <CardOverflow sx={{ position: "relative" }}>
          {isRecent(article.publishedAt) && (
            <Chip
              size="sm"
              startDecorator={<Flame size={14} />}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                fontWeight: 500,
                fontSize: "10px",
                backgroundColor: mode === "dark" ? "secondary.700" : "secondary.700",
                color: mode === "dark" ? "neutral.200" : "neutral.200",
                borderRadius: (theme) => theme.radius.sm,
                zIndex: 1,
              }}
            >
              Latest
            </Chip>
          )}
          <AspectRatio
            ratio="16/8"
            sx={{ minHeight: 160, position: "relative" }}
          >
            <img
              src={article.urlToImage || "/api/placeholder/400/300"}
              alt={article.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
            <Sheet
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: 2,
                py: 1,
                borderRadius: (theme) => theme.radius.xs,
                fontSize: "xs",
                fontWeight: "md",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                boxShadow: "sm",
                backgroundColor: "rgba(30, 30, 30,.6)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {article.source.name}
                <Chip
                  size="sm"
                  startDecorator={<Clock size={14} />}
                  sx={{
                    fontWeight: 400,
                    fontSize: "10px",
                    backgroundColor: chipBG,
                    color: chipText,
                    textTransform: "lowercase",
                    borderRadius: (theme) => theme.radius.lg,
                  }}
                >
                  {getTimeAgo(article.publishedAt)}
                </Chip>
              </Box>
              <Typography
                level="body-xs"
                sx={{ color: "white", opacity: 0.8, fontSize: "80%" }}
              >
                {article.author ? `By ${article.author}` : "Unknown author"}
              </Typography>
            </Sheet>
          </AspectRatio>
        </CardOverflow>
        <CardContent
          sx={{
            p: 2,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            level="title-md"
            sx={{
              mb: 1,
              color: titleColor,
              fontWeight: "bold",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {article.title}
          </Typography>
          <Box
            sx={{
              position: "relative",
              flexGrow: 1,
              mb: 2,
              lineHeight: 1.5,
              maxHeight: "3.75em",
              overflow: "hidden",
            }}
          >
            <Typography
              level="body-sm"
              sx={{
                color: descriptColor,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                position: "relative",
                pr: 8,
                "&:after": {
                  content: '"Read More"',
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  color: "primary.500",
                  background: `linear-gradient(90deg, transparent, ${
                    mode === "dark" ? "neutral.900" : "neutral.0"
                  } 50%)`,
                  paddingLeft: "12px",
                  cursor: "pointer",
                },
                "&:hover:after": {
                  textDecoration: "underline",
                },
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  window.open(article.url, "_blank");
                }
              }}
            >
              {article.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ReportAvatar reports={reports} articleId={article?.article_id} />
            <Button
              startDecorator={
                loading ? (
                  <CircularProgress size="sm" />
                ) : isAnalyzedByUser ? (
                  <Eye size={16} />
                ) : (
                  <Sparkles size={16} />
                )
              }
              size="sm"
              onClick={() =>
                isAnalyzedByUser
                  ? handleGetReport(userReport.report_id, article?.article_id)
                  : handleFactAnalysis(article.article_id)
              }
              disabled={loading}
              sx={{
                borderRadius: (theme) => theme.radius.xs,
                backgroundColor: isAnalyzedByUser
                  ? "success.300"
                  : "warning.200",
                color: "neutral.900",
                ":hover": {
                  backgroundColor: isAnalyzedByUser
                    ? "success.500"
                    : "warning.500",
                },
                opacity: loading ? 0.6 : 0.8,
              }}
            >
              {isAnalyzedByUser ? "Report" : "Analyze"}
            </Button>
          </Box>
        </CardContent>
      </Card>
      {snackbarPortal}
    </>
  );
};