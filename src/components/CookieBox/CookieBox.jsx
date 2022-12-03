// @emotion/css
import { css } from "@emotion/css";

// @mui/material
import { Paper, Box, Typography, Button, Link } from "@mui/material";

// @mui/icons-material
import CookieIcon from "@mui/icons-material/Cookie";

// framer-motion
import { motion } from "framer-motion";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const CookieBox = () => {
  const { languageState } = useLanguage();

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <Paper
      elevation={2}
      sx={{
        bottom: "10px",
        padding: "20px",
        position: "fixed",
        width: { xs: "80%", md: "auto" },
      }}
    >
      <motion.div
        initial="hidden"
        variants={container}
        whileInView="visible"
        viewport={{ once: true }}
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        })}
      >
        <Box sx={{ display: "flex" }}>
          <CookieIcon sx={{ marginRight: "10px", width: "48px" }} />
          <Typography
            sx={{
              marginRight: "10px",
            }}
          >
            {languageState.texts.CookieBox.Description}.{" "}
            <Link href="/cookie-policy" target="_blank" rel="noopener">
              {languageState.texts.CookieBox.Link}
            </Link>
            .
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "10px", width: "170px" }}>
          <Button variant="contained">
            {languageState.texts.CookieBox.Accept}
          </Button>
          <Button variant="outlined">
            {languageState.texts.CookieBox.Decline}
          </Button>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default CookieBox;
