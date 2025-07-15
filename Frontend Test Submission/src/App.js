import React, { useState } from "react";
import "./App.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
} from "@mui/material";

import {
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function URLShortenerPage() {
  const [urls, setUrls] = useState([
    { originalUrl: "", validity: "", shortcode: "", preferred: "", errors: {} },
  ]);
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    // Clear error on change
    if (newUrls[idx].errors[field]) newUrls[idx].errors[field] = "";
    setUrls(newUrls);
  };

  const handleAdd = () => {
    if (urls.length < 5) {
      setUrls([
        ...urls,
        {
          originalUrl: "",
          validity: "",
          shortcode: "",
          preferred: "",
          errors: {},
        },
      ]);
    }
  };

  const handleRemove = (idx) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== idx));
    }
  };

  const validate = () => {
    let valid = true;
    const newUrls = urls.map((u) => {
      const errors = {};
      if (!u.originalUrl.trim()) {
        errors.originalUrl = "Original URL is required";
        valid = false;
      } else if (!/^https?:\/\//.test(u.originalUrl.trim())) {
        errors.originalUrl = "URL must start with http:// or https://";
        valid = false;
      }
      if (
        u.validity &&
        (!/^\d+$/.test(u.validity) || parseInt(u.validity) < 1)
      ) {
        errors.validity = "Validity must be a positive integer (minutes)";
        valid = false;
      }
      // Shortcode and preferred are optional, but you can add more rules if needed
      return { ...u, errors };
    });
    setUrls(newUrls);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO: Replace with backend API call
    setTimeout(() => {
      setResults(
        urls.map((u, i) => ({
          shortUrl: `https://test.ly/${u.shortcode || "abc" + (i + 1)}`,
          expiry: u.validity ? `${u.validity} min` : "No expiry",
          originalUrl: u.originalUrl,
        }))
      );
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        URL Shortener
      </Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          {urls.map((u, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Original URL"
                  value={u.originalUrl}
                  onChange={(e) =>
                    handleChange(idx, "originalUrl", e.target.value)
                  }
                  error={!!u.errors.originalUrl}
                  helperText={u.errors.originalUrl}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Validity (min)"
                  value={u.validity}
                  onChange={(e) =>
                    handleChange(idx, "validity", e.target.value)
                  }
                  error={!!u.errors.validity}
                  helperText={u.errors.validity}
                  fullWidth
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Shortcode (optional)"
                  value={u.shortcode}
                  onChange={(e) =>
                    handleChange(idx, "shortcode", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Tooltip title={urls.length > 1 ? "Remove" : ""}>
                  <span>
                    <IconButton
                      onClick={() => handleRemove(idx)}
                      disabled={urls.length === 1}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title={
                    urls.length < 5 && idx === urls.length - 1 ? "Add" : ""
                  }
                >
                  <span>
                    <IconButton
                      onClick={handleAdd}
                      disabled={urls.length >= 5 || idx !== urls.length - 1}
                      color="primary"
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? "Shortening..." : "Shorten URLs"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Shortened URLs
          </Typography>
          <List>
            {results.map((r, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <strong>Short URL:</strong>{" "}
                        <a
                          href={r.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.shortUrl}
                        </a>
                        {" | "}
                        <strong>Expiry:</strong> {r.expiry}
                      </>
                    }
                    secondary={
                      <>
                        <strong>Original:</strong> {r.originalUrl}
                      </>
                    }
                  />
                </ListItem>
                {i < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}

function StatisticsPage() {
  // Placeholder for statistics display
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shortened URL Statistics
      </Typography>
      {/* TODO: Add statistics table/list */}
      <Typography variant="body2" color="text.secondary">
        Statistics will be shown here.
      </Typography>
    </Paper>
  );
}

function App() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Test URL Shortener
          </Typography>
        </Toolbar>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Shorten URL" />
          <Tab label="Statistics" />
        </Tabs>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          {tab === 0 && <URLShortenerPage />}
          {tab === 1 && <StatisticsPage />}
        </Box>
      </Container>
    </div>
  );
}

export default App;
