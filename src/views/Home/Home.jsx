/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";

// framer-motion
import { useInView } from "framer-motion";

// @mui components
import { useMediaQuery, Box, Typography } from "@mui/material";

// sito components
import { useNotification } from "sito-mui-notification";

// own components
import Error from "../../components/Error/Error";
import Empty from "../../components/Empty/Empty";
import Loading from "../../components/Loading/Loading";
import LinkCard from "../../components/LinkCard/LinkCard";
import CookieBox from "../../components/CookieBox/CookieBox";
import FabButtons from "../../components/FabButtons/FabButtons";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchAll } from "../../services/menu.js";

// contexts
import { useSearch } from "../../context/SearchProvider";
import { useHistory } from "../../context/HistoryProvider";
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { parserAccents } from "../../utils/parser";
import { spaceToDashes } from "../../utils/functions";
import { getUserName, userLogged } from "../../utils/auth";

// styles
import { mainWindow, responsiveGrid } from "../../assets/styles/styles";

const Home = () => {
  const { historyState, setHistoryState } = useHistory();
  const { searchState } = useSearch();

  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const ref = useRef(null);
  const isInView = useInView(ref);

  const { languageState } = useLanguage();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const [allData, setAllData] = useState([]);

  const listReducer = (listState, action) => {
    const { type } = action;
    switch (type) {
      case "add": {
        const { newUsers } = action;
        return [
          ...listState,
          ...newUsers.filter(
            (item) => !listState.find((jtem) => item.user === jtem.user)
          ),
        ];
      }
      default:
        return [];
    }
  };
  const [list, setList] = useReducer(listReducer, []);

  const [page, setPage] = useState(1);

  const fetch = async (currentPage) => {
    setError(false);
    try {
      const response = await fetchAll("visits", currentPage, 3, [
        "user",
        "menu",
        "photo",
        "state",
        "description",
      ]);
      const data = await response.data;
      if (data && data.users) {
        const { users, totalPages } = data;
        setHasMore(currentPage < totalPages);
        const arrayData = Object.values(users);
        setList({
          type: "add",
          newUsers: arrayData.filter((item) => item.photo),
        });
        setAllData([...allData, Object.keys(users)]);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (isInView) setPage(page + 1);
  }, [isInView]);

  const getLinkCard = useCallback(
    (item, type) => {
      if (type === "menu") {
        if (userLogged() && item.user === getUserName())
          return `/menu/edit?search=${searchState.toSearch}`;
        return `/menu/${spaceToDashes(item.name)}?search=${
          searchState.toSearch
        }`;
      } else {
        if (userLogged() && item.user === getUserName())
          return `/menu/edit?search=${searchState.toSearch}`;
        if (item.menu !== item.name)
          return `/menu/${spaceToDashes(item.menu)}?product=${spaceToDashes(
            parserAccents(item.name)
          )}&search=${searchState.toSearch}`;
        else
          return `/menu/${spaceToDashes(item.menu)}?search=${
            searchState.toSearch
          }`;
      }
    },
    [searchState]
  );

  const marginTopBar = useCallback(() => {
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
  }, [biggerThanMD, searchState]);

  const searchResultIsEmpty = useCallback(() => {
    if (
      searchState.searchResult &&
      (searchState.searchResult[0] || searchState.searchResult[1])
    )
      if (
        searchState.searchResult[0].list.length ||
        searchState.searchResult[1].list.length
      )
        return false;
    return true;
  }, [searchState]);

  return (
    <Box sx={mainWindow} flexDirection="column">
      <CookieBox />
      <FabButtons />
      <Box sx={{ minHeight: "100vh" }}>
        <Box></Box>
        {error && searchState.loading === -1 && (
          <Error onRetry={() => fetch()} />
        )}
        {list.length === 0 && !searchState.loading && !hasMore && (
          <Empty text={languageState.texts.Errors.NoMenu} />
        )}

        <Box
          position="relative"
          sx={{
            height: "100%",
            marginTop: marginTopBar(),
            transition: "margin 200ms ease",
          }}
        >
          <Loading
            visible={searchState.loading}
            sx={{
              height: "100px",
              background: "none",
              position: "absolute",
              zIndex: searchState.loading ? 10 : -1,
            }}
          />
          {!error && list.length > 0 && !searchState.loading && (
            <Box
              sx={{
                ...responsiveGrid,
                gap: "20px",
                justifyContent: "flex-start",
                padding: { xs: "10px 20px", md: "10px 40px", lg: "10px 10rem" },
              }}
            >
              {searchState.toSearch.length === 0
                ? list.map((item, i) => (
                    <InViewComponent
                      key={i}
                      delay={`0.${1 * (item.index + 1)}s`}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flex: { md: "1 1 0", xs: "inherit" },
                        width: { md: "350px", xs: "100%" },
                      }}
                    >
                      <LinkCard
                        onClick={() =>
                          searchState.toSearch.length > 0
                            ? setHistoryState({
                                type: "add",
                                newHistory: searchState.toSearch,
                              })
                            : {}
                        }
                        item={item}
                        link={
                          userLogged() && item.user === getUserName()
                            ? "/menu/edit"
                            : `/menu/${spaceToDashes(item.menu)}`
                        }
                      />
                    </InViewComponent>
                  ))
                : searchState.searchResult
                    .filter((item) => item.list.length)
                    .map((item, i) => (
                      <Box key={i}>
                        <Typography
                          sx={{ marginTop: "20px", fontSize: "1.5rem" }}
                          variant="h3"
                        >
                          {languageState.texts.Navbar.Models[item.type]}
                        </Typography>
                        {item.list.map((jtem, j) => (
                          <InViewComponent
                            key={j}
                            delay={`0.${1 * (jtem.index + 1)}s`}
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <LinkCard
                              item={jtem}
                              link={getLinkCard(jtem, item.type)}
                              onClick={() =>
                                searchState.toSearch.length > 0
                                  ? setHistoryState({
                                      type: "add",
                                      newHistory: searchState.toSearch,
                                    })
                                  : {}
                              }
                            />
                          </InViewComponent>
                        ))}
                      </Box>
                    ))}
              {searchState.toSearch.length > 0 &&
                searchResultIsEmpty() &&
                !searchState.loading && (
                  <Empty text={languageState.texts.Errors.NoResults} />
                )}
            </Box>
          )}
          <div ref={ref}>
            <Loading
              visible={hasMore}
              sx={{
                height: "100px",
                background: "none",
                position: "inherit",
              }}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
