import AuthPage from "./components/auth/AuthPage";
import { Box } from "@mui/joy";
import { NavBar } from "./components/nav/TopNav";
import ArticleList from "./components/home/Home";
import FactCheckReport from "./components/Report/Report";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import useAuthContext from "./context/auth/authContext";
import CardListDashboard from "./components/Report/ReportDashboard";
import SocialMediaFeed from "./components/feed/SocialMedia";

function App() {
  const { authToken } = useAuthContext();

  return (
    <Box sx={{ backgroundColor: "background.level1", width: "100%" }}>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/articles"
          element={
            authToken ? <ArticleList /> : <Navigate to="/login" replace />
          }
        />

        {/* Default route - redirect based on auth status */}
        <Route
          path="/"
          element={
            authToken ? (
              <Navigate to="/articles" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/report/:report_id"
          element={
            authToken ? <ReportRoute /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/report-dashboard"
          element={
            authToken ? <CardListDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/feed"
          element={
            authToken ? <SocialMediaFeed /> : <Navigate to="/login" replace />
          }
        />
        {/* Other routes */}
      </Routes>
    </Box>
  );
}

const ReportRoute = () => {
  const location = useLocation();
  const { report, article, sources, reports_, articleId, reportId_ } = location.state || {};

  // Handle case where state is missing (e.g., direct navigation)
  if (!report || !article) {
    return <Navigate to="/" replace />; // Redirect to home or error page
  }

  return (
    <FactCheckReport report={report} articleId={articleId} article={article} sources={sources} reports={reports_} reportId={reportId_}  />
  );
};

export default App;
