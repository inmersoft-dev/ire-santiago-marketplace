import { useLocation } from "react-router-dom";
import { useReducer, useState, useEffect, useCallback } from "react";

// sito utils
import { useNotification } from "sito-mui-notification";

// @mui/material
import {
  Box,
  Chip,
  useMediaQuery,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

// @mui/icons-material
import {
  Close,
  FilterAlt,
  AccessTime,
  FilterAltOff,
} from "@mui/icons-material";

// contexts
import { useSearch } from "../../context/SearchProvider";
import { useHistory } from "../../context/HistoryProvider";
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { dashesToSpace } from "../../utils/functions";

// services
import { search } from "../../services/search";

const SearchWrapper = () => {
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const location = useLocation();

  const { languageState } = useLanguage();
  const { searchState, setSearchState } = useSearch();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [showSearch, setShowSearch] = useState(false);
  const toggleSearchInput = () => setShowSearch(!showSearch);

  useEffect(() => {
    if (!showSearch) setShowFilters(false);
  }, [showSearch]);

  const searchResultReducer = (searchResultState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray;
      }
      default:
        return [];
    }
  };

  const [searchResult, setSearchResult] = useReducer(searchResultReducer, []);

  const [searchingProducts, setSearchingProducts] = useState(true);
  const toggleSearchingProducts = () =>
    setSearchingProducts(!searchingProducts);

  const [searchingCategories, setSearchingCategories] = useState(true);
  const toggleSearchingCategories = () =>
    setSearchingCategories(!searchingCategories);
  const [searchingMenus, setSearchingMenus] = useState(true);
  const toggleSearchingMenus = () => setSearchingMenus(!searchingMenus);

  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { historyState, setHistoryState } = useHistory();

  const toggleFilters = () => setShowFilters(!showFilters);

  useEffect(() => {
    try {
      const exist = localStorage.getItem("search-history");
      if (exist !== null && exist !== "") {
        setHistoryState({
          type: "set",
          newArray: JSON.parse(exist).filter(
            (item) => item !== null && item.trim().length > 0
          ),
        });
        setShowHistory(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const topBarHeight = useCallback(() => {
    let returnHeight = 60;
    if (biggerThanMD) {
      if (showHistory && showSearch) returnHeight += 50;
      if (showFilters) returnHeight += 55;
    } else {
      if (showFilters) returnHeight += 55;
      if (showSearch) {
        returnHeight += 55;
        if (showHistory) {
          if (historyState.length) returnHeight += 50;
          else returnHeight += 40;
        }
      }
    }
    return `${returnHeight}px`;
  }, [biggerThanMD, showSearch, showFilters, showHistory, historyState]);

  const [toSearch, setToSearch] = useState("");

  const clearInput = () => setToSearch("");

  const filter = useCallback(
    async (currentPage) => {
      setLoading(true);
      setError(false);
      try {
        const response = await search(
          toSearch,
          {
            searchingProducts,
            searchingCategories,
            searchingMenus,
          },
          "",
          currentPage,
          currentPage * 10
        );
        const { list, totalPages } = await response;
        setHasMore(currentPage < totalPages);
        setSearchResult({ type: "set", newArray: list });
        setLoading(false);
      } catch (err) {
        console.error(err);
        showNotification("error", String(err));
        setError(true);
        setLoading(false);
      }
    },
    [toSearch, historyState]
  );

  useEffect(() => {
    if (toSearch.length) {
      filter(0);
      setPage(0);
    }
  }, [toSearch, searchingProducts, searchingCategories, searchingMenus]);

  useEffect(() => {
    if (toSearch.length) filter(page);
    else fetch(page);
  }, [page]);

  const handleToSearch = (e) => setToSearch(e.target.value);

  const preventDefault = (event) => event.preventDefault();

  useEffect(() => {
    try {
      if (location.search) {
        const queryParams = location.search.substring(1);
        const params = queryParams.split("&");
        params.forEach((item) => {
          const [paramName, paramValue] = item.split("=");
          if (paramValue)
            switch (paramName) {
              case "business":
                setSearchingProducts(false);
                setSearchingCategories(false);
                setSearchingMenus(true);
                setToSearch(dashesToSpace(paramValue));
                setShowSearch(true);
                break;
              case "product": {
                setSearchingProducts(true);
                setSearchingCategories(false);
                setSearchingMenus(false);
                setToSearch(dashesToSpace(paramValue));
                setShowSearch(true);
                break;
              }
              case "category": {
                setSearchingProducts(false);
                setSearchingCategories(true);
                setSearchingMenus(false);
                setToSearch(dashesToSpace(paramValue));
                setShowSearch(true);
                break;
              }
              default:
                break;
            }
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [location]);

  return (
    <div>
      {biggerThanMD ? (
        <FormControl
          sx={{
            overflow: "hidden",
            position: "absolute",
            right: "40px",
            div: { borderRadius: "25px" },
            width: searchState.showSearch ? "50%" : "40px",
            transition: "all 1000ms ease",
            marginLeft: searchState.showSearch ? 0 : "50%",
            fieldset: {
              transition: "all 1000ms ease",
              borderWidth: searchState.showSearch ? "1px" : 0,
            },
            input: { padding: "7.5px 14px", fontSize: "15px" },
          }}
          variant="outlined"
        >
          <OutlinedInput
            id="search"
            size="small"
            value={searchState.toSearch}
            onClick={() => setSearchState({ type: "set-history", value: true })}
            placeholder={languageState.texts.Navbar.Search}
            onChange={handleToSearch}
            type="search"
            startAdornment={
              <InputAdornment position="start">
                {showSearch ? (
                  <IconButton
                    sx={{ marginLeft: "-12px" }}
                    color="secondary"
                    aria-label="filter"
                    onClick={toggleFilters}
                    onMouseDown={preventDefault}
                    edge="start"
                    size="small"
                  >
                    {!showFilters ? <FilterAlt /> : <FilterAltOff />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                sx={{ button: { marginRight: "20px" } }}
              >
                {toSearch.length > 0 ? (
                  <IconButton
                    sx={{ marginRight: "20px" }}
                    color="secondary"
                    aria-label="clear"
                    onClick={clearInput}
                    onMouseDown={preventDefault}
                    edge="end"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
          />
        </FormControl>
      ) : null}
      {!biggerThanMD ? (
        <FormControl
          sx={{
            width: "100%",
            div: { borderRadius: "25px" },
            input: { padding: "7.5px 14px", fontSize: "15px" },
          }}
          variant="outlined"
          component="form"
        >
          <OutlinedInput
            id="search"
            size="small"
            value={toSearch}
            placeholder={languageState.texts.Navbar.Search}
            onChange={handleToSearch}
            onClick={() => setShowHistory(true)}
            type="search"
            startAdornment={
              <InputAdornment position="start">
                {showSearch ? (
                  <IconButton
                    color="secondary"
                    aria-label="filter"
                    onClick={toggleFilters}
                    sx={{ marginLeft: "-12px" }}
                    onMouseDown={preventDefault}
                    edge="start"
                    size="small"
                  >
                    {!showFilters ? <FilterAlt /> : <FilterAltOff />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                {toSearch.length > 0 ? (
                  <IconButton
                    color="secondary"
                    aria-label="clear"
                    onClick={clearInput}
                    onMouseDown={preventDefault}
                    edge="end"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
          />
        </FormControl>
      ) : null}
      {historyState.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
            marginLeft: 0,
            gap: "10px",
            width: "100vw",
            overflow: "auto",
          }}
        >
          {historyState.map((item, i) => (
            <Chip
              key={i}
              label={item}
              onClick={() => setToSearch(item)}
              icon={<AccessTime fontSize="small" />}
            />
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            color: "gray",
            marginTop: biggerThanMD ? 0 : "20px",
            marginLeft: biggerThanMD ? 0 : "5px",
          }}
        >
          {languageState.texts.Navbar.NoHistory}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          marginTop: "20px",
          marginLeft: 0,
          gap: "10px",
        }}
      >
        <Chip
          onClick={toggleSearchingProducts}
          color={searchingProducts ? "primary" : undefined}
          label={languageState.texts.Navbar.Filters.Products}
        />
        <Chip
          onClick={toggleSearchingCategories}
          color={searchingCategories ? "primary" : undefined}
          label={languageState.texts.Navbar.Filters.Categories}
        />
        <Chip
          onClick={toggleSearchingMenus}
          color={searchingMenus ? "primary" : undefined}
          label={languageState.texts.Navbar.Filters.Menus}
        />
      </Box>
    </div>
  );
};

export default SearchWrapper;
