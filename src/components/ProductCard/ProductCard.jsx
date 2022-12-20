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
import {
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productPaper,
} from "../../assets/styles/styles";

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
        ...productPaper,
        background: theme.palette.background.paper,
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
        <Box sx={productImageBox}>
          <SitoImage
            src={
              item.photo && item.photo.url !== "" ? item.photo.url : noProduct
            }
            alt={item.name}
            sx={{
              ...productImage,
              borderRadius: biggerThanMD ? "1rem 1rem 0 0" : "100%",
            }}
          />
        </Box>
        <Box sx={productContentBox}>
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
