import { Link } from "react-router-dom";

// @mui/material
import { Paper, Typography, Button } from "@mui/material";

// @mui/icons-material
import CookieIcon from "@mui/icons-material/Cookie";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const CookieBox = () => {
  const { languageState } = useLanguage();

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        bottom: "10px",
      }}
    >
      <CookieIcon />
      <Typography>{languageState.texts.CookieBox.Description}</Typography>
      <Button>{languageState.texts.CookieBox.Accept}</Button>
      <Button>{languageState.texts.CookieBox.Decline}</Button>
    </Paper>
  );
};

export default CookieBox;
