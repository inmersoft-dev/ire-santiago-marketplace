import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui components
import { IconButton, Button } from "@mui/material";

// @mui icons
import ChevronLeft from "@mui/icons-material/ChevronLeft";

// sito components
import SitoContainer from "sito-container";

const BackButton = (props) => {
  const { to, flat } = props;
  return (
    <SitoContainer
      sx={{
        position: "fixed",
        top: "5px",
        left: "1px",
        zIndex: 20,
      }}
    >
      <Link to={to}>
        {!flat ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: 0, borderRadius: "100%", padding: "5px" }}
          >
            <ChevronLeft />
          </Button>
        ) : (
          <IconButton color="secondary">
            <ChevronLeft />
          </IconButton>
        )}
      </Link>
    </SitoContainer>
  );
};

BackButton.defaultProps = {
  to: "/",
  flat: false,
};

BackButton.propTypes = {
  to: PropTypes.string,
  flat: PropTypes.bool,
};

export default BackButton;
