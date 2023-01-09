import { useCallback } from "react";

// @mui/material
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box, Typography, IconButton } from "@mui/material";

// @mui/icons-material
import { Search, DarkMode, LightMode } from "@mui/icons-material";

// components
import BackButton from "../BackButton/BackButton";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useSearch } from "../../context/SearchProvider";
import { useHistory } from "../../context/HistoryProvider";
import { useLanguage } from "../../context/LanguageProvider";
import SearchWrapper from "../SearchWrapper/SearchWrapper";

const AppBar = () => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { historyState } = useHistory();
  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();
  const { searchState, setSearchState } = useSearch();

  const toggleMode = () => setModeState({ type: "toggle" });

  const topBarHeight = useCallback(() => {
    let returnHeight = 60;
    if (biggerThanMD) {
      if (searchState.showHistory && searchState.showSearch) returnHeight += 50;
      if (searchState.showFilters) returnHeight += 55;
    } else {
      if (searchState.showFilters) returnHeight += 55;
      if (searchState.showSearch) {
        returnHeight += 55;
        if (searchState.showHistory) {
          if (historyState.length) returnHeight += 50;
          else returnHeight += 40;
        }
      }
    }
    return `${returnHeight}px`;
  }, [biggerThanMD, searchState, historyState]);

  return (
    <Box
      sx={{
        width: "100%",
        zIndex: 99,
        position: "fixed",
        top: 0,
        left: 0,
        padding: "10px 20px",
        overflow: "hidden",
        transition: "height 200ms ease",
        height: topBarHeight(),
        background: theme.palette.background.paper,
        borderBottom: "1px solid",
        borderColor: "rgba(87,87,87,0.5)",
      }}
    >
      <BackButton flat to="/" sx={{ position: "relative", top: 0, left: 0 }} />
      <Box
        sx={{
          gap: "30px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginBottom: biggerThanMD ? "20px" : "10px",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
          variant="h3"
        >
          {languageState.texts.Title}
        </Typography>
        <SearchWrapper />
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            onClick={() => setSearchState({ type: "toggle-search-input" })}
          >
            <Search />
          </IconButton>
          <IconButton color="inherit" onClick={toggleMode}>
            {modeState.mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AppBar;
