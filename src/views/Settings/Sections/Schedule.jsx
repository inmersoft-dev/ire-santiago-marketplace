/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// @emotion
import { css } from "@emotion/css";

// sito components
import SitoContainer from "sito-container";

// @mui/material
import {
  useTheme,
  Box,
  Select,
  Button,
  Checkbox,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  FormControlLabel,
} from "@mui/material";

//@mui/x-date-pickers
import { TimePicker } from "@mui/x-date-pickers";

// own components
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useSettings } from "../../../context/SettingsProvider";
import { useNotification } from "../../../context/NotificationProvider";

// utils
import { getUserName, userLogged } from "../../../utils/auth";

// services
import { fetchMenu } from "../../../services/menu.js";

import { saveSchedule } from "../../../services/profile";

import dayjs from "dayjs";

const Generals = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeDay, setActiveDay] = useState(
    languageState.texts.Settings.Inputs.Schedule.Days[0].id || ""
  );
  const [everyday, setEveryday] = useState(false);
  const [scheduleType, setScheduleType] = useState(2);
  const [startDate, setStartDate] = useState(dayjs());
  const handleStartDate = (e) => {};

  const [endDate, setEndDate] = useState(dayjs());
  const handleEndDate = (e) => {};

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchMenu(getUserName());
        const data = await response.data;
        if (data) {
          if (data.schedule) {
          }
          setSettingsState({
            type: "set-schedule",
            schedule: data.schedule,
          });
        }
      } catch (err) {
        console.error(err);
        showNotification("error", String(err));
        setError(true);
      }
      setLoading(false);
    }
  };

  const retry = () => fetch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await saveSchedule(getUserName());
      if (response.status === 200) {
        const schedule = {};
        showNotification(
          "success",
          languageState.texts.Messages.SaveSuccessful
        );
        setSettingsState({
          type: "set-generals",
          schedule,
        });
        setLoading(false);
        return true;
      } else {
        const { error } = response.data;
        console.error(error);
        showNotification("error", languageState.texts.Errors.SomeWrong);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
    setLoading(false);
    return false;
  };

  const init = () => {
    const schedule = settingsState.schedule;
    setLoading(false);
  };

  useEffect(() => {
    if (
      !settingsState.photo ||
      !settingsState.preview ||
      !settingsState.business ||
      !settingsState.menu
    )
      retry();
    else init();
  }, []);

  const goToEdit = async () => {
    /* if (getValues("menu") && getValues("menu").length) {
      const schedule = {};
      const value = await onSubmit({
        schedule,
      });
      if (value) navigate("/menu/edit/");
    } else {
      setMenuNameHelperText(languageState.texts.Errors.NameRequired);
      const menuInput = document.getElementById("menu");
      if (menuInput !== null) document.getElementById("menu").focus();
    } */
  };

  return (
    <form
      onSubmit={onSubmit}
      className={css({ width: "100%", position: "relative" })}
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          zIndex: loading ? 99 : -1,
        }}
      />
      {!error ? (
        <>
          {/* Schedule */}
          <Box sx={{ marginTop: "10px" }}>
            <Typography>
              {languageState.texts.Settings.Inputs.Schedule.Title}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={everyday}
                  onChange={() => setEveryday(!everyday)}
                />
              }
              label={languageState.texts.Settings.Inputs.Schedule.Everyday}
            />
            <SitoContainer
              sx={{
                margin: "10px 0",
                gap: "10px",
              }}
            >
              {languageState.texts.Settings.Inputs.Schedule.Days.map((item) => (
                <Button
                  key={item.id}
                  disabled={everyday}
                  onClick={() => setActiveDay(item.id)}
                  variant={item.id === activeDay ? "contained" : "outlined"}
                >
                  {item.id}
                </Button>
              ))}
            </SitoContainer>
            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="schedule-type">
                {
                  languageState.texts.Settings.Inputs.Schedule.Days.find(
                    (item) => item.id === activeDay
                  ).id
                }{" "}
                {languageState.texts.Settings.Inputs.Schedule.SelectType}
              </InputLabel>
              <Select
                id="schedule-type"
                value={scheduleType}
                label={`${
                  languageState.texts.Settings.Inputs.Schedule.Days.find(
                    (item) => item.id === activeDay
                  ).id
                }} ${languageState.texts.Settings.Inputs.Schedule.SelectType}`}
                onChange={(e) => setScheduleType(Number(e.target.value))}
              >
                {languageState.texts.Settings.Inputs.Schedule.Types.map(
                  (item, i) => (
                    <MenuItem value={i} key={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <SitoContainer
              sx={{
                marginTop: "20px",
                gap: "10px",
                svg: {
                  color: theme.palette.secondary.main,
                },
                div: {
                  flex: 1,
                },
              }}
            >
              <TimePicker
                value={startDate}
                onChange={handleStartDate}
                disabled={scheduleType !== 2}
                renderInput={(params) => <TextField {...params} />}
                label={languageState.texts.Settings.Inputs.Schedule.Start}
              />
              <TimePicker
                value={endDate}
                onChange={handleEndDate}
                disabled={scheduleType !== 2}
                renderInput={(params) => <TextField {...params} />}
                label={languageState.texts.Settings.Inputs.Schedule.End}
              />
            </SitoContainer>
          </Box>
          {/* Buttons */}
          <SitoContainer
            justifyContent="flex-end"
            sx={{ width: "100%", marginTop: "20px" }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{ marginRight: "10px" }}
            >
              {languageState.texts.Buttons.Save}
            </Button>
            <Button type="button" variant="outlined" onClick={goToEdit}>
              {languageState.texts.Buttons.Edit}
            </Button>
          </SitoContainer>
        </>
      ) : (
        <Error onRetry={retry} />
      )}
    </form>
  );
};

export default Generals;
