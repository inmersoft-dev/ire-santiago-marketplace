import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendQrCookie = async (menu) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}trigger/add`,
    { event: "qr-visit", menu },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendVisitCookie = async (menu) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}trigger/add`,
    { event: "visit", menu },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string} menu
 * @param {string} product
 * @returns
 */
export const sendDescriptionCookie = async (menu, product) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}trigger/add`,
    { event: "see-description", menu, product: product.id },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 * @returns
 */
export const sendMobileCookie = async () => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}trigger/general-add`,
    { event: "view", from: "mobile" },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 * @returns
 */
export const sendPcCookie = async () => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}trigger/general-add`,
    { event: "view", from: "pc" },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};
