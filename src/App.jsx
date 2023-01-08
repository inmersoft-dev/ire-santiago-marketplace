/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// sito components
import SitoContainer from "sito-container";
import ErrorBoundary from "sito-mui-error-component";
import NotificationContext from "sito-mui-notification";

// @mui

import { useMediaQuery, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// themes
import dark from "./assets/theme/dark";
import light from "./assets/theme/light";

// utils
import { userLogged, logoutUser } from "./utils/auth";

// components
import BigLoading from "./components/Loading/BigLoading";
import MUIPrinter from "./components/MUIPrinter/MUIPrinter";

// contexts
import { useMode } from "./context/ModeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { SettingsProvider } from "./context/SettingsProvider";

// services
import { validateBasicKey } from "./services/auth";
import { sendMobileCookie, sendPcCookie } from "./services/analytics";

import config from "./config";

// views
const Home = lazy(() => import("./views/Home/Home"));
const Login = lazy(() => import("./views/Auth/Login"));
const Logout = lazy(() => import("./views/Auth/Logout"));
const Register = lazy(() => import("./views/Auth/Register"));
const Watch = lazy(() => import("./views/Menu/Watch"));
const Edit = lazy(() => import("./views/Menu/Edit"));
const Settings = lazy(() => import("./views/Settings/Settings"));
const NotFound = lazy(() => import("./views/NotFound/NotFound"));

const App = () => {
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { modeState } = useMode();
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.transition = "all 200ms ease";
  }, []);

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetch = async () => {
    try {
      const value = await validateBasicKey();
      if (!value) {
        logoutUser();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else sessionStorage.setItem("user", value);
    } catch (err) {
      logoutUser();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    if (userLogged()) fetch();
  }, []);

  useEffect(() => {
    if (biggerThanMD) sendPcCookie();
    else sendMobileCookie();
  }, []);

  return (
    <Suspense
      fallback={
        <>
          <BigLoading visible />
        </>
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SitoContainer
          sx={{ minHeight: "100vh" }}
          alignItems="center"
          justifyContent="center"
        >
          <ThemeProvider theme={modeState.mode === "light" ? light : dark}>
            <CssBaseline />
            <NotificationContext>
              <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Suspense
                  fallback={
                    <>
                      <BigLoading visible />
                    </>
                  }
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ErrorBoundary>
                          <Home />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/auth/"
                      element={
                        <ErrorBoundary>
                          <Login />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/auth/register-user"
                      element={
                        <ErrorBoundary>
                          <Register />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/auth/logout"
                      element={
                        <ErrorBoundary>
                          <Logout />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/settings/"
                      element={
                        <SettingsProvider>
                          <Settings />
                        </SettingsProvider>
                      }
                    />
                    <Route
                      exact
                      path="/menu/*"
                      element={
                        <ErrorBoundary>
                          <Watch />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/menu/edit"
                      element={
                        <ErrorBoundary>
                          <Edit />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/cookie-policy"
                      element={
                        <ErrorBoundary>
                          <MUIPrinter text={languageState.texts.CookiePolicy} />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      exact
                      path="/terms-conditions"
                      element={
                        <ErrorBoundary>
                          <MUIPrinter text={languageState.texts.Terms} />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <ErrorBoundary>
                          <NotFound />
                        </ErrorBoundary>
                      }
                    />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </NotificationContext>
          </ThemeProvider>
        </SitoContainer>
      </LocalizationProvider>
    </Suspense>
  );
};

export default App;
