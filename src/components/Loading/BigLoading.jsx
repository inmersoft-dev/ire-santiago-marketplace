/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-undef */
import { useEffect, useState } from "react";
// prop-types
import PropTypes from "prop-types";

// images
import logo from "../../assets/images/logo.jpg";

import "./style.css";

const BigLoading = (props) => {
  const { visible } = props;

  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 100);
  }, []);

  return (
    <div
      id="contenedor_carga"
      style={{
        marginTop: "100px",
        opacity: visible ? 1 : 0,
        zIndex: visible ? 99 : -1,
      }}
    >
      <div className="logo-entrance">
        <div className="logo-container">
          <img className="image" src={logo} alt="logo trinidad" />
        </div>
      </div>

      {active ? (
        <div className="bar-entrance progress_bar">
          <div className="bar_h" />
        </div>
      ) : null}
    </div>
  );
};

BigLoading.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default BigLoading;
