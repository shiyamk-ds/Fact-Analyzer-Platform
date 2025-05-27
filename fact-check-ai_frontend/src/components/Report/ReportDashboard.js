import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  Avatar,
  useColorScheme,
  Stack,
} from "@mui/joy";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertCircle,
  Clock,
  Newspaper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getReportSummary,
  getReport,
} from "../../services/newsService/newsService";

const ArticleDashboard = () => {
  const navigate = useNavigate();
  const { mode } = useColorScheme();
  const [articles, setArticles] = useState([]);

  const getClaimIcon = (category) => {
    const size = 14;
    const color = mode === "dark" ? "neutral.50" : "neutral.800";
    switch (category) {
      case "True":
        return <CheckCircle size={size} color="#4caf50" />;
      case "False":
        return <XCircle size={size} color="#f44336" />;
      case "Misleading":
        return <AlertCircle size={size} color="#ff9800" />;
      default:
        return <HelpCircle size={size} color={mode === 'dark' ? '#fff' : '#000'} />;
    }
  };

  const fetchReportSummary = async () => {
    try {
      const userMail = localStorage.getItem('email')
      const response = await getReportSummary(userMail);
      setArticles(Array.isArray(response?.articles) ? response.articles : []);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchReportSummary();
  }, []);

  const handleGetReport = async (reportId, articleId) => {
    try {
      const response = await getReport(reportId, articleId);
      // Navigate to report page with fetched data
      navigate(`/report/${reportId}`, {
        state: {
          report: response?.report?.fact_check_report,
          article: response?.article?.article,
          sources: response?.report?.source_report || [], // Assume sources is in report or empty array
          reports_: response?.article?.reports || [],
          articleId: response?.article?.article_id,
          reportId_ : reportId
        },
      });
    } catch (error) {
    } finally {
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: "800px",
        mx: "auto",
        bgcolor: "background.level1",
        minHeight: "100vh",
        height:'auto'
      }}
    >
      {articles.map((item) => (
        <Card
          key={item.article.article_id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: "sm",
            boxShadow: "none",
            border: "1px solid",
            borderColor: mode === "dark" ? "neutral.700" : "neutral.200",
            "&:hover": {
              borderColor: "primary.500",
            },
            bgcolor: mode === "dark" ? "neutral.900" : "background.surface",
          }}
          onClick={() =>
            handleGetReport(item.report_id, item?.article?.article_id)
          }
        >
          <Stack direction="row" spacing={2}>
            <Avatar
              src={item.article.article.urlToImage}
              sx={{ width: 100, height: 100, borderRadius: "sm" }}
              variant="outlined"
            />

            <Box sx={{ flex: 1 }}>
              <Typography level="h4" sx={{ mb: 1 }}>
                {item.title}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 1.5, alignItems: "center" }}
              >
                <Newspaper size={14} />
                <Typography level="body-xs">
                  {item.article.article.source.name}
                </Typography>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    bgcolor: "neutral.500",
                    borderRadius: "50%",
                  }}
                />
                <Clock size={14} />
                <Typography level="body-xs">
                  {new Date(
                    item.article.article.publishedAt
                  ).toLocaleDateString()}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                {Object.entries(item.claim_counts).map(([category, count]) => (
                  <Box
                    key={category}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {getClaimIcon(category)}
                    <Typography level="body-sm" sx={{ ml: 0.5 }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Card>
      ))}
    </Box>
  );
};

export default ArticleDashboard;
