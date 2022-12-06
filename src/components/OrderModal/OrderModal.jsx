import { useState, useEffect } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

import PropTypes from "prop-types";

// @mui/material
import {
  useTheme,
  useMediaQuery,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// @mui/icons-material
import CloseIcon from "@mui/icons-material/Close";
import WhatsApp from "@mui/icons-material/WhatsApp";

// components
import Map from "../Map/Map/Map";

// sito components
import SitoImage from "sito-image";

// styles
import {
  modal,
  modalContent,
  productImage,
  productImageBox,
} from "../../assets/styles/styles";

// context
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { findFirstLowerLetter, findFirstUpperLetter } from "../../utils/auth";

// images
import noProduct from "../../assets/images/no-product.webp";

const OrderModal = (props) => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { languageState } = useLanguage();

  const { order, visible, onClose, cleanOrder } = props;

  const [show, setShow] = useState(visible);

  const ref = useOnclickOutside(() => {
    onClose();
    setShow(false);
  });

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  const [remote, setRemote] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneHelperText, setPhoneHelperText] = useState("");

  const handlePhone = (e) => {
    const { value } = e.target;
    if (value) {
      if (findFirstLowerLetter(value) > -1 || findFirstUpperLetter(value) > -1)
        setPhoneHelperText(languageState.texts.Errors.InvalidPhone);
      else setPhoneHelperText("");
    }
    setCustomerPhone(value);
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const [lng, setLng] = useState(-75.82956791534245);
  const [lat, setLat] = useState(20.022421136021567);

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "inherit";
  }, [show]);

  return (
    <Box
      sx={{
        ...modal,

        top: 0,
        minHeight: "100vh",
        height: "auto",
        zIndex: show ? 100 : -1,
        opacity: show ? 1 : -1,
      }}
    >
      <Box
        ref={ref}
        sx={{
          ...modalContent,
          overflow: "auto",
          width: "100%",
          height: "100%",
          alignItems: "center",
          opacity: show ? 1 : -1,
          background: theme.palette.background.paper,
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          color="error"
          onClick={onShowOff}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: "2rem",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {languageState.texts.Settings.Inputs.Contact.Count.Order.Title}
        </Typography>
        {order.map((item) => (
          <Box
            sx={{
              position: "relative",
              width: { sm: "630px", xs: "100%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "20px",
                gap: "20px",
              }}
            >
              <Box>
                <Box
                  sx={{ ...productImageBox, width: "100px", height: "100px" }}
                >
                  <SitoImage
                    src={
                      item.photo && item.photo.url !== ""
                        ? item.photo.url
                        : noProduct
                    }
                    alt={item.name}
                    sx={productImage}
                  />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.count} x {item.product}
                  </Typography>
                  {biggerThanMD ? (
                    <Typography>{item.cost} CUP</Typography>
                  ) : null}
                </Box>
                <Divider sx={{ width: "100%" }} />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {item.price} CUP
                  </Typography>
                  {!biggerThanMD ? (
                    <Typography>{item.cost} CUP</Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          sx={{
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "flex-start",
            width: { sm: "630px", xs: "100%" },
          }}
        >
          <TextField
            sx={{ width: "100%" }}
            type="text"
            label={
              languageState.texts.Settings.Inputs.Contact.Count.CustomerName
                .Label
            }
            placeholder={
              languageState.texts.Settings.Inputs.Contact.Count.CustomerName
                .Placeholder
            }
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            sx={{ width: "100%" }}
            color={phoneHelperText.length > 0 ? "error" : "primary"}
            helperText={phoneHelperText}
            type="tel"
            label={languageState.texts.Settings.Inputs.Contact.Phone.Label}
            placeholder={
              languageState.texts.Settings.Inputs.Contact.Phone.Placeholder
            }
            value={customerPhone}
            onChange={handlePhone}
          />
          <FormControlLabel
            sx={{ width: "100%" }}
            control={
              <Checkbox
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
              />
            }
            label={languageState.texts.Settings.Inputs.Contact.Count.Remote}
          />
          {remote ? (
            <Box sx={{ width: "100%" }}>
              <Map
                sx={{ width: "100%" }}
                noButton
                onMapClick={lngLatSelected}
                lat={lat}
                lng={lng}
                point={{ lat, lng }}
                onChange={onChangeMap}
                onChangeLat={(newValue) => setLat(newValue)}
                onChangeLng={(newValue) => setLng(newValue)}
              />
            </Box>
          ) : null}
          <Box
            display="flex"
            alignItems="center"
            sx={{ width: "100%", gap: "20px" }}
          >
            <Button variant="contained">
              {languageState.texts.Settings.Inputs.Contact.Count.Submit}
            </Button>
            <Button
              variant="outlined"
              onClick={cleanOrder}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {languageState.texts.Settings.Inputs.Contact.Count.Clean}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderModal;
