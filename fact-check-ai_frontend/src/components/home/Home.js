import { useState, useEffect } from "react";
import {
  Sheet,
  Box,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Grid,
} from "@mui/joy";
import { Search, ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { useColorScheme, useTheme } from "@mui/joy";
import Articles from "./Articles";
import useAuthContext from "../../context/auth/authContext";
import { fetchTopics } from "../../services/newsService/newsService";
import SortIcon from "@mui/icons-material/Sort";
import { topicsList } from "../constants";
import { Globe } from "lucide-react";

// Mock fetchArticles service (replace with actual implementation)
const fetchArticles = async ({
  query = "",
  topic = "",
  sort = "latest",
  keywords = "",
}) => {
  // Simulated API call
  return [
    { id: 1, title: "Sample Article", topic, content: "Lorem ipsum..." },
    // Add more mock data as needed
  ];
};

export default function ArticleCard() {
  const { usermail } = useAuthContext();
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKeywords, setFilterKeywords] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  // Fetch topics on mount
  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetchTopics(usermail);
        console.log(response);
        setTopics(["All", ...response?.topics]); // Add "All" as the first option
      } catch (err) {
        setError("Failed to load topics");
      }
    };
    if (usermail) {
      getTopics();
    }
  }, [usermail]);

  // Fetch articles when topic, sort order, or keywords change
  useEffect(() => {
    const getArticles = async () => {
      try {
        const topicToFetch = selectedTopic === "All" ? "" : selectedTopic;
        const fetchedArticles = await fetchArticles({
          topic: topicToFetch,
          sort: sortOrder,
          keywords: filterKeywords,
        });
        setArticles(fetchedArticles);
      } catch (err) {
        setError("Failed to load articles");
      }
    };
    getArticles();
  }, [selectedTopic, sortOrder, filterKeywords]);

  const handleGeneralSearch = async () => {
    try {
      const fetchedArticles = await fetchArticles({ query: searchQuery });
      setArticles(fetchedArticles);
      setError("");
    } catch (err) {
      setError("Search failed");
    }
  };

  const handleTopicFilter = (topic) => {
    setSelectedTopic(topic);
    setError("");
  };

  const handleSortChange = (event, newValue) => {
    setSortOrder(newValue);
    setError("");
  };

  const handleFilterKeywords = (event) => {
    setFilterKeywords(event.target.value);
    setError("");
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.level1",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "50%",
          alignItems: "center",
          justifyContent: "center",
          margin: "2% auto", // This centers the box horizontally
        }}
      >
        <Input
          placeholder="Custom search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startDecorator={<Search size={18} />}
          sx={{ flex: 1, borderRadius: theme.radius.xs }} // Takes remaining space
        />
        <Button
          variant="solid"
          onClick={handleGeneralSearch}
          startDecorator={<Sparkles size={16} />}
          size="sm"
          sx={{
            backgroundColor: mode === "dark" ? "neutral.100" : "neutral.900",
            color: mode === "dark" ? "neutral.800" : "neutral.200",
            ":hover": {
              backgroundColor: mode === "dark" ? "neutral.400" : "neutral.700",
            },
            borderRadius: theme.radius.xs,
          }}
        >
          Search
        </Button>
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: theme.radius.xs,
          boxShadow: "sm",
          bgcolor: "background.surface",
          width: "100%",
        }}
      >
        {/* Content Header Section */}
        <Grid container spacing={2}>
          {/* Topic Filters */}
          <Grid xs={12} md={6}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                key="all"
                variant={selectedTopic === "All" ? "solid" : "outlined"}
                startDecorator={<Globe size={18} />}
                onClick={() => handleTopicFilter("All")}
                sx={{
                  transition: "all 0.3s ease",
                  backgroundColor:
                    selectedTopic === "All" ? "#0288D1" : "transparent",
                  borderColor: selectedTopic === "All" ? "#0288D1" : "#90A4AE",
                  color: selectedTopic === "All" ? "#FFFFFF" : "#90A4AE",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "sm",
                    backgroundColor:
                      selectedTopic === "All" ? "#0277BD" : "#ECEFF1",
                    borderColor:
                      selectedTopic === "All" ? "#0277BD" : "#90A4AE",
                    color: selectedTopic === "All" ? "#FFFFFF" : "#37474F",
                  },
                  borderRadius: theme.radius.xs,
                }}
              >
                All
              </Button>
              {topics
                .map((topicName) => {
                  const topic = topicsList.find((t) => t.name === topicName);
                  return topic ? { ...topic, name: topicName } : null;
                })
                .filter((topic) => topic !== null)
                .map((topic) => (
                  <Button
                    key={topic.id}
                    variant={
                      selectedTopic === topic.name ? "solid" : "outlined"
                    }
                    startDecorator={topic.icon}
                    onClick={() => handleTopicFilter(topic.name)}
                    sx={{
                      borderRadius: theme.radius.xs,
                      transition: "all 0.3s ease",
                      backgroundColor:
                        selectedTopic === topic.name
                          ? "#0288D1"
                          : "transparent",
                      borderColor:
                        selectedTopic === topic.name ? "#0288D1" : "#90A4AE",
                      color:
                        selectedTopic === topic.name ? "#FFFFFF" : "#90A4AE",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "sm",
                        backgroundColor:
                          selectedTopic === topic.name ? "#0277BD" : "#ECEFF1",
                        borderColor:
                          selectedTopic === topic.name ? "#0277BD" : "#90A4AE",
                        color:
                          selectedTopic === topic.name ? "#FFFFFF" : "#37474F",
                      },
                    }}
                  >
                    {topic.name}
                  </Button>
                ))}
            </Box>
          </Grid>

          {/* Sort and Keyword Filter */}
          <Grid xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 150 }}>
                <Select
                  value={sortOrder}
                  onChange={handleSortChange}
                  startDecorator={<SortIcon />}
                  sx={{ borderRadius: theme.radius.xs }}
                >
                  <Option
                    value="latest"
                    startDecorator={<ArrowDown size={18} />}
                  >
                    Latest
                  </Option>
                  <Option value="oldest" startDecorator={<ArrowUp size={18} />}>
                    Oldest
                  </Option>
                </Select>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Input
                  placeholder="Filter by keywords..."
                  value={filterKeywords}
                  onChange={handleFilterKeywords}
                  startDecorator={<Search size={18} />}
                  sx={{ borderRadius: theme.radius.xs }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Error Message */}
        {error && (
          <Typography level="body-sm" color="danger" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Sheet>

      {/* Articles List */}
      <Articles selectedTopic={selectedTopic} sortOrder={sortOrder} query={filterKeywords} />
    </Box>
  );
}
