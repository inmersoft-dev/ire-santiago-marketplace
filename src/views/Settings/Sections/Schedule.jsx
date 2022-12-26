/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useReducer, useCallback } from "react";

// @emotion
import { css } from "@emotion/css";

// sito components
import SitoContainer from "sito-container";

// @mui/material
import {
  useTheme,
  useMediaQuery,
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
  const biggerThanMD = useMediaQuery("(min-width:900px)");
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

  const startDate = dayjs();
  const endDate = dayjs();

  const createScheduleObject = useCallback(() => {
    const newDaysState = {};
    languageState.texts.Settings.Inputs.Schedule.Days.forEach((item) => {
      newDaysState[item.id] = {
        startTime: startDate,
        endDate: endDate,
        type: 2,
      };
    });
    return newDaysState;
  }, [languageState]);

  const daysReducer = (daysState, action) => {
    const { type } = action;
    switch (type) {
      case "change-everyday": {
        const { newValue } = action;
        return { ...daysState, everyday: newValue };
      }
      case "set": {
        const { newSchedule } = action;
        return newSchedule;
      }
      case "change-schedule-type": {
        const { activeDay, scheduleType } = action;
        const newDaysState = { ...daysState };
        if (daysState[activeDay]) newDaysState[activeDay].type = scheduleType;
        else newDaysState[activeDay] = { type: scheduleType };
        return newDaysState;
      }
      case "change-start-time": {
        const { activeDay, newStartTime } = action;
        const newDaysState = { ...daysState };
        if (daysState[activeDay])
          newDaysState[activeDay].startTime = newStartTime;
        else newDaysState[activeDay] = { startTime: newStartTime };
        return newDaysState;
      }
      case "change-end-time": {
        const { activeDay, newEndTime } = action;
        const newDaysState = { ...daysState };
        if (daysState[activeDay]) newDaysState[activeDay].endTime = newEndTime;
        else newDaysState[activeDay] = { endTime: newEndTime };
        return newDaysState;
      }
      default:
        return createScheduleObject();
    }
  };

  const [schedule, setSchedule] = useReducer(
    daysReducer,
    createScheduleObject()
  );

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchMenu(getUserName());
        const data = await response.data;
        if (data) {
          if (data.schedule) {
            setSchedule({ type: "set", newSchedule: data.schedule });
            setSettingsState({
              type: "set-schedule",
              schedule: data.schedule,
            });
          }
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
      const response = await saveSchedule(getUserName(), schedule);
      if (response.status === 200) {
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
    setSchedule({ type: "set", newSchedule: settingsState.schedule });
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.schedule) retry();
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

  const getDaysHeight = useCallback(() => {
    if (biggerThanMD) {
      if (!schedule.everyday) return "34.39px";
      else return 0;
    } else {
      if (!schedule.everyday) return "79.39px";
      else return 0;
    }
  }, [biggerThanMD, schedule]);

  return (
    <form
      onSubmit={onSubmit}
      className={css({ width: "100%", position: "relative" })}
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          borderRadius: 0,
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
                  checked={schedule.everyday}
                  onChange={(e) =>
                    setSchedule({
                      type: "change-everyday",
                      newValue: e.target.checked,
                    })
                  }
                />
              }
              label={languageState.texts.Settings.Inputs.Schedule.Everyday}
            />
            <Box
              sx={{
                gap: "10px",
                display: "flex",
                margin: "10px 0",
                flexWrap: "wrap",
                overflowY: "hidden",
                transition: "height 400ms ease",
                height: getDaysHeight(),
              }}
            >
              {languageState.texts.Settings.Inputs.Schedule.Days.map((item) => (
                <Button
                  key={item.id}
                  disabled={schedule.everyday}
                  onClick={() => setActiveDay(item.id)}
                  variant={item.id === activeDay ? "contained" : "outlined"}
                >
                  {item.id}
                </Button>
              ))}
            </Box>
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
                value={schedule[activeDay] ? schedule[activeDay].type : 0}
                label={`${
                  languageState.texts.Settings.Inputs.Schedule.Days.find(
                    (item) => item.id === activeDay
                  ).id
                }} ${languageState.texts.Settings.Inputs.Schedule.SelectType}`}
                onChange={(e) =>
                  setSchedule({
                    type: "change-schedule-type",
                    activeDay,
                    scheduleType: Number(e.target.value),
                  })
                }
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
                value={
                  schedule[activeDay]
                    ? schedule[activeDay].startTime
                    : startDate
                }
                onChange={(newValue) =>
                  setSchedule({
                    type: "change-start-time",
                    activeDay,
                    newStartTime: newValue,
                  })
                }
                disabled={
                  schedule[activeDay] ? schedule[activeDay].type !== 2 : true
                }
                renderInput={(params) => <TextField {...params} />}
                label={languageState.texts.Settings.Inputs.Schedule.Start}
              />
              <TimePicker
                value={
                  schedule[activeDay] ? schedule[activeDay].endTime : endDate
                }
                onChange={(newValue) =>
                  setSchedule({
                    type: "change-end-time",
                    activeDay,
                    newEndTime: newValue,
                  })
                }
                disabled={
                  schedule[activeDay] ? schedule[activeDay].type !== 2 : true
                }
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
            {/* <Button variant="contained">
              {languageState.texts.Buttons.ApplyTemplate}
            </Button> */}
            <Box sx={{ display: "flex" }}>
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
            </Box>
          </SitoContainer>
        </>
      ) : (
        <Error onRetry={retry} />
      )}
    </form>
  );
};

export default Generals;
