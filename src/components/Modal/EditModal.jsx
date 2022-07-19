import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

// imagekitio
import { IKContext, IKImage, IKUpload } from "imagekitio-react";

import PropTypes from "prop-types";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// @mui components
import { useTheme, Box, TextField, IconButton } from "@mui/material";

// image
import noProduct from "../../assets/images/no-product.webp";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

import config from "../../config";

const Modal = (props) => {
  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { visible, onClose, item } = props;

  const [show, setShow] = useState(visible);

  const [ok, setOk] = useState(1);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      price: "",
      name: "",
      description: "",
      type: "",
    },
  });

  const onSubmit = (data) => {};

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  const validate = () => {
    setOk(true);
  };

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      let message = "";
      switch (id) {
        case "type":
          message = languageState.texts.Errors.PriceRequired;
          break;
        case "description":
          message = languageState.texts.Errors.PriceRequired;
          break;
        case "price":
          message = languageState.texts.Errors.PriceRequired;
          break;
        default:
          message = languageState.texts.Errors.NameRequired;
          break;
      }
      return setNotificationState({
        type: "set",
        ntype: "error",
        message,
      });
    }
  };

  const uploadPhoto = useCallback((e) => {
    console.log("hola");
  }, []);

  useEffect(() => {
    const image = document.getElementById("no-product");
    if (image !== null) {
      image.onclick = uploadPhoto;
    }
    return () => {
      image.onclick = undefined;
    };
  }, [uploadPhoto]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: show ? 99 : -1,
        opacity: show ? 1 : -1,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "#4e464652",
        backdropFilter: "blur(4px)",
        transition: "all 500ms ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { md: "800px", sm: "630px", xs: "100%" },
          height: "90%",
          padding: "1rem",
          borderRadius: "1rem",
          background: theme.palette.background.paper,
          position: "relative",
          transition: "all 500ms ease",
          opacity: show ? 1 : -1,
        }}
      >
        <SitoContainer
          sx={{ width: "96%", position: "absolute", marginTop: "-10px" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton color="error" onClick={onShowOff}>
            <CloseIcon />
          </IconButton>
        </SitoContainer>
        <SitoContainer
          sx={{ width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              width: { md: "160px", sm: "160px", xs: "160px" },
              height: { md: "160px", sm: "160px", xs: "160px" },
            }}
          >
            <IKContext
              publicKey={config.imagekitPublicKey}
              urlEndpoint={config.imagekitUrl}
              transformationPosition="path"
              authenticationEndpoint={config.imagetkietAuthUrl}
            >
              <IKImage
                path="/default-image.jpg"
                transformation={[
                  {
                    height: "300",
                    width: "400",
                  },
                ]}
              />
              <IKUpload fileName="product-photo" />
            </IKContext>
            {item.ph === "" ? (
              <SitoImage
                id="no-product"
                src={noProduct}
                alt="no-product"
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  height: "100%",
                  borderRadius: "100%",
                }}
              />
            ) : (
              <SitoImage
                src={item.ph}
                alt={item.n}
                sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
              />
            )}
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="price"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Price.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Price.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="name"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Product.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Product.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="description"
                  required
                  multiline
                  maxRows={3}
                  minRows={3}
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Description.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Description.Placeholder
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  id="type"
                  required
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Insert.Inputs.Type.Label}
                  placeholder={
                    languageState.texts.Insert.Inputs.Type.Placeholder
                  }
                  {...field}
                />
              )}
            />
          </form>
        </SitoContainer>
      </Box>
    </Box>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default Modal;
