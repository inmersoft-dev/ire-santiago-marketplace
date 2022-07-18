import { BrowserRouter, Routes, Route } from "react-router-dom";

// sito components
import SitoContainer from "sito-container";

// @mui
import { ThemeProvider, CssBaseline } from "@mui/material";

// theme
import dark from "./assets/theme/dark";

// views
import Login from "./views/Auth/Login";
import Register from "./views/Auth/Register";

const App = () => {
  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <ThemeProvider theme={dark}>
        <CssBaseline />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SitoContainer>
  );
};

export default App;
