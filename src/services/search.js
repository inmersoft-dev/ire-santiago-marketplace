/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// some-javascript-utils
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

/**
 *
 * @param {string} text
 * @param {string[]} models
 * @param {string} attribute
 * @param {number} page
 * @param {number} count
 * @returns
 */
export const search = async (
  text,
  models,
  attribute = "",
  page = 1,
  count = 10
) => {
  const response = await axios.post(
    `${config.apiUrl}search`,
    { text, models, attribute, page, count, lang: getUserLanguage() },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string[]} ids
 * @param {string} models
 * @returns
 */
export const searchIds = async (ids, models) => {
  const response = await axios.post(
    `${config.apiUrl}search/array-ids`,
    { ids, models },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
