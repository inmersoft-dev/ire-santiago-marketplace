import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";
import { createCookie, getCookie } from "../utils/auth";

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendQrCookie = async (menu) => {
  if (getCookie(config.acceptCookie) && !getCookie(config.visitCookie)) {
    const response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}trigger/add`,
      { event: "qr-visit", menu },
      {
        headers: getAuth,
      }
    );
    createCookie(config.viewCookie, 90, true);
    const data = await response.data;
    return data;
  }
};

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendVisitCookie = async (menu) => {
  if (getCookie(config.acceptCookie) && !getCookie(config.visitCookie)) {
    const response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}trigger/add`,
      { event: "visit", menu },
      {
        headers: getAuth,
      }
    );
    createCookie(config.viewCookie, 90, true);
    const data = await response.data;
    return data;
  }
};

/**
 *
 * @param {string} menu
 * @param {string} product
 * @returns
 */
export const sendDescriptionCookie = async (menu, product) => {
  if (
    getCookie(config.acceptCookie) &&
    !getCookie(`${product.id}${getCookie.descriptionCookie}`)
  ) {
    const response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}trigger/add`,
      { event: "see-description", menu, product: product.id },
      {
        headers: getAuth,
      }
    );
    createCookie(`${product.id}${getCookie.descriptionCookie}`, 90, true);
    const data = await response.data;
    return data;
  }
};

/**
 * @returns
 */
export const sendMobileCookie = async () => {
  if (getCookie(config.acceptCookie) && !getCookie(config.viewCookie)) {
    const response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}trigger/general-add`,
      { event: "view", from: "mobile" },
      {
        headers: getAuth,
      }
    );
    createCookie(config.viewCookie, 90, true);
    const data = await response.data;
    return data;
  }
};

/**
 * @returns
 */
export const sendPcCookie = async () => {
  if (getCookie(config.acceptCookie) && !getCookie(config.viewCookie)) {
    const response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}trigger/general-add`,
      { event: "view", from: "pc" },
      {
        headers: getAuth,
      }
    );
    createCookie(config.viewCookie, 90, true);
    const data = await response.data;
    return data;
  }
};
