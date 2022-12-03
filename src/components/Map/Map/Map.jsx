/* eslint-disable no-undef */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable no-shadow */
/* eslint-disable react/function-component-definition */
import { useLayoutEffect, useEffect, useState, useRef } from "react";

// sito components
import SitoContainer from "sito-container";

// styles
import "./style.css";

// react-map-gl
// eslint-disable-next-line no-unused-vars
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "!mapbox-gl";

// prop types
import PropTypes from "prop-types";

// @mui components
import { Box, Button, TextField } from "@mui/material";

// @mui icons
import MapIcon from "@mui/icons-material/Map";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";

// images
import pointImage from "../../../assets/images/point.webp";
// import Crash from "assets/images/crash";
import config from "../../../config";

const Map = (props) => {
  const {
    width,
    height,
    point,
    points,
    onMapClick,
    lng,
    lat,
    onChange,
    onChangeLng,
    onChangeLat,
    noButton,
    noGeocoder,
    noInputs,
  } = props;

  const { languageState } = useLanguage();

  const [apiMap, setApiMap] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [localLng, setLocalLng] = useState(-75.83877828533579);
  const [localLat, setLocalLat] = useState(21.801503428305598);

  const [zoom, setZoom] = useState(15);

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [showMap, setShowMap] = useState(true);

  const localOnChangeLng = (e) => {
    const { value } = e.target;
    let onePoint = false;
    let newString = "";
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "." && !onePoint) {
        onePoint = true;
        newString += value[i];
      } else if (value[i] === "-" && i === 0) newString += value[i];
      else if (numbers.indexOf(value[i]) > -1) newString += value[i];
    }
    if (onChange) onChange("lng", newString);
    else if (onChangeLng) onChangeLng(newString);
    setLocalLng(Number(newString));
  };

  const localOnChangeLat = (e) => {
    const { value } = e.target;
    let onePoint = false;
    let newString = "";
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "." && !onePoint) {
        onePoint = true;
        newString += value[i];
      } else if (value[i] === "-" && i === 0) newString += value[i];
      else if (numbers.indexOf(value[i]) > -1) newString += value[i];
    }
    if (onChange) onChange("lat", newString);
    else if (onChangeLat) onChangeLat(newString);
    setLocalLat(Number(newString));
  };

  const init = async () => {
    try {
      setApiMap(config.mapBoxAPI);
    } catch (e) {
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const flyToPoint = (currentFeature) => {
    map.current.flyTo({
      center: currentFeature.geometry
        ? currentFeature.geometry.coordinates
        : currentFeature,
      zoom: 15,
    });
  };

  const createPopUp = (currentFeature) => {
    const popUps = document.getElementsByClassName("mapboxgl-popup");
    // Check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();

    const { name, id, type, headerImages, description } =
      currentFeature.properties;

    // eslint-disable-next-line no-unused-vars
    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<img src=${
          headerImages && headerImages[0] ? headerImages[0].url : ""
        } alt="place-image"/>` +
          `<div class="popup-content">` +
          `<h3 class="title">${name}</h3>` +
          `<p>${description}</p>` +
          `<h3><a href="${process.env.PUBLIC_URL}/details:${id}-${type}">${languageState.texts.Home.SeeGrave}</a></h3></div>`
      )
      .addTo(map.current);
  };

  const addMarkers = () => {
    console.log(points);
    if (points.length) {
      // For each feature in the GeoJSON object above:
      for (const marker of points.features) {
        // Create a div element for the marker.
        const el = document.createElement("div");
        // Assign a unique `id` to the marker.
        el.id = `marker-${marker.properties.id}`;
        // Assign the `marker` class to each marker for styling.
        el.className = "marker";
        el.style.backgroundImage = `url('${
          /* marker.type === "graves" ? */ pointImage /*: types[marker.type] */
        }')`;

        el.addEventListener("click", (e) => {
          // Fly to the point
          flyToPoint(marker);
          // Close all other popups and display popup for clicked store
          createPopUp(marker);
          // Highlight listing in sidebar
          const activeItem = document.getElementsByClassName("active");
          e.stopPropagation();
          if (activeItem[0]) activeItem[0].classList.remove("active");
        });
        new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat(marker.geometry.coordinates)
          .addTo(map.current);
      }
    }
    /* if (point) {
    } */
  };

  useEffect(() => {
    if (apiMap === "" || !point) return;
    /*  if (localLng !== lng) setLocalLng(lng);
    if (localLat !== lat) setLocalLat(lat); */
    mapboxgl.accessToken = apiMap;
    if (map.current) return;
    console.log("entre aqui");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom,
    });
    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: apiMap, // Set the access token
      mapboxgl, // Set the mapbox-gl instance
      zoom, // Set the zoom level for geocoding results
      placeholder: "Enter an address or place name", // This placeholder text will display in the search bar
      /*  bbox: [-105.116, 39.679, -104.898, 39.837], */ // Set a bounding box
    });
    // Add the geocoder to the map
    map.current.addControl(geocoder, "top-right");
    // Add the search box to the top left

    geocoder.on("result", async (event) => {
      // When the geocoder returns a result
      const point = event.result.center;
      console.log(point); // Capture the result coordinates
      const [lat, lng] = point;
      setLocalLng(lng);
      onChangeLng(lng);
      setLocalLat(lat);
      onChangeLat(lat);

      /*  const marker = new mapboxgl.Marker(el);
      marker.setLngLat([lng, lat]).addTo(map.current);  */ // Add the marker to the map at the result coordinates
    });

    map.current.on("move", () => {
      setLocalLng(map.current.getCenter().lng);
      setLocalLat(map.current.getCenter().lat);
      setZoom(map.current.getZoom().toFixed(2));
      onChangeLng(localLng);
      onChangeLat(localLat);
    });
    map.current.on("click", (event) => {
      const markerOld = document.getElementsByClassName("marker");
      // Check if there is already a popup on the map and if so, remove it
      if (markerOld[0]) markerOld[0].remove();
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url('${pointImage}')`;
      el.id = `marker-${event.lngLat.wrap()}`;
      const { lng, lat } = event.lngLat.wrap();
      setLocalLng(lng);
      setLocalLat(lat);
      onChangeLng(lng);
      onChangeLat(lat);

      /* const marker = new mapboxgl.Marker(el);
      marker.setLngLat([lng, lat]).addTo(map.current); */

      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat([lng, lat])
        .addTo(map.current);

      /* Fly to the point */
      flyToPoint([lng, lat]);
    });

    /* if (lat && lng && map && map.current && map.current.getSource("single-point")) {
      console.log(map.current.getSource("single-point"));
      map.current.getSource("single-point").setData({ coordinates: [lng, lat], type: "Point" });
      flyToPoint({ geometry: { coordinates: [lng, lat] }* });
    } */
  });

  useEffect(() => {
    if (apiMap === "" || !points.type) return;
    mapboxgl.accessToken = apiMap;
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom,
    });
    map.current.on("move", () => {
      setLocalLng(map.current.getCenter().lng);
      setLocalLat(map.current.getCenter().lat);
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.on("click", (event) => {
      /* Determine if a feature in the "locations" layer exists at that point. */
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ["point"],
      });

      /* If it does not exist, return */
      if (!features.length) return;

      const clickedPoint = features[0];

      /* Fly to the point */
      flyToPoint(clickedPoint);
    });
    // eslint-disable-next-line no-undef
    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: config.mapBoxAPI, // Set the access token
      mapboxgl: map.current, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: languageState.texts.Map.SearchAddressplaceholder, // placeholder text for the search bar
    });
    if (!noGeocoder) {
      // Add the geocoder to the map
      map.current.addControl(geocoder);
    }
    map.current.on("load", () => {
      /* Add the data to your map as a layer */
      map.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) return error;
          map.current.addImage("my-point", image);
          map.current.addSource("single-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.current.addLayer({
            id: "point",
            source: "single-point",
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": "#448ee4",
            },
          });

          if (point !== "" && point !== 0) {
            const [lat, lng] = point.split(",");
            map.current
              .getSource("single-point")
              .setData({
                coordinates: [Number(lng), Number(lat)],
                type: "Point",
              });
            flyToPoint({ geometry: { coordinates: [lng, lat] } });
          }

          if (!noGeocoder)
            geocoder.on("result", (event) => {
              map.current
                .getSource("single-point")
                .setData(event.result.geometry);
            });

          map.current.addSource("graves", {
            type: "geojson",
            data: points,
          });
          map.current.addLayer({
            id: "locations",
            type: "symbol",
            source: "graves",
            layout: {
              "icon-image": "my-point",
              "icon-allow-overlap": false,
            },
          });

          // check if the Geolocation API is supported
          if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(onSuccess, onError);
            // Add geolocate control to the map.
            map.current.addControl(
              new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
              })
            );
          }
        }
      );

      addMarkers();

      // Listen for the `result` event from the Geocoder
      // `result` event is triggered when a user makes a selection
      //  Add a marker at the result's coordinates
    });
    map.current.on("click", (e) => {
      if (onMapClick) onMapClick(e.point, e.lngLat.wrap());
    });
  });

  return (
    <Box
      sx={{
        width,
        flex: 1,
        transition: "transform 500ms ease",
      }}
    >
      {!noInputs && (lng || lat) && (
        <SitoContainer ignoreDefault className="row">
          <SitoContainer alignItems="center" sx={{ marginBottom: "20px" }}>
            {(lng || lng === 0) && (
              <TextField
                label={languageState.texts.Map.Inputs.Longitude.label}
                placeholder={
                  languageState.texts.Map.Inputs.Longitude.placeholder
                }
                type="text"
                name="lng"
                id="lng"
                value={localLng}
                sx={{ marginRight: "20px" }}
                onChange={localOnChangeLng}
              />
            )}
            {(lat || lat === 0) && (
              <TextField
                label={languageState.texts.Map.Inputs.Latitude.label}
                placeholder={
                  languageState.texts.Map.Inputs.Latitude.placeholder
                }
                type="text"
                name="lat"
                id="lat"
                value={localLat}
                sx={{ marginRight: "20px" }}
                onChange={localOnChangeLat}
              />
            )}
            {!noButton && (
              <Button
                sx={{
                  minWidth: 0,
                  padding: "10px",
                  borderRadius: "100%",
                  marginBottom: "10px",
                }}
                variant={showMap ? "contained" : "outlined"}
                onClick={() => setShowMap(!showMap)}
              >
                <MapIcon />
              </Button>
            )}
          </SitoContainer>
        </SitoContainer>
      )}

      <Box
        sx={{
          width,
          height,
          position: !showMap ? "fixed" : "relative",
          opacity: !showMap ? 0 : 1,
          zIndex: !showMap ? -1 : 1,
        }}
      >
        {/*  <Box
          className="sidebar"
          sx={{
            backgroundColor: "rgba(35, 55, 75, 0.9)",
            color: "#fff",
            padding: "6px 12px",
            fontFamily: "monospace",
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            margin: "12px",
            borderRadius: "4px",
          }}
        >
          Longitude: {Math.round(localLng * 100000) / 100000} | Latitude:
          {Math.round(localLat * 100000) / 100000} | Zoom: {zoom}
        </Box> */}

        <Box
          ref={mapContainer}
          className="map-container"
          /* onMapClick={(f) => f} */
          sx={{
            width,
            height,
            borderRadius: "1rem",
          }}
        />
      </Box>
    </Box>
  );
};

Map.defaultProps = {
  width: "100%",
  height: "500px",
  point: [],
  points: [],
  lng: -79.98476050000002,
  lat: 21.801503428305598,
  onMapClick: undefined,
  onChange: undefined,
  onChangeLng: undefined,
  onChangeLat: undefined,
  noButton: false,
  noGeocoder: false,
  noInputs: false,
};

Map.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  point: PropTypes.array,
  points: PropTypes.array,
  onMapClick: PropTypes.func,
  lng: PropTypes.number,
  lat: PropTypes.number,
  onChange: PropTypes.func,
  onChangeLng: PropTypes.func,
  onChangeLat: PropTypes.func,
  noButton: PropTypes.bool,
  noGeocoder: PropTypes.bool,
  noInputs: PropTypes.bool,
};

export default Map;
