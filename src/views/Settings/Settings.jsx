import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

// imagekitio
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";
import NotConnected from "../../components/NotConnected/NotConnected";
import ToLogout from "../../components/ToLogout/ToLogout";

// @emotion
import { css } from "@emotion/css";

// @mui icons
import DownloadIcon from "@mui/icons-material/Download";

// @mui components
import {
  useTheme,
  Paper,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { userLogged, getUserName } from "../../utils/auth";

// services
import { saveProfile } from "../../services/profile";
import { fetchMenu } from "../../services/menu.js";

import config from "../../config";

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      menu: "",
      description: "",
    },
  });

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("menu-photo");
    if (file !== null) file.click();
  }, []);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
  };

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        setPhoto(data.ph);
        reset({ menu: data.m, description: data.d });
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
    }
    setLoading(false);
  };

  const retry = () => {
    fetch();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { menu, description } = data;
    try {
      const response = await saveProfile(
        getUserName(),
        menu,
        description,
        photo
      );
      console.log(response);
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.SomeWrong,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const image = document.getElementById("no-image");
    if (image !== null) {
      image.onclick = uploadPhoto;
    }
    return () => {
      if (image !== null) {
        image.onclick = undefined;
      }
    };
  }, [uploadPhoto]);

  useEffect(() => {
    if (!userLogged()) navigate("/");
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    retry();
  }, []);

  const onQrDownload = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        padding: "70px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToLogout />
      <BackButton />
      <Paper
        sx={{
          display: "flex",
          width: { md: "800px", sm: "630px", xs: "100%" },
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        {!error ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={css({ width: "100%" })}
          >
            <Loading
              visible={loading}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                backdropFilter: "blur(4px)",
                background: `${theme.palette.background.paper}ec`,
                borderRadius: "1rem",
                zIndex: loading ? 99 : -1,
              }}
            />
            <Typography variant="h3">
              {languageState.texts.Settings.Title}
            </Typography>
            <SitoContainer sx={{ width: "100%" }} justifyContent="center">
              <IKContext
                publicKey={config.imagekitPublicKey}
                urlEndpoint={config.imagekitUrl}
                transformationPosition="path"
                authenticationEndpoint={config.imagekitAuthUrl}
              >
                <IKUpload
                  id="menu-photo"
                  fileName="menu-photo"
                  onError={onError}
                  onSuccess={onSuccess}
                />
              </IKContext>
              <Box
                sx={{
                  width: { md: "160px", sm: "120px", xs: "80px" },
                  height: { md: "160px", sm: "120px", xs: "80px" },
                }}
              >
                <SitoImage
                  id="no-image"
                  src={photo}
                  alt="no-image"
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: "100%",
                  }}
                />
              </Box>
            </SitoContainer>
            <Controller
              name="menu"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "100%", marginTop: "20px" }}
                  id="menu"
                  label={languageState.texts.Settings.Inputs.Menu.Label}
                  placeholder={
                    languageState.texts.Settings.Inputs.Menu.Placeholder
                  }
                  variant="outlined"
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "100%", marginTop: "20px" }}
                  id="description"
                  label={languageState.texts.Settings.Inputs.Description.Label}
                  placeholder={
                    languageState.texts.Settings.Inputs.Description.Placeholder
                  }
                  multiline
                  maxLength="255"
                  maxRows={3}
                  minRows={3}
                  variant="outlined"
                  {...field}
                />
              )}
            />
            <SitoContainer
              justifyContent="flex-end"
              sx={{ width: "100%", marginTop: "20px" }}
            >
              <Button type="submit" variant="contained">
                {languageState.texts.Insert.Buttons.Save}
              </Button>
            </SitoContainer>
            <Typography variant="h4" sx={{ marginTop: "20px" }}>
              {languageState.texts.Settings.Qr}
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px",
              }}
            >
              <QRCode value={"hola"} id="QRCode" />
              <Button
                onClick={onQrDownload}
                variant="contained"
                sx={{
                  minWidth: 0,
                  marginTop: "20px",
                  padding: "10px",
                  borderRadius: "100%",
                }}
              >
                <DownloadIcon />
              </Button>
            </Box>
          </form>
        ) : (
          <NotConnected onRetry={retry} />
        )}
      </Paper>
    </Box>
  );
};

export default Settings;
