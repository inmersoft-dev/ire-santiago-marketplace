import { useState } from "react";

import PropTypes from "prop-types";

// @mui/material
import { Box, Button, Typography } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const Schedule = (props) => {
  const { schedule } = props;
  const { languageState } = useLanguage();

  const [active, setActive] = useState(new Date().getDay());

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "20px",
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {schedule[1] ? (
        <>
          {" "}
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {languageState.texts.Settings.Inputs.Schedule.Days.map((item) => (
              <Button
                key={item.id}
                onClick={() => setActive(item.id)}
                variant={item.id === String(active) ? "contained" : "inherit"}
              >
                {item.tag}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>
              {
                languageState.texts.Settings.Inputs.Schedule.Types[
                  schedule[active].type
                ]
              }
            </Typography>
            {schedule[active].type ? (
              <Typography>
                {new Date(schedule[active].startTime).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
                {" - "}
                {new Date(schedule[active].endTime).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Typography>
            ) : null}
          </Box>
        </>
      ) : null}
    </Box>
  );
};

Schedule.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default Schedule;
