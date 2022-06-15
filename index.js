const axios = require("axios");
const express = require("@runkit/runkit/express-endpoint/1.0.0");
const moment = require("moment");

const app = express(exports);

/**
 * This object contains text formatters adapted from shields.io, a project in the public domain.
 * @see https://github.com/badges/shields/blob/master/services/text-formatters.js
 */
const formatters = {
  starRating(rating, max = 5) {
    const flooredRating = Math.floor(rating);
    let stars = "";
    while (stars.length < flooredRating) {
      stars += "★";
    }
    const decimal = rating - flooredRating;
    if (decimal >= 0.875) {
      stars += "★";
    } else if (decimal >= 0.625) {
      stars += "¾";
    } else if (decimal >= 0.375) {
      stars += "½";
    } else if (decimal >= 0.125) {
      stars += "¼";
    }

    while (stars.length < max) {
      stars += "☆";
    }
    return stars;
  },

  ordinalNumber(n) {
    const s = ["ᵗʰ", "ˢᵗ", "ⁿᵈ", "ʳᵈ"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },

  // Given a number (positive or negative), string with appropriate unit in the metric system, SI.
  // Note: numbers beyond the peta- cannot be represented as integers in JS.
  metric(n) {
    const metricPrefix = ["k", "M", "G", "T", "P", "E", "Z", "Y"];
    const metricPower = metricPrefix.map((a, i) => Math.pow(1000, i + 1));
    for (let i = metricPrefix.length - 1; i >= 0; i--) {
      const limit = metricPower[i];
      const absN = Math.abs(n);
      if (absN >= limit) {
        const scaledN = absN / limit;
        if (scaledN < 10) {
          // For "small" numbers, display one decimal digit unless it is 0.
          const oneDecimalN = scaledN.toFixed(1);
          if (oneDecimalN.charAt(oneDecimalN.length - 1) !== "0") {
            const res = `${oneDecimalN}${metricPrefix[i]}`;
            return n > 0 ? res : `-${res}`;
          }
        }
        const roundedN = Math.round(scaledN);
        if (roundedN < 1000) {
          const res = `${roundedN}${metricPrefix[i]}`;
          return n > 0 ? res : `-${res}`;
        } else {
          const res = `1${metricPrefix[i + 1]}`;
          return n > 0 ? res : `-${res}`;
        }
      }
    }
    return `${n}`;
  },

  // Remove the starting v in a string.
  omitv(version) {
    if (version.charCodeAt(0) === 118) {
      return version.slice(1);
    }
    return version;
  },

  // Add a starting v to the version unless:
  // - it does not start with a digit
  // - it is a date (yyyy-mm-dd)
  addv(version) {
    const ignoredVersionPatterns = /^[^0-9]|[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    version = `${version}`;
    if (version.startsWith("v") || ignoredVersionPatterns.test(version)) {
      return version;
    } else {
      return `v${version}`;
    }
  },

  maybePluralize(singular, countable, plural) {
    plural = plural || `${singular}s`;

    if (countable && countable.length === 1) {
      return singular;
    } else {
      return plural;
    }
  },

  formatDate(d) {
    const date = moment(d);
    const dateString = date.calendar(null, {
      lastDay: "[yesterday]",
      sameDay: "[today]",
      lastWeek: "[last] dddd",
      sameElse: "MMMM YYYY",
    });
    // Trim current year from date string
    return dateString.replace(` ${moment().year()}`, "").toLowerCase();
  },

  formatRelativeDate(timestamp) {
    return moment()
      .to(moment.unix(parseInt(timestamp, 10)))
      .toLowerCase();
  },
};

/**
 * Schema for shields.io endpoint badge content
 */
const contentSchema = [
  "schemaVersion", // number, required, must be 1
  "label", // string, required
  "message", // string, required
  "color", // string, default: "blue"
  "labelColor", // string, default: "grey"
  "isError", // boolean, default: false
  "namedLogo", // string,
  "logoSvg", // string,
  "logoColor", // string,
  "logoWidth", // number,
  "logoPosition", // number,
  "style", // string, default: "flat"
  "cacheSeconds", // number, default: 300
];

/**
 * Default route for creating the content for the shields.io endpoint
 *
 * Path parameters:
 * - dataType: string, optional, one of "json", "xml", or "yaml", default: "json"
 *
 * Query parameters:
 * - url: string, required, the JSON, XML, or YML URL to fetch a value from
 * - query: string, required, the JSON query for extracting a field for the value
 * - label: string, optional, the label to use for the badge, default: "custom badge"
 * - color: string, optional, the color to use for the badge, default: "blue"
 * - labelColor: string, optional, the color to use for the label, default: "grey"
 * - isError: boolean, optional, if true, the badge color is overriden to be red, default: false
 * - namedLogo: string, optional, the name of a logo to use from Simple Icons, default: none
 * - logoSvg: string, optional, the base64 encoded SVG content of a logo to use, default: none
 * - logo: string, optional, a named logo or a base64 encoded SVG content of a logo to use, overidden by namedLogo or logoSvg, default: none
 * - logoColor: string, optional, the color to use for the logo, default: none
 * - logoWidth: number, optional, the width of the logo, default: none
 * - logoPosition: number, optional, the position offset of the logo, default: none
 * - style: string, optional, the style of the badge (plastic, flat, flat-square, for-the-badge, or social), default: "flat"
 * - cacheSeconds: number, optional, the number of seconds to cache the response, default: 300
 * - prefix: string, optional, a prefix to use before the message, default: none
 * - suffix: string, optional, a suffix to use after the message, default: none
 * - formatter: string, optional, the name of a formatter to use on the message, default: none
 */
app.get("/:dataType?", async (req, res) => {
  try {
    const dataType = req.params.dataType || "json";
    if (!["json", "xml", "yaml"].includes(dataType)) {
      throw new Error(`dataType must be json, xml, or yaml`);
    }

    const { query, url } = req.query;

    const baseUrl = `https://img.shields.io/badge/dynamic/${dataType}.json`;

    const result = await axios.get(`${baseUrl}?${new URLSearchParams({ query, url })}`);

    // get returned data and override with any query string parameters
    const merged = { ...result.data, ...req.query };

    // if logo is set, use it as a default for namedLogo/logoSvg depending on its content
    if (/^data:/.test(merged.logo)) {
      merged.logoSvg = merged.logoSvg || merged.logo;
    } else if (merged.logo) {
      merged.namedLogo = merged.namedLogo || merged.logo;
    }

    // format the badge message
    if (merged.formatter in formatters) {
      merged.message = formatters[merged.formatter](merged.message);
    }

    // add the prefix and suffix if they are set
    const prefix = req.query.prefix || "";
    const suffix = req.query.suffix || "";
    merged.message = `${prefix}${merged.message}${suffix}`;

    const content = { schemaVersion: 1 };
    contentSchema.forEach((key) => {
      if (typeof merged[key] === "string") {
        content[key] = merged[key];
      }
    });
    res.json(content);
  } catch (e) {
    res.json({
      schemaVersion: 1,
      label: "error",
      message: e.message,
      isError: true,
    });
  }
});
