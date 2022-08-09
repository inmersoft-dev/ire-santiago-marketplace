import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// in-viewport
import inViewport from "in-viewport";

// @emotion
import { motion } from "framer-motion";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui components
import {
  useTheme,
  Paper,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// own components
import Loading from "../../components/Loading/Loading";
import TabView from "../../components/TabView/TabView";
import NotConnected from "../../components/NotConnected/NotConnected";
import Empty from "../../components/Empty/Empty";
import Modal from "../../components/Modal/EditModal";
import ToLogout from "../../components/ToLogout/ToLogout";
import ToLogin from "../../components/ToLogin/ToLogin";

// functions
import { getUserName, userLogged } from "../../utils/auth";
import { getIndexOfByAttribute } from "../../utils/functions";

// services
import { fetchMenu, saveMenu } from "../../services/menu";
import { removeImage } from "../../services/photo";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

// images
import noProduct from "../../assets/images/no-product.webp";

// animations
import {
  motionUlContainer,
  motionUlCss,
  motionLiAnimation,
  motionLiCss,
} from "../../assets/animations/motion";

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

  const onModalClose = () => {
    setVisible(false);
  };

  const [types, setTypes] = useState([]);

  const [tab, setTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);

  const [menuName, setMenuName] = useState("");
  const [allData, setAllData] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const justGetData = async () => {
    const response = await fetchMenu(getUserName());
    const data = await response.data;
    return data;
  };

  const setOnView = (types, data) => {
    const tabsByType = [];
    types.forEach((item, i) => {
      tabsByType.push([]);
    });
    for (const item of data) {
      let parsedPhoto = "";
      if (item.ph) parsedPhoto = item.ph.url;
      if (parsedPhoto) item.loaded = parsedPhoto;
      if (tabsByType[item.t])
        tabsByType[item.t].push(
          <motion.li
            key={item.i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={motionLiAnimation}
            className={motionLiCss}
          >
            <Paper
              id={`obj-${item.i}`}
              elevation={1}
              sx={{
                position: "relative",
                marginTop: "20px",
                width: { md: "800px", sm: "630px", xs: "100%" },
                padding: "1rem",
                borderRadius: "1rem",
                background: theme.palette.background.paper,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "95%", md: "98%" },
                  position: "absolute",
                  marginTop: "-10px",
                  justifyContent: "flex-end",

                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <IconButton color="error" onClick={() => deleteProduct(item.i)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                sx={{ cursor: "pointer", display: "flex" }}
                onClick={() => {
                  setVisible(true);
                  setSelected(data[getIndexOfByAttribute(data, "i", item.i)]);
                }}
              >
                <SitoContainer sx={{ marginRight: "20px" }}>
                  <Box sx={productImageBox}>
                    <SitoImage
                      src={item.ph && item.ph !== "" ? parsedPhoto : noProduct}
                      alt={item.n}
                      sx={productImage}
                    />
                  </Box>
                </SitoContainer>
                <Box sx={productContentBox}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.n}
                  </Typography>
                  <Box sx={productDescriptionBox}>
                    <Typography variant="body1" sx={{ textAlign: "justify" }}>
                      {item.d}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", width: "75%" }}
                  >
                    {item.p} CUP
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.li>
        );
    }
    setTypes(types);
    setTabs(tabsByType);
    setAllData(data);
  };

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data && data.t && data.l) {
        setMenuName(data.m);
        setOnView(data.t, data.l);
        setLoading(0);
      } else {
        setLoading(-1);
        if (response.status !== 200)
          setNotificationState({
            type: "set",
            ntype: "error",
            message: languageState.texts.Errors.NotConnected,
          });
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
      setLoading(-1);
    }
  };

  const { setNotificationState } = useNotification();
  const { languageState } = useLanguage();

  const retry = () => fetch();

  const firstActive = (array) => {
    let i = 0;
    while (i < array.length) {
      if (array[i].visibility) return array[i];
      i += 1;
    }
    return -1;
  };

  const onScroll = useCallback(
    (e) => {
      if (!shouldScroll && allData) {
        const visibilities = [];
        for (let i = 0; i < allData.length; i += 1) {
          const elem = document.getElementById(`obj-${allData[i].i}`);
          const isInViewport = inViewport(elem);
          visibilities.push({
            index: i,
            visibility: isInViewport,
            type: allData[i].t,
          });
        }
        const localFirstActive = firstActive(visibilities);
        if (localFirstActive !== -1 && tab !== localFirstActive.type)
          setTab(localFirstActive.type);
      }
      setShouldScroll(false);
    },
    [tab, allData, shouldScroll]
  );

  const onClick = useCallback(
    (e) => {
      if (!shouldScroll && e.target.id && e.target.id.split("-").length > 2) {
        setTab(Number(e.target.id.split("-")[2]));
        setShouldScroll(true);
      }
    },
    [shouldScroll, setShouldScroll]
  );

  const deleteProduct = async (index) => {
    setLoading(1);
    const data = await justGetData();
    const newAllData = data.l;
    const newTypes = data.t;
    const realIndex = getIndexOfByAttribute(newAllData, "i", index);
    const deletionType = newTypes.indexOf(newTypes[newAllData[realIndex].t]);
    if (newAllData[realIndex].ph)
      await removeImage(newAllData[realIndex].ph.fileId);
    try {
      newAllData.splice(realIndex, 1);
      let found = false;
      for (let i = 0; i < newAllData.length && !found; i += 1)
        if (newAllData[i].t === deletionType) found = true;
      // if (!found) newTypes.splice(deletionType, 1);
      await saveMenu(getUserName(), menuName, newAllData, newTypes);
      setOnView(newTypes, newAllData);
      setLoading(0);
    } catch (err) {
      console.log(err);
      return setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.SomeWrong,
      });
    }
  };

  const onSubmit = async (remoteData) => {
    setVisible(false);
    setLoading(1);
    const { id, name, type, description, price, photo } = remoteData;
    let typePosition = types.indexOf(type);
    const newAllData = [];
    // reading without loaded
    allData.forEach((item) => {
      const { d, i, n, p, ph, t } = item;
      newAllData.push({ d, i, n, p, ph, t });
    });
    const newTypes = [];
    types.forEach((item) => newTypes.push(item));
    if (typePosition === -1) newTypes.push(type);
    // taking new type position
    typePosition = newTypes.indexOf(type);
    const parsedData = {
      i: id,
      n: name,
      t: typePosition,
      d: description,
      p: price,
      ph: photo,
    };
    const indexes = [];
    newAllData.filter((item, i) => {
      if (item.i === parsedData.i) {
        indexes.push(i);
        return item;
      }
      return null;
    });
    if (indexes.length) newAllData[indexes[0]] = { ...parsedData };
    else newAllData.push(parsedData);
    const result = await saveMenu(
      getUserName(),
      menuName,
      newAllData,
      newTypes
    );
    if (result.status === 200)
      setNotificationState({
        type: "set",
        ntype: "success",
        message: languageState.texts.Messages.SaveSuccessful,
      });
    else
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.SomeWrong,
      });
    setSelected({
      i: `${getUserName()}-${
        allData.length
          ? Number(allData[allData.length - 1].i.split("-")[1]) + 1
          : 0
      }`,
      ph: "",
      n: "",
      d: "",
      p: "",
      t: "",
    });
    retry();
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
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onScroll, onClick, onKeyDown]);

  useEffect(() => {
    if (!userLogged()) navigate("/auth/");
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      <ToLogout />
      <ToLogin />
      {selected && (
        <Modal
          visible={visible}
          item={selected}
          onClose={onModalClose}
          onSubmit={onSubmit}
          types={types}
        />
      )}
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />
      <TabView
        value={tab}
        tabs={types.filter((item, i) => {
          if (tabs[i].length) return item;
          return null;
        })}
        content={[]}
        shouldScroll={shouldScroll}
      />
      <SitoContainer
        sx={{ width: "100%", marginTop: "65px" }}
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={() => {
            setSelected({
              i: `${getUserName()}-${
                allData.length
                  ? Number(allData[allData.length - 1].i.split("-")[1]) + 1
                  : 0
              }`,
              ph: "",
              n: "",
              d: "",
              p: "",
              t: "",
            });
            setVisible(true);
          }}
        >
          {languageState.texts.Insert.Buttons.Insert}
        </Button>
      </SitoContainer>
      {error && loading === -1 && <NotConnected onRetry={retry} />}
      {loading === -1 && !error && <Empty />}
      {!error && loading === 0 && (
        <Box sx={productList}>
          {tabs
            .filter((item) => {
              if (item.length > 0) return item;
              return null;
            })
            .map((item, i) => (
              <Box key={i} sx={typeBoxCss}>
                <Box id={`title-${i}`} sx={headerBox}>
                  <Typography variant="h5">
                    {
                      types.filter((item, i) => {
                        if (tabs[i].length) return item;
                        return null;
                      })[i]
                    }
                  </Typography>
                </Box>
                <motion.ul
                  variants={motionUlContainer}
                  className={motionUlCss}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {item}
                </motion.ul>
              </Box>
            ))}
        </Box>
      )}
    </SitoContainer>
  );
};

export default Edit;
