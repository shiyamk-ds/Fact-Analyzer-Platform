import React from "react";
import {
  Box,
  Card,
  Typography,
  Switch,
  Button,
  Tooltip,
  useTheme,
} from "@mui/joy";
import { Public, PublicOff, Save } from "@mui/icons-material";

// PublicationSettingsForm Component
const PublicationSettingsForm = ({ visibility, setVisibility, handleSubmit }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: theme.spacing(3),
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.lg,
        backgroundColor: theme.palette.background.surface,
      }}
    >

      <Box sx={{ mb: theme.spacing(3) }}>
        <Typography level="body-md" sx={{ mb: 1, fontWeight: "md" }}>
          Visibility
        </Typography>
        <Tooltip
          title={visibility === "public" ? "Post visible to all" : "Post visible only to you"}
          placement="top"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
              Private
            </Typography>
            <Switch
              checked={visibility === "public"}
              onChange={(event) => setVisibility(event.target.checked ? "public" : "private")}
              startDecorator={<PublicOff />}
              endDecorator={<Public />}
              color={visibility === "public" ? "success" : "neutral"}
            />
            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
              Public
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      <Button
        onClick={handleSubmit}
        color={visibility === "public" ? "primary" : "neutral"}
        startDecorator={<Save />}
        sx={{
          borderRadius:4,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: theme.shadow.md,
          },
        }}
      >
        {visibility === "public" ? "Save & Publish" : "Save as Private"}
      </Button>
    </Card>
  );
};

export default PublicationSettingsForm;