import PropTypes from "prop-types";

// @mui/material
import { Box, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// @mui/icons-material
import { Cancel, NewReleases } from "@mui/icons-material";

// styles
import "./styles.css";

const Badge = (props) => {
  const theme = useTheme();
  const { type, text } = props;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        background: theme.palette.secondary.main,
        borderRadius: "100%",
        height: "18px",
        width: "16px",
      }}
    >
      {type === "info" ? (
        <Tooltip title={text}>
          <NewReleases
            sx={{ marginLeft: "-4px", marginTop: "-3px" }}
            color={type}
          />
        </Tooltip>
      ) : null}
      {type === "warning" ? (
        <Tooltip title={text}>
          <NewReleases
            sx={{ marginLeft: "-4px", marginTop: "-3px" }}
            color={type}
          />
        </Tooltip>
      ) : null}
      {type === "error" ? (
        <Tooltip title={text}>
          <Cancel color={type} />
        </Tooltip>
      ) : null}
    </Box>
  );
};

Badge.defaultProps = {
  type: "warning",
  text: "text",
};

Badge.propTypes = {
  type: PropTypes.oneOf(["info", "error", "warning"]),
  text: PropTypes.string,
};

export default Badge;
