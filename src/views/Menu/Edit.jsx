/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import inViewport from "in-viewport";

import md5 from "md5";

// sito components
import SitoImage from "sito-image";

// @mui components
import { Box, Paper, useTheme, IconButton, Typography } from "@mui/material";

// @mui icons
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// own components
import Error from "../../components/Error/Error";
import Empty from "../../components/Empty/Empty";
import MainContent from "./components/MainContent";
import Modal from "../../components/Modal/EditModal";
import Loading from "../../components/Loading/Loading";
import WatchAppBar from "../../components/AppBar/WatchAppBar";
import FabButtons from "../../components/FabButtons/FabButtons";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// functions
import { getUserName, userLogged } from "../../utils/auth";

// services
import { removeImage } from "../../services/photo";
import { fetchMenu, saveMenu } from "../../services/menu";

// contexts

import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// styles
import {
  headerBox,
  mainWindow,
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productList,
  typeBoxCss,
} from "../../assets/styles/styles";

const Edit = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selected, setSelected] = useState();

  const [visible, setVisible] = useState(false);

  const onModalClose = () => setVisible(false);

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

  const productsReducer = (productsState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray.map((item, i) => ({ ...item, index: i }));
      }
      case "delete": {
        const { index } = action;
        const newArray = [...productsState];
        newArray.splice(index, 1);
        return newArray.map((item, i) => ({ ...item, index: i }));
      }
      case "change-visibility": {
        const { index } = action;
        const newArray = [...productsState];
        newArray[index].visibility = !newArray[index].visibility;
        return newArray.map((item, i) => ({ ...item, index: i }));
      }
      case "modify": {
        const { index, newProduct } = action;
        productsState[index] = newProduct;
        return [...productsState];
      }
      case "add": {
        const { newProduct } = action;
        return [
          ...productsState,
          { ...newProduct, index: productsState.length },
        ];
      }
      default:
        return [];
    }
  };

  const [products, setProducts] = useReducer(productsReducer, []);

  const autoSave = async () => {
    // setLoading(1);
    try {
      const newProducts = [...products];
      await saveMenu(
        getUserName(),
        menuName,
        newProducts,
        productTypes.map((item) => item.name)
      );
      // setLoading(0);
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
  };

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) autoSave();
  }, [products]);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);

  const [menuName, setMenuName] = useState("");
  const [menu, setMenu] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState([]);
  const [business, setBusiness] = useState([]);
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [geolocation, setGeoLocation] = useState({});

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const fetch = async () => {
    setLoading(1);
    setLoading(1);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        setMenuName(data.menu);
        if (data.photo) setPhoto(data.photo.url);
        setMenu(data.menu);
        setDescription(data.description);
        setPhone(data.phone);
        setBusiness(data.business);
        setSocialMedia(data.socialMedia);
        if (data.location) setGeoLocation(data.location);
        setProductTypes({
          type: "set",
          newArray: data.types
            ? data.types.map((item) => ({ name: item }))
            : [],
        });
        setProducts({ type: "set", newArray: data.list ? data.list : [] });
        setLoading(0);
        setLoading(0);
        setFetched(true);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
      setLoading(-1);
    }
  };

  const { languageState } = useLanguage();

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
          setProductTypes({
            type: "set-active",
            index: i,
          });
      }
    },
    [productTypes]
  );

  const changeVisibility = (index) =>
    setProducts({ type: "change-visibility", index });

  const deleteProduct = async (index) => {
    try {
      if (products[index].photo) await removeImage(productTypes.photo.fileId);
      setProducts({ type: "delete", index });
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
  };

  const onSubmit = async (id, name, type, description, price, photo) => {
    setLoading(1);
    try {
      const newProductTypes = [...productTypes.map((item) => item.name)];
      const typePosition = productTypes.find((item) => item.name === type);
      if (!typePosition) {
        setProductTypes({ type: "add", newType: { name: type } });
        newProductTypes.push(type);
      }
      const newProducts = [...products];
      if (!id || !id.length) {
        const parsedObj = {
          id: md5(name),
          name,
          type,
          description,
          price,
          photo,
          visibility: true,
        };
        setProducts({
          type: "add",
          newProduct: parsedObj,
        });
        newProducts.push(parsedObj);
      } else {
        const indexOf = products.findIndex((item) => item.id === id);
        const parsedObj = {
          id,
          name,
          type,
          description,
          price,
          photo,
        };
        if (indexOf > -1) {
          setProducts({
            type: "modify",
            index: indexOf,
            newProduct: parsedObj,
          });
          newProducts[indexOf] = parsedObj;
        }
      }
      const result = await saveMenu(
        getUserName(),
        menuName,
        newProducts,
        newProductTypes
      );
      if (result.status === 200) {
        showNotification(
          "success",
          languageState.texts.Messages.SaveSuccessful
        );
        setSelected({
          id: "",
          photo: "",
          name: "",
          description: "",
          price: "",
          type: "",
        });
        setVisible(false);
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setLoading(-1);
    }
  };

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
    if (!userLogged()) navigate("/auth/");
    retry();
  }, []);

  const hasProducts = useCallback(
    (item) => {
      const lProducts = products.filter((jtem) => jtem.type === item.name);
      if (lProducts.length > 0) return true;
      return false;
    },
    [products]
  );

  const parseI = (start, i) => {
    let toReturn = start;
    for (let j = 0; j < i; j += 1) toReturn += 0.2;
    return toReturn;
  };

  return (
    <Box sx={mainWindow} flexDirection="column">
      <FabButtons location="edit" />
      {selected && (
        <Modal
          visible={visible}
          item={selected}
          onClose={onModalClose}
          onSubmit={onSubmit}
          types={productTypes}
        />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
      <WatchAppBar productTypes={productTypes} hasProducts={hasProducts} />
      <MainContent
        menu={menu}
        phone={phone}
        photo={photo}
        business={business}
        socialMedia={socialMedia}
        description={description}
        geolocation={geolocation}
        editing
        onAction={() => {
          setSelected({
            id: "",
            photo: "",
            name: "",
            description: "",
            price: "",
            type: "",
          });
          setVisible(true);
        }}
      />
      {error && loading === -1 && <Error onRetry={retry} />}
      {loading === -1 && !error && <Empty />}
      {!error && loading === 0 && (
        <Box sx={productList}>
          {!loading &&
            productTypes
              .filter((item) => hasProducts(item))
              .map((item) => (
                <Box key={item.name} sx={typeBoxCss}>
                  <Box id={`title-${item.name}`} sx={headerBox}>
                    <Typography sx={{ fontSize: "1.5rem" }} variant="h3">
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    {products
                      .filter((jtem) => jtem.type === item.name)
                      .map((jtem, j) => (
                        <InViewComponent
                          key={jtem.id}
                          delay={`${parseI(0.1, j)}s`}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Paper
                            id={`obj-${jtem.id}`}
                            elevation={1}
                            sx={{
                              position: "relative",
                              marginTop: "20px",
                              width: { sm: "630px", xs: "100%" },
                              padding: "1rem",
                              borderRadius: "1rem",
                              background: jtem.visibility
                                ? theme.palette.background.paper
                                : theme.palette.background.default,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "1px",
                                right: "1px",
                              }}
                            >
                              <IconButton
                                color="primary"
                                onClick={() => changeVisibility(jtem.index)}
                              >
                                {jtem.visibility ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => deleteProduct(jtem.index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Box
                              sx={{ cursor: "pointer", display: "flex" }}
                              onClick={() => {
                                setVisible(true);
                                setSelected(jtem);
                              }}
                            >
                              <Box
                                sx={{ marginRight: "20px", display: "flex" }}
                              >
                                <Box sx={productImageBox}>
                                  <SitoImage
                                    src={
                                      jtem.photo && jtem.photo.url !== ""
                                        ? jtem.photo.url
                                        : noProduct
                                    }
                                    alt={jtem.name}
                                    sx={productImage}
                                  />
                                </Box>
                              </Box>
                              <Box sx={productContentBox}>
                                <Typography
                                  variant="h3"
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {jtem.name}
                                </Typography>
                                <Box sx={productDescriptionBox}>
                                  <Typography
                                    variant="body1"
                                    sx={{ textAlign: "justify" }}
                                  >
                                    {jtem.description}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "bold", width: "80%" }}
                                >
                                  {jtem.price} CUP
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </InViewComponent>
                      ))}
                  </Box>
                </Box>
              ))}
        </Box>
      )}
    </Box>
  );
};

export default Edit;
