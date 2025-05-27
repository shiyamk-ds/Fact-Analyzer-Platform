import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
  IconButton,
  useColorScheme,
  CircularProgress,
  Button,
} from "@mui/joy";
import { ThumbUp, ThumbDown, CheckCircle, Circle } from "@mui/icons-material";
import { getFeed } from "../../services/newsService/newsService";
import HelpIcon from '@mui/icons-material/Help';
import ErrorIcon from '@mui/icons-material/Error';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


const SocialMediaFeed = () => {
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const { mode } = useColorScheme();
  const carouselRefs = useRef(new Map());

  const handleGetFeed = async () => {
    try {
      setLoading(true);
      const response = await getFeed();
      const fetchedReports = Array.isArray(response?.reports) ? response.reports : [];
      setReports(fetchedReports);
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeed();
  }, []);

  useEffect(() => {
    setPosts(
      reports
        .filter(
          (report) =>
            report.article &&
            report.article.title &&
            report.user_email &&
            report.report_id
        )
        .map((report) => ({
          ...report,
          likes: report.likes || 0,
          dislikes: report.dislikes || 0,
        }))
    );
  }, [reports]);

  const handleLike = (reportId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.report_id === reportId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (reportId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.report_id === reportId
          ? { ...post, dislikes: post.dislikes + 1 }
          : post
      )
    );
  };

  const toggleNote = (reportId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const scrollCarousel = (reportId, direction) => {
    const carousel = carouselRefs.current.get(reportId);
    if (carousel) {
      const scrollAmount = carousel.offsetWidth / 2;
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getClaimIcon = (category) => {
    const size = 16;
    switch (category) {
      case "True":
        return <CheckCircle sx={{ fontSize: size, color: "#2e7d32" }} />;
      case "False":
        return <Circle sx={{ fontSize: size, color: "#d32f2f" }} />;
      case "Misleading":
        return <ErrorIcon sx={{ fontSize: size, color: "#f57c00" }} />;
      case "Unverifiable":
        return <HelpIcon sx={{ fontSize: size, color: mode === "dark" ? "#e0e0e0" : "#424242" }} />;
      default:
        return null;
    }
  };

  const getClaimSummary = (claims) => {
    if (!Array.isArray(claims)) return [];
    const summary = { True: 0, False: 0, Misleading: 0, Unverifiable: 0 };
    claims.forEach((claim) => {
      if (claim.fact_check_category in summary) {
        summary[claim.fact_check_category]++;
      }
    });
    return Object.entries(summary)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({ category, count }));
  };

  return (
    <Box
      sx={{
        maxWidth: "700px",
        mx: "auto",
        p: { xs: 1, sm: 2 },
        bgcolor: "background.body",
        minHeight: "100vh",
      }}
      className="w-full"
    >
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size="md" />
        </Box>
      )}
      {error && (
        <Typography
          level="body-md"
          sx={{
            color: mode === "dark" ? "danger.300" : "danger.600",
            textAlign: "center",
            py: 2,
          }}
        >
          {error}
        </Typography>
      )}
      {!loading && !error && posts.length === 0 && (
        <Typography
          level="body-md"
          sx={{
            color: mode === "dark" ? "neutral.400" : "neutral.600",
            textAlign: "center",
            py: 2,
          }}
        >
          No posts available
        </Typography>
      )}
      {posts.map((post) => {
        const images = [
          post.article.urlToImage,
          ...(post.images ? post.images.map((img) => img.image_url) : []),
        ].filter(Boolean);
        const claimSummary = getClaimSummary(post.fact_check_report?.claims);

        return (
          <Card
            key={post.report_id}
            sx={{
              mb: 3,
              borderRadius: "lg",
              border: "none",
              boxShadow:
                mode === "dark"
                  ? "0 2px 10px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
              bgcolor: mode === "dark" ? "neutral.800" : "background.surface",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow:
                  mode === "dark"
                    ? "0 6px 16px rgba(0,0,0,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
            className="w-full"
          >
            <Stack direction="column" spacing={2} sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: { xs: 24, sm: 24 },
                    height: { xs: 24, sm: 24 },
                    bgcolor: mode === "dark" ? "neutral.700" : "neutral.200",
                    color: mode === "dark" ? "neutral.100" : "neutral.800",
                  }}
                >
                  {post.user_email.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    level="body-md"
                    sx={{
                      fontWeight: "md",
                      color: mode === "dark" ? "neutral.100" : "neutral.900",
                    }}
                  >
                    {post.user_email}
                  </Typography>
                  <Typography
                    level="body-xs"
                    sx={{
                      color: mode === "dark" ? "neutral.400" : "neutral.600",
                    }}
                  >
                    {new Date(post.article.publishedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
              {images.length > 0 ? (
                <Box sx={{ position: "relative" }}>
                  <Box
                    ref={(el) => carouselRefs.current.set(post.report_id, el)}
                    sx={{
                      display: "flex",
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                      gap: 1,
                      py: 1,
                    }}
                    className="snap-x"
                  >
                    {images.map((src, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: "0 0 100%",
                          scrollSnapAlign: "start",
                        }}
                      >
                        <img
                          src={src}
                          alt={`Image ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                  <IconButton
                    size="sm"
                    variant="solid"
                    color="neutral"
                    onClick={() => scrollCarousel(post.report_id, "left")}
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: mode === "dark" ? "neutral.700" : "neutral.200",
                      "&:hover": {
                        bgcolor: mode === "dark" ? "neutral.600" : "neutral.300",
                      },
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="solid"
                    color="neutral"
                    onClick={() => scrollCarousel(post.report_id, "right")}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: mode === "dark" ? "neutral.700" : "neutral.200",
                      "&:hover": {
                        bgcolor: mode === "dark" ? "neutral.600" : "neutral.300",
                      },
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      right: 8,
                      bgcolor: mode === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
                      borderRadius: "sm",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    {claimSummary.length > 0 ? (
                      claimSummary.map(({ category, count }) => (
                        <Stack
                          key={category}
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {getClaimIcon(category)}
                          <Typography
                            level="body-xs"
                            sx={{
                              color:
                                mode === "dark" ? "neutral.100" : "neutral.900",
                              fontWeight: "md",
                            }}
                          >
                            {count}
                          </Typography>
                        </Stack>
                      ))
                    ) : (
                      <Typography
                        level="body-xs"
                        sx={{
                          color: mode === "dark" ? "neutral.100" : "neutral.900",
                          fontWeight: "md",
                        }}
                      >
                        No claims verified
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "250px",
                    bgcolor: mode === "dark" ? "neutral.700" : "neutral.200",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    level="body-sm"
                    sx={{
                      color: mode === "dark" ? "neutral.400" : "neutral.600",
                    }}
                  >
                    No images available
                  </Typography>
                </Box>
              )}
              <Typography
                level="h6"
                sx={{
                  fontWeight: "md",
                  color: mode === "dark" ? "neutral.100" : "neutral.900",
                  mb: 1,
                }}
                className="line-clamp-2"
              >
                {post.article.title}
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  color: mode === "dark" ? "neutral.400" : "neutral.600",
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: expandedNotes[post.report_id] ? "unset" : 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.fact_check_report?.notes || "No notes available"}
                {!expandedNotes[post.report_id] &&
                  post.fact_check_report?.notes && (
                    <Button
                      variant="plain"
                      color="primary"
                      size="sm"
                      onClick={() => toggleNote(post.report_id)}
                      sx={{ ml: 1, fontWeight: "md" }}
                    >
                      Read More
                    </Button>
                  )}
                {expandedNotes[post.report_id] && (
                  <Button
                    variant="plain"
                    color="primary"
                    size="sm"
                    onClick={() => toggleNote(post.report_id)}
                    sx={{ ml: 1, fontWeight: "md" }}
                  >
                    Show Less
                  </Button>
                )}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1 }}
              >
                <Typography
                  level="body-xs"
                  sx={{
                    color: mode === "dark" ? "neutral.300" : "neutral.700",
                  }}
                >
                  {post.article.source.name}
                </Typography>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    bgcolor: "neutral.400",
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  level="body-xs"
                  sx={{
                    color: mode === "dark" ? "neutral.300" : "neutral.700",
                  }}
                >
                  {post.fact_check_report?.overall_category || "Unverified"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleLike(post.report_id)}
                    sx={{
                      "&:hover": {
                        bgcolor: mode === "dark" ? "neutral.700" : "neutral.100",
                      },
                    }}
                  >
                    <ThumbUp sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography
                    level="body-xs"
                    sx={{
                      color: mode === "dark" ? "neutral.200" : "neutral.800",
                    }}
                  >
                    {post.likes}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleDislike(post.report_id)}
                    sx={{
                      "&:hover": {
                        bgcolor: mode === "dark" ? "neutral.700" : "neutral.100",
                      },
                    }}
                  >
                    <ThumbDown sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography
                    level="body-xs"
                    sx={{
                      color: mode === "dark" ? "neutral.200" : "neutral.800",
                    }}
                  >
                    {post.dislikes}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        );
      })}
    </Box>
  );
};

export default SocialMediaFeed;