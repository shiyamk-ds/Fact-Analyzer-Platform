import { api } from "../api/client";

const fetchTopics = async (email) => {
  try {
    console.log(email);
    const response = await api.get(`/get-topics?email=${email}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Fetching topics failed");
  }
};

const fetchArticles = async (topic) => {
  try {
    const response = await api.get(`/get-news-by-topic?topic=${topic}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Fetching articles failed");
  }
};

const fetchNews = async (topic, dateRange, pageSize) => {
  try {
    const today = new Date();
    const days = parseInt(dateRange) * 7;
    const dateStr = new Date(today - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const payload = {
      country: "",
      topics: [topic],
      date_str: dateStr,
      page_size: parseInt(pageSize),
    };

    const response = await api.post("/fetch-news", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Fetching articles failed");
  }
};

const factAnalysis = async (articleId, email) => {
  try {
    const response = await api.post(
      `/fact-analysis?article_id=${articleId}&email=${email}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Fact analysis failed");
  }
};

const getReport = async (reportId, articleId) => {
  try {
    const response = await api.get(
      `/get-report?report_id=${reportId}&article_id=${articleId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Failed to fetch report");
  }
};

const getReportSummary = async (email) => {
  try {
    const response = await api.get(`/fetch-report-summary?email=${email}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Failed to fetch report");
  }
};

const updateSettings = async (settings, articleId, reportId) => {
  try {
    const response = await api.put(
      `/set-save?settings=${encodeURIComponent(settings)}&article_id=${encodeURIComponent(articleId)}&report_id=${encodeURIComponent(reportId)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Failed to update settings");
  }
};

const getFeed = async (email) => {
  try {
    const response = await api.get(`/get-published-reports`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Failed to fetch report");
  }
};

const checkIsLatestNews = async (topic) => {
  try {
    const response = await api.get(`/check-latest-news?topic=${topic}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data.detail || "Failed to check stasus ");
  }
};
export {
  fetchTopics,
  fetchArticles,
  fetchNews,
  factAnalysis,
  getReport,
  getReportSummary,
  updateSettings,
  getFeed,
  checkIsLatestNews
};
