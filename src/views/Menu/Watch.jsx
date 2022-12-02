/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useReducer, useCallback } from "react";
import { useLocation } from "react-router-dom";

import inViewport from "in-viewport";

// @mui components
import {
  Box,
  Tooltip,
  IconButton,
  Typography,
  Link as MUILink,
} from "@mui/material";

// @mui/icons-material
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
// url
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PublicIcon from "@mui/icons-material/Public";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
// places
import BalconyIcon from "@mui/icons-material/Balcony"; // old house
import RestaurantIcon from "@mui/icons-material/Restaurant"; // restaurant
import BedroomParentIcon from "@mui/icons-material/BedroomParent"; // rent house
import LocalBarIcon from "@mui/icons-material/LocalBar"; // bar
import DiningIcon from "@mui/icons-material/Dining"; // cafeteria
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"; // gym
import ColorLensIcon from "@mui/icons-material/ColorLens"; // art
import MuseumIcon from "@mui/icons-material/Museum"; // museum
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary"; // library
import NightlifeIcon from "@mui/icons-material/Nightlife"; // night life
import LocalMallIcon from "@mui/icons-material/LocalMall"; // mall
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore"; // shop
import UmbrellaIcon from "@mui/icons-material/Umbrella"; // beauty
import BoltIcon from "@mui/icons-material/Bolt"; // electronic
import CheckroomIcon from "@mui/icons-material/Checkroom"; // cloth
import HotelIcon from "@mui/icons-material/Hotel"; // hotel
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // fuel
import CarRentalIcon from "@mui/icons-material/CarRental"; // car rental

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import Empty from "../../components/Empty/Empty";
import ToLogin from "../../components/ToLogin/ToLogin";
import NotFound from "../../views/NotFound/NotFound";
import TabView from "../../components/TabView/TabView";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchMenu } from "../../services/menu.js";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// components
import ProductCard from "../../components/ProductCard/ProductCard";

// images
import noProduct from "../../assets/images/no-product.webp";

// functions
import { dashesToSpace } from "../../utils/functions";

// utils
import { parserAccents } from "../../utils/parser";
import { scrollTo, spaceToDashes } from "../../utils/functions";

// styles
import {
  typeBoxCss,
  productImageBox,
  productImage,
  headerBox,
  productList,
  mainContent,
  mainWindow,
} from "../../assets/styles/styles";

const socialMediaIcons = {
  any: <PublicIcon fontSize="large" />,
  facebook: <FacebookIcon fontSize="large" />,
  instagram: <InstagramIcon fontSize="large" />,
  twitter: <TwitterIcon fontSize="large" />,
  linkedIn: <LinkedInIcon fontSize="large" />,
  pinterest: <PinterestIcon fontSize="large" />,
  youtube: <YouTubeIcon fontSize="large" />,
};

const placeTypeIcons = {
  oldHouse: <BalconyIcon fontSize="small" />,
  restaurant: <RestaurantIcon fontSize="small" />,
  rentHouse: <BedroomParentIcon fontSize="small" />,
  bar: <LocalBarIcon fontSize="small" />,
  cafeteria: <DiningIcon fontSize="small" />,
  gym: <FitnessCenterIcon fontSize="small" />,
  art: <ColorLensIcon fontSize="small" />,
  museum: <MuseumIcon fontSize="small" />,
  library: <LocalLibraryIcon fontSize="small" />,
  nightLife: <NightlifeIcon fontSize="small" />,
  mall: <LocalMallIcon fontSize="small" />,
  shop: <LocalGroceryStoreIcon fontSize="small" />,
  beauty: <UmbrellaIcon fontSize="small" />,
  electronic: <BoltIcon fontSize="small" />,
  cloth: <CheckroomIcon fontSize="small" />,
  hotel: <HotelIcon fontSize="small" />,
  fuel: <LocalGasStationIcon fontSize="small" />,
  carRental: <CarRentalIcon fontSize="small" />,
};

const Watch = () => {
  const location = useLocation();

  const { modeState, setModeState } = useMode();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const toggleMode = () => setModeState({ type: "toggle" });

  const typesReducer = (typesStates, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        if (newArray.length) newArray[0].active = true;
        return newArray;
      }
      case "set-active": {
        const { index } = action;
        typesStates.forEach((item, i) => {
          if (index === i) typesStates[i].active = true;
          else typesStates[i].active = false;
        });
        return [...typesStates];
      }
      case "delete": {
        const { index } = action;
        const newArray = [...typesStates];
        newArray.splice(index, 1);
        return newArray;
      }
      case "add": {
        const { newType } = action;
        return [...typesStates, newType];
      }
      default:
        return [];
    }
  };

  const [productTypes, setProductTypes] = useReducer(typesReducer, []);

  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [selected, setSelected] = useState({});

  const [visible, setVisible] = useState(false);

  const onModalClose = () => setVisible(false);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");
  const [menu, setMenu] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState([]);
  const [business, setBusiness] = useState([]);
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const realMenu = currentMenu;
      const response = await fetchMenu(dashesToSpace(realMenu));
      const data = await response.data;
      if (data) {
        if (data.photo) setPhoto(data.photo.url);
        console.log(data);
        setMenu(data.menu);
        setDescription(data.description);
        setPhone(data.phone);
        setBusiness(data.business);
        setSocialMedia(data.socialMedia);
        setProductTypes({
          type: "set",
          newArray: data.types
            ? data.types.map((item) => ({ name: item }))
            : [],
        });
        setProducts(data.list ? data.list : []);
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
    }
  };

  const retry = () => fetch();

  const onScroll = useCallback(
    (e) => {
      let firstTrue = -1;
      for (let i = 0; i < productTypes.length; i += 1) {
        const elem = document.getElementById(`title-${productTypes[i].name}`);
        const isInViewport = inViewport(elem);
        if (isInViewport && firstTrue === -1) firstTrue = i;
        if (
          isInViewport &&
          document.documentElement.scrollTop >=
            Math.floor(elem.offsetTop - elem.getBoundingClientRect().top)
        )
          setTab(i);
      }
    },
    [productTypes]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (visible) setVisible(false);
      }
    },
    [visible, setVisible]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onScroll, onKeyDown]);

  useEffect(() => {
    if (currentMenu.length) retry();
  }, [currentMenu]);

  useEffect(() => {
    setLoading(-1);
  }, [notFound]);

  useEffect(() => {
    if (location.pathname) {
      const splitPath = location.pathname.split("/");
      if (splitPath.length > 2) {
        const menuName = location.pathname.split("/")[2];
        if (menuName) setCurrentMenu(menuName);
        else setNotFound(true);
      } else setNotFound(true);
    }
    if (location.search) {
      const queryParams = location.search.substring(1);
      const [paramName, paramValue] = queryParams.split("=");
      if (paramName && paramValue) {
        setTimeout(() => {
          console.log("hola");
          const product = document.getElementById(`obj-${paramValue}`);
          console.log(product);
          if (product !== null) scrollTo(product.offsetTop);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMenu, location]);

  const [tab, setTab] = useState(0);

  const changeTab = (e, value) => {
    setTab(value);
    const type = document.getElementById(`title-${productTypes[value].name}`);
    if (type !== null) scrollTo(type.offsetTop);
  };

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      {selected && (
        <Modal visible={visible} item={selected} onClose={onModalClose} />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
      <ToLogin />
      {notFound ? (
        <NotFound />
      ) : (
        <>
          <Box sx={mainContent}>
            <Box sx={productImageBox}>
              <SitoImage
                src={photo && photo !== "" ? photo : noProduct}
                alt={menu}
                sx={productImage}
              />
            </Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "10px" }}
            >
              {menu}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {business.map((item) => (
                <Tooltip key={item.url} title={item.name}>
                  <MUILink
                    href={`${process.env.PUBLIC_URL}/?type=${item.id}`}
                    rel="noopener"
                    target="_blank"
                  >
                    <IconButton color="primary">
                      {
                        placeTypeIcons[
                          languageState.texts.Settings.Inputs.CenterTypes.Types.find(
                            (jtem) => jtem.id === item.id
                          ).icon
                        ]
                      }
                    </IconButton>
                  </MUILink>
                </Tooltip>
              ))}
            </Box>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {phone.length > 0 ? (
                <InViewComponent delay="0.1s">
                  <Tooltip
                    title={
                      languageState.texts.Settings.Inputs.Contact.SocialMedia
                        .WhatsApp
                    }
                  >
                    <MUILink
                      href={`https://wa.me/${phone}`}
                      rel="noopener"
                      target="_blank"
                    >
                      <IconButton color="primary">
                        <WhatsAppIcon fontSize="large" />
                      </IconButton>
                    </MUILink>
                  </Tooltip>
                </InViewComponent>
              ) : null}
              {socialMedia.map((item, i) => (
                <InViewComponent delay={`0.${2 + i * 2}s`} key={item.url}>
                  <Tooltip
                    title={
                      languageState.texts.Settings.Inputs.Contact.SocialMedia
                        .Icons[item.icon]
                    }
                  >
                    <MUILink href={item.url} rel="noopener" target="_blank">
                      <IconButton color="primary">
                        {socialMediaIcons[item.icon]}
                      </IconButton>
                    </MUILink>
                  </Tooltip>
                </InViewComponent>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TabView
              value={tab}
              onChange={changeTab}
              tabs={productTypes.map((item, i) => item.name)}
              content={[]}
            />
            <IconButton
              color="inherit"
              sx={{ position: "absolute", top: "3px", right: 0, zIndex: 40 }}
              onClick={toggleMode}
            >
              {modeState.mode === "light" ? (
                <DarkModeIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>
          </Box>
          {error && !currentMenu && loading === -1 && <Error onRetry={retry} />}
          {loading === -1 && !error && !currentMenu && <Empty />}
          {!error && (
            <Box sx={productList}>
              {!loading &&
                productTypes.map((item) => (
                  <Box key={item.name} sx={typeBoxCss}>
                    <Box id={`title-${item.name}`} sx={headerBox}>
                      <Typography sx={{ fontSize: "1.5rem" }} variant="h3">
                        {item.name}
                      </Typography>
                    </Box>
                    <Box>
                      {products
                        .filter((jtem) => jtem.type === item.name)
                        .map((jtem) => (
                          <InViewComponent
                            key={jtem.id}
                            id={`obj-${spaceToDashes(
                              parserAccents(jtem.name)
                            )}`}
                            delay={`0.${1 * (jtem.index + 1)}s`}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <ProductCard
                              item={jtem}
                              onClick={() => {
                                setVisible(true);
                                setSelected(jtem);
                              }}
                            />
                          </InViewComponent>
                        ))}
                    </Box>
                  </Box>
                ))}
            </Box>
          )}
        </>
      )}
    </SitoContainer>
  );
};

export default Watch;
