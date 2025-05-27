import React, { useEffect, useState } from "react";
import {
  Card,
  AspectRatio,
  Typography,
  Chip,
  Button,
  IconButton,
  Sheet,
  Box,
  Divider,
  Badge,
  CardOverflow,
  CardContent,
  Skeleton,
  Select,
  Option,
  Stack,
  Alert,
} from "@mui/joy";
import {
  Bookmark,
  Share,
  BarChart,
  Eye,
  Clock,
  ArrowRight,
  FileText,
  BookmarkPlus,
  Search,
  Sparkles,
} from "lucide-react";
import { useColorScheme, useTheme } from "@mui/joy";
import {
  fetchArticles,
  fetchNews,
  checkIsLatestNews,
} from "../../services/newsService/newsService";
import { ArticleCard } from "./ArticleCard";

const Articles = ({ selectedTopic, sortOrder, query }) => {
  const { mode } = useColorScheme();
  const theme = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("1");
  const [pageSize, setPageSize] = useState("10");
  const [pageSizeError, setPageSizeError] = useState(null);
  const [isLatest, setIsLatest] = useState(true);
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const validatePageSize = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      return "Page size must be a number between 1 and 100.";
    }
    return null;
  };

  const handlePageSizeChange = (e, newValue) => {
    const error = validatePageSize(newValue);
    setPageSizeError(error);
    if (!error) {
      setPageSize(newValue);
    }
  };

  const handleFetchNews = async () => {
    if (pageSizeError) return;
    setLoading(true);
    try {
      await fetchNews(selectedTopic, "0.5", pageSize); // Fetch news for last 3 days (0.5 weeks)
      await handleFetchArticles();
      setIsLatest(true); // Assume fetch updates to latest
      setFetchEnabled(false);
    } catch (error) {
      console.error(error.message || "Error fetching news");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetchArticles(selectedTopic, dateRange);
      let fetchedArticles = response?.articles || [];

      // Sort articles based on sortOrder
      fetchedArticles = fetchedArticles.sort((a, b) => {
        const dateA = new Date(a.publishedAt);
        const dateB = new Date(b.publishedAt);
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
      });

      // Filter articles by query if not empty
      if (query && query.trim() !== "") {
        const queryLower = query.toLowerCase();
        fetchedArticles = fetchedArticles.filter((article) =>
          article.title?.toLowerCase().includes(queryLower)
        );
      }

      setArticles(fetchedArticles);
    } catch (error) {
      console.error(error?.response?.data?.detail);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckLatestNews = async () => {
    if (selectedTopic === "All") return;
    try {
      const response = await checkIsLatestNews(selectedTopic);
      console.log(response);
      setIsLatest(response.is_latest);
      setFetchEnabled(response.fetch_enabled);
    } catch (error) {
      console.error("Error checking latest news:", error.message);
    }
  };

  useEffect(() => {
    handleFetchArticles();
    handleCheckLatestNews();
  }, [selectedTopic, sortOrder, dateRange, query]);

  const titleColor = mode === "dark" ? "neutral.50" : "neutral.900";
  const descriptColor = mode === "dark" ? "neutral.300" : "neutral.600";

  return (
    <Box
      sx={{ width: "100%", maxWidth: "100%", mx: "auto", p: { xs: 1, sm: 2 } }}
    >
      {!isLatest && selectedTopic !== "All" && (
        <Alert
          variant="soft"
          color="warning"
          sx={{
            mb: 2,
            borderRadius: theme.radius.xs,
            bgcolor: mode === "dark" ? "warning.900" : "warning.200",
            color: mode === "dark" ? "neutral.50" : "neutral.900",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography level="body-md" sx={{ fontWeight: "md" }}>
            No recent articles found for {selectedTopic}. Fetch the latest news
            now.
          </Typography>
          <Button
            size="sm"
            variant="solid"
            onClick={handleFetchNews}
            sx={{
              borderRadius: theme.radius.xs,
              color: mode === "dark" ? "neutral.100" : "neutral.50",
              bgcolor: mode === "dark" ? "neutral.900" : "neutral.800",
              "&:hover": {
                bgcolor: mode === "dark" ? "neutral.800" : "neutral.900",
              },
            }}
            startDecorator={<Sparkles size={16} />}
          >
            Get Latest News
          </Button>
        </Alert>
      )}
      {articles.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            margin: "auto",
            width: "90%",
            marginTop: "2%",
            backgroundColor: "background.level2",
            padding: "3%",
            borderRadius: (theme) => theme.radius.xs,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 600,
            }}
          >
            <Typography level="h4" sx={{ color: titleColor }}>
              No articles found for{" "}
              {selectedTopic === "All" ? "all topics" : selectedTopic}
              {query && query.trim() !== "" ? ` with query "${query}"` : ""}.
            </Typography>
            <Typography level="body-sm" sx={{ color: descriptColor }}>
              Try fetching articles from a different time range or adjusting the
              query.
            </Typography>
            {pageSizeError && (
              <Typography level="body-sm" sx={{ color: "danger.500" }}>
                {pageSizeError}
              </Typography>
            )}
          </Stack>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 600,
              flexWrap: "wrap",
            }}
          >
            <Select
              value={dateRange}
              onChange={(e, newValue) => setDateRange(newValue)}
              startDecorator={<Search size={18} />}
              sx={{ minWidth: 150, borderRadius: (theme) => theme.radius.xs }}
              variant="outlined"
            >
              <Option value="1">1 Week</Option>
              <Option value="2">2 Weeks</Option>
              <Option value="4">4 Weeks</Option>
            </Select>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              startDecorator={<FileText size={18} />}
              sx={{ minWidth: 150, borderRadius: (theme) => theme.radius.xs }}
              variant="outlined"
            >
              {[10, 20, 50, 100].map((size) => (
                <Option key={size} value={size.toString()}>
                  {size} Articles
                </Option>
              ))}
            </Select>
            <Button
              startDecorator={<FileText size={18} />}
              size="sm"
              onClick={handleFetchNews}
              disabled={!!pageSizeError}
              sx={{
                backgroundColor: (mode) =>
                  mode === "dark" ? "neutral.100" : "neutral.900",
                color: (mode) =>
                  mode === "dark" ? "neutral.800" : "neutral.200",
                ":hover": {
                  backgroundColor: (mode) =>
                    mode === "dark" ? "neutral.400" : "neutral.700",
                },
                borderRadius: (theme) => theme.radius.xs,
              }}
            >
              Fetch News
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 3,
            margin: "auto",
            width: "90%",
            marginTop: "2%",
            backgroundColor: "background.level2",
            padding: "3%",
            borderRadius: (theme) => theme.radius.xs,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} variant="outlined" sx={{ height: "90%" }}>
                  <CardOverflow>
                    <AspectRatio ratio="16/8" sx={{ minHeight: 160 }}>
                      <Skeleton variant="rectangular" />
                    </AspectRatio>
                  </CardOverflow>
                  <CardContent sx={{ p: 2 }}>
                    <Skeleton
                      variant="text"
                      level="title-md"
                      sx={{ mb: 1, width: "80%" }}
                    />
                    <Skeleton
                      variant="text"
                      level="body-sm"
                      sx={{ mb: 2, width: "90%" }}
                    />
                    <Skeleton
                      variant="text"
                      level="body-sm"
                      sx={{ mb: 2, width: "90%" }}
                    />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton
                        variant="text"
                        level="body-xs"
                        sx={{ width: "50%" }}
                      />
                      <Skeleton variant="rectangular" width={80} height={32} />
                    </Box>
                  </CardContent>
                </Card>
              ))
            : articles.map((article, index) => (
                <ArticleCard article={article} index={index} />
              ))}
        </Box>
      )}
    </Box>
  );
};

export default Articles;
