import { useState, useEffect, useCallback, useReducer } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";
import ToLogout from "../../components/ToLogout/ToLogout";
import RegisterNewUser from "../../components/RegisterNewUser/RegisterNewUser";

// @emotion
import { css } from "@emotion/css";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PublicIcon from "@mui/icons-material/Public";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";

// @mui components
import {
  useTheme,
  Box,
  Chip,
  Paper,
  Switch,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Autocomplete,
  OutlinedInput,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { userLogged, getUserName, isAdmin } from "../../utils/auth";
import { spaceToDashes } from "../../utils/functions";

// services
import { saveProfile } from "../../services/profile";
import { fetchMenu } from "../../services/menu.js";
import { removeImage } from "../../services/photo";

// images
import noProduct from "../../assets/images/no-product.webp";

import config from "../../config";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const icons = {
    any: <PublicIcon sx={{ marginRight: "5px" }} />,
    facebook: <FacebookIcon sx={{ marginRight: "5px" }} />,
    instagram: <InstagramIcon sx={{ marginRight: "5px" }} />,
    twitter: <TwitterIcon sx={{ marginRight: "5px" }} />,
    linkedIn: <LinkedInIcon sx={{ marginRight: "5px" }} />,
    pinterest: <PinterestIcon sx={{ marginRight: "5px" }} />,
    youtube: <YouTubeIcon sx={{ marginRight: "5px" }} />,
  };

  const preventDefault = (event) => event.preventDefault();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [oldName, setOldName] = useState("");
  const [menuNameError, setMenuNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const socialMediaReducer = (socialMediaState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray;
      }
      case "add": {
        const { newSocialMedia } = action;
        return [...socialMediaState, newSocialMedia];
      }
      case "remove": {
        const { index } = action;
        const newArray = [...socialMediaState];
        newArray.splice(index, 1);
        return newArray;
      }
      default:
        return [];
    }
  };

  const [socialMedia, setSocialMedia] = useReducer(socialMediaReducer, []);

  const [inputCurrentSocialMedia, setInputCurrentSocialMedia] = useState("");
  const handleInputCurrentSocialMedia = (e) =>
    setInputCurrentSocialMedia(e.target.value);

  const [currentSocialMedia, setCurrentSocialMedia] = useState("any");
  const handleSelectSocialMedia = (e) => setCurrentSocialMedia(e.target.value);

  const addSocialMedia = useCallback(() => {
    const newSocialMedia = {
      url: inputCurrentSocialMedia,
      icon: currentSocialMedia,
    };
    setInputCurrentSocialMedia("");
    setCurrentSocialMedia("any");
    setSocialMedia({ type: "add", newSocialMedia });
  }, [currentSocialMedia, inputCurrentSocialMedia]);

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [showLogoOnQr, setShowLogoOnQr] = useState(true);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");

  const [types, setTypes] = useState([]);
  const handleTypes = (event, newValue) => setTypes(newValue);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      menu: "",
      description: "",
    },
  });

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("menu-photo");
    if (file !== null) file.click();
  }, []);

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        if (data.photo) {
          setPhoto(data.photo);
          setPreview(data.photo.url);
        }
        if (data.business) setTypes(data.business);
        setOldName(data.menu);
        reset({ menu: data.menu, description: data.description });
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
    }
    setLoading(false);
  };

  const retry = () => fetch();

  const [ok, setOk] = useState(1);

  const validate = () => setOk(true);

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        case "phone":
          setPhoneError(true);
          return showNotification(
            "error",
            languageState.texts.Errors.PhoneRequired
          );
        default:
          setMenuNameError(true);
          return showNotification(
            "error",
            languageState.texts.Errors.NameRequired
          );
      }
    }
  };

  const onSubmit = async (data) => {
    setMenuNameError(false);
    setPhoneError(false);
    setLoading(true);
    const { menu, phone, description } = data;
    try {
      const response = await saveProfile(
        getUserName(),
        oldName,
        menu,
        phone || "",
        socialMedia || [],
        description || "",
        photo || "",
        types || []
      );
      if (response.status === 200) {
        showNotification(
          "success",
          languageState.texts.Messages.SaveSuccessful
        );
        setLoading(false);
        return true;
      } else {
        console.log(response);
        const { error } = response.data;
        if (error.indexOf("menu") > -1) {
          setMenuNameError(true);
          document.getElementById("menu").focus();
          showNotification("error", languageState.texts.Errors.MenuNameTaken);
        } else showNotification("error", languageState.texts.Errors.SomeWrong);
      }
    } catch (err) {
      console.log(err);
      showNotification("error", languageState.texts.Errors.SomeWrong);
    }
    setLoading(false);
    return false;
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
  }, [uploadPhoto, loading, loadingPhoto]);

  useEffect(() => {
    if (!userLogged()) navigate("/");
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQrDownload = () => {
    const canvas = document.getElementById("QRCode");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `your_name.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const onLoading = () => setLoadingPhoto(true);

  const onSuccess = async (res) => {
    const { url, fileId } = res;
    if (photo) await removeImage(photo.fileId);
    setPhoto({ fileId, url });
    setPreview(url);
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    showNotification("error", languageState.texts.Errors.SomeWrong);
    setLoadingPhoto(false);
  };

  const goToEdit = async () => {
    if (getValues("menu") && getValues("menu").length) {
      const value = await onSubmit({
        menu: getValues("menu"),
        description: getValues("description"),
      });
      if (value) navigate("/menu/edit/");
    } else {
      setMenuNameError(true);
      if (document.getElementById("menu"))
        document.getElementById("menu").focus();
      return showNotification("error", languageState.texts.Errors.NameRequired);
    }
  };

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        padding: "50px 0 70px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToLogout />
      {isAdmin() && <RegisterNewUser />}
      <BackButton to="/menu/edit" />
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
                zIndex: loading ? 99 : -1,
              }}
            />
            <Typography variant="h3">
              {languageState.texts.Settings.Title}
            </Typography>
            {/* Image */}
            <SitoContainer
              sx={{ width: "100%", marginTop: "10px", flexWrap: "wrap" }}
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{
                  width: { md: "160px", sm: "120px", xs: "80px" },
                  height: { md: "160px", sm: "120px", xs: "80px" },
                  borderRadius: "100%",
                }}
              >
                {!loading && (
                  <IKContext
                    publicKey={imagekitPublicKey}
                    urlEndpoint={imagekitUrl}
                    authenticationEndpoint={imagekitAuthUrl}
                    transformationPosition="path"
                  >
                    <IKUpload
                      id="menu-photo"
                      fileName={`${getUserName()}`}
                      onChange={onLoading}
                      onError={onError}
                      onSuccess={onSuccess}
                    />
                    {loadingPhoto ? (
                      <Loading
                        visible={loadingPhoto}
                        sx={{
                          position: "relative",
                          backdropFilter: "none",
                          borderRadius: "1rem",
                          boxShadow: "1px 1px 15px -4px",
                          background: theme.palette.background.default,
                        }}
                      />
                    ) : (
                      <SitoImage
                        id="no-image"
                        src={preview && preview !== "" ? preview : noProduct}
                        alt="user"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "1rem",
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </IKContext>
                )}
              </Box>
              <Typography sx={{ marginLeft: "20px", maxWidth: "200px" }}>
                {languageState.texts.Settings.ImageSuggestion}
              </Typography>
            </SitoContainer>
            {/* Menu name */}
            <SitoContainer sx={{ marginTop: "10px" }}>
              <Controller
                name="menu"
                control={control}
                render={({ field }) => (
                  <TextField
                    color={menuNameError ? "error" : "primary"}
                    sx={{ width: "100%", marginTop: "20px" }}
                    id="menu"
                    required
                    onInput={validate}
                    onInvalid={invalidate}
                    label={languageState.texts.Settings.Inputs.Menu.Label}
                    placeholder={
                      languageState.texts.Settings.Inputs.Menu.Placeholder
                    }
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </SitoContainer>
            {/* Phone */}
            <SitoContainer sx={{ marginTop: "10px" }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    color={phoneError ? "error" : "primary"}
                    sx={{ width: "100%", marginTop: "10px" }}
                    id="phone"
                    required
                    type="phone"
                    onInput={validate}
                    onInvalid={invalidate}
                    label={
                      languageState.texts.Settings.Inputs.Contact.Phone.Label
                    }
                    placeholder={
                      languageState.texts.Settings.Inputs.Contact.Phone
                        .Placeholder
                    }
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </SitoContainer>
            <Box
              sx={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControl sx={{ width: "180px" }}>
                <InputLabel>
                  {
                    languageState.texts.Settings.Inputs.Contact.SocialMedia
                      .Label
                  }
                </InputLabel>
                <Select
                  value={currentSocialMedia}
                  label={
                    languageState.texts.Settings.Inputs.Contact.SocialMedia
                      .Label
                  }
                  sx={{ div: { display: "flex" } }}
                  onChange={handleSelectSocialMedia}
                >
                  {Object.keys(icons).map((item) => (
                    <MenuItem
                      key={item}
                      value={item}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {icons[item]} -{" "}
                      {
                        languageState.texts.Settings.Inputs.Contact.SocialMedia
                          .Icons[item]
                      }
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  flex: 1,
                }}
                variant="outlined"
              >
                <OutlinedInput
                  id="search"
                  value={inputCurrentSocialMedia}
                  placeholder={
                    languageState.texts.Settings.Inputs.Contact.SocialMedia
                      .Placeholder
                  }
                  onChange={handleInputCurrentSocialMedia}
                  type="url"
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="primary"
                        aria-label="add social media"
                        onClick={addSocialMedia}
                        onMouseDown={preventDefault}
                        edge="end"
                        sx={{
                          borderRadius: "100%",
                          minWidth: 0,
                          minHeight: 0,
                          width: "30px",
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: socialMedia.length > 0 ? "10px" : 0,
                gap: "5px",
              }}
            >
              {socialMedia.map((item, i) => (
                <Chip
                  sx={{ svg: { borderRadius: "100%" } }}
                  key={item.url}
                  avatar={icons[item.icon]}
                  label={item.url}
                  color="primary"
                  onDelete={() => setSocialMedia({ type: "remove", index: i })}
                />
              ))}
            </Box>
            {/* Business */}
            <SitoContainer sx={{ width: "100%" }}>
              <Autocomplete
                sx={{ marginTop: "20px", width: "100%" }}
                multiple
                id="places"
                onChange={handleTypes}
                options={languageState.texts.Settings.Inputs.CenterTypes.Types}
                getOptionLabel={(option) => option.name}
                defaultValue={[]}
                filterSelectedOptions
                value={types || []}
                ChipProps={{ color: "primary" }}
                renderInput={(params) => (
                  <TextField
                    color="primary"
                    {...params}
                    label={
                      languageState.texts.Settings.Inputs.CenterTypes.Label
                    }
                    placeholder={
                      types.length === 0
                        ? languageState.texts.Settings.Inputs.CenterTypes
                            .Placeholder
                        : ""
                    }
                  />
                )}
              />
            </SitoContainer>
            {/* Description */}
            <SitoContainer sx={{ marginTop: "10px" }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "100%", marginTop: "20px" }}
                    id="description"
                    label={
                      languageState.texts.Settings.Inputs.Description.Label
                    }
                    placeholder={
                      languageState.texts.Settings.Inputs.Description
                        .Placeholder
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
            </SitoContainer>
            <SitoContainer
              justifyContent="flex-end"
              sx={{ width: "100%", marginTop: "20px" }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ marginRight: "10px" }}
              >
                {languageState.texts.Insert.Buttons.Save}
              </Button>
              <Button type="button" variant="outlined" onClick={goToEdit}>
                {languageState.texts.Insert.Buttons.Edit}
              </Button>
            </SitoContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography variant="h4">
                {languageState.texts.Settings.Qr}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={showLogoOnQr}
                    onChange={(e) => setShowLogoOnQr(e.target.checked)}
                  />
                }
                label={languageState.texts.Settings.ShowLogoOnQr}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px",
              }}
            >
              <QRCode
                value={`${config.url}menu/${spaceToDashes(getValues("menu"))}`} // here you should keep the link/value(string) for which you are generation promocode
                size={256} // the dimension of the QR code (number)
                logoImage={showLogoOnQr ? preview : ""} // URL of the logo you want to use, make sure it is a dynamic url
                logoHeight={60}
                logoWidth={60}
                logoOpacity={1}
                enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                id="QRCode"
              />
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
          <Error onRetry={retry} />
        )}
      </Paper>
    </Box>
  );
};

export default Settings;