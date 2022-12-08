/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";

// @mui components
import { Box } from "@mui/material";

// components
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";

// services
import { saveLocation } from "../../../services/profile";
import { fetchMenu } from "../../../services/menu.js";

// utils
import { getUserName } from "../../../utils/auth";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useNotification } from "../../../context/NotificationProvider";

const Map = () => {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

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

  const saveRLocation = useCallback(async () => {
    try {
      setLoading(true);
      await saveLocation(getUserName(), lng, lat);
      showNotification("success", languageState.texts.Messages.SaveSuccessful);
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setLoading(false);
    }
  }, [lng, lat]);

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        if (data.location) {
          setLng(data.location.longitude);
          setLat(data.location.latitude);
        }
      }
    } catch (err) {
      setError(true);
      console.error(err);
      showNotification("error", String(err));
    }
    setLoading(false);
  };

  const retry = () => fetch();

  useEffect(() => {
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Loading
        visible={loading}
        sx={{
          zIndex: loading ? 99 : -1,
        }}
      />
      {!error ? (
        <Map
          onSave={saveRLocation}
          noButton
          onMapClick={lngLatSelected}
          lat={lat}
          lng={lng}
          point={{ lat, lng }}
          onChange={onChangeMap}
          onChangeLat={(newValue) => setLat(newValue)}
          onChangeLng={(newValue) => setLng(newValue)}
        />
      ) : (
        <Error onRetry={retry} />
      )}
    </Box>
  );
};

export default Map;
