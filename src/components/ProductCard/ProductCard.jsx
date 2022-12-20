import PropTypes from "prop-types";

// @mui/material
import {
  useMediaQuery,
  useTheme,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";

// @mui/icons-material
import AddIcon from "@mui/icons-material/Add";

// sito components
import SitoImage from "sito-image";

// styles
import { productDescriptionBox } from "../../assets/styles/styles";

// images
import noProduct from "../../assets/images/no-product.webp";

const ProductCard = (props) => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { onClick, item, addToOrder } = props;

  return (
    <Paper
      id={`obj-${item.id}`}
      elevation={1}
      sx={{
        position: "relative",
        marginTop: "20px",
        width: { md: "350px", sm: "630px", xs: "90%" },
        height: { md: "350px", xs: "auto" },
        borderRadius: "1rem",
        background: theme.palette.background.paper,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: { md: 0, xs: "1rem" },
          display: "flex",
          cursor: "pointer",
          flexDirection: { md: "column", xs: "row" },
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            width: { md: "100%", sm: "120px", xs: "100px" },
            height: { md: "160px", sm: "120px", xs: "100px" },
            minWidth: { md: "100%", sm: "120px", xs: "100px" },
            minHeight: { md: "160px", sm: "120px", xs: "100px" },
            marginRight: { md: 0, xs: "20px" },
          }}
        >
          <SitoImage
            src={
              item.photo && item.photo.url !== "" ? item.photo.url : noProduct
            }
            alt={item.name}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: biggerThanMD ? 0 : "100%",
            }}
          />
        </Box>
        <Box
          sx={{
            flexDirection: "column",
            justifyContent: "flex-start",
            overflow: "hidden",
            width: "100%",
            padding: { xs: 0, md: "1rem" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {item.name}
          </Typography>
          <Box sx={productDescriptionBox}>
            <Typography variant="body1">{item.description}</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", width: "80%" }}>
            {item.price} CUP
          </Typography>
        </Box>
      </Box>
      <Button
        onClick={(e) => {
          e.preventDefault();
          addToOrder(1, item);
        }}
        variant="contained"
        color="primary"
        sx={{
          minWidth: 0,
          borderRadius: "100%",
          padding: "5px",
          position: "absolute",
          right: "10px",
          bottom: "10px",
        }}
      >
        <AddIcon />
      </Button>
    </Paper>
  );
};

ProductCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  addToOrder: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    photo: PropTypes.shape({ url: PropTypes.string }),
  }).isRequired,
};

export default ProductCard;
