# Dynamic Badge Formatter

[![stars](https://custom-icon-badges.herokuapp.com/github/stars/DenverCoder1/dynamic-badge-formatter?logo=star)](https://github.com/DenverCoder1/dynamic-badge-formatter/stargazers "stars") [![issues](https://custom-icon-badges.herokuapp.com/github/issues-raw/DenverCoder1/dynamic-badge-formatter?logo=issue)](https://github.com/DenverCoder1/dynamic-badge-formatter/issues "issues") [![license](https://custom-icon-badges.herokuapp.com/github/license/DenverCoder1/dynamic-badge-formatter?logo=law&logoColor=white)](https://github.com/DenverCoder1/dynamic-badge-formatter/blob/main/LICENSE?rgh-link-date=2021-08-09T18%3A10%3A26Z "license MIT") [![discord](https://custom-icon-badges.herokuapp.com/discord/819650821314052106?color=7289DA&logo=comments&label=discord&logoColor=white)](https://discord.gg/fPrdqh3Zfu "Dev Pro Tips Discussion & Support Server")

Format [Shields Dynamic Badges](https://shields.io/#dynamic-badge) to look consistent using formatters for metrics, versions, stars and more.

Dynamic Badge Formatter works alongside [shields.io](https://shields.io/) using [Endpoint Badges](https://shields.io/endpoint) with a [Runkit Endpoint](https://runkit.com/denvercoder1/dynamic-badge-formatter).

## ⚡ How to use

The easiest way to get started is to [try out the demo site](https://denvercoder1.github.io/dynamic-badge-formatter/)!

[![demo site](https://user-images.githubusercontent.com/20955511/173765971-5295e75b-effc-4e91-919a-5a874336182a.png)](https://denvercoder1.github.io/dynamic-badge-formatter/)

### Advanced steps

1. Choose a JSON, XML, or YAML data URL to extract data from.

2. Create a query using a [JSONPath](https://jsonpath.com/) (for JSON or YAML) or [XPath](http://xpather.com/) (for XML) expression.

3. Set the `url` and `query` parameters at the endpoint <https://dynamic-badge-formatter-ynrxn78r2oye.runkit.sh/json>, using `/json` for JSON, `/xml` for XML, and `/yaml` for YAML.

4. Set additional customizations as query parameters, such as the `color`, `label`, `labelColor`, `logo`, etc., and specify a `formatter` to use (see below).

5. URL Encode the new endpoint URL and append it after `https://img.shields.io/endpoint?url=`. You can also do this by [pasting the URL](https://user-images.githubusercontent.com/20955511/173730516-1470689e-0e05-4761-89f4-4aa7d8fcb023.png) at [shields.io/endpoint](https://shields.io/endpoint).

### Example

The following is a JSON API I want to use for displaying data. I want to display the stars but formatted as a metric (eg. `"3.2k"` instead of `"3227"`). To extract the star count from the JSON, I will use the query `$.stars`.

```jsonc
// https://api.github-star-counter.workers.dev/user/DenverCoder1
{
  "stars": 3227,
  "forks": 1207
}
```

To create the Runkit URL, pass the `query`, `url`, and additional parameters to the endpoint. In this example, I set `formatter` to `metric`, `label` to `stars`, `color` to `green`, and `logo` to `github`.

```
https://dynamic-badge-formatter-ynrxn78r2oye.runkit.sh/json?query=$.stars&url=https://api.github-star-counter.workers.dev/user/DenverCoder1&formatter=metric&label=stars&color=green&logo=github
```

Using the customizer at <https://shields.io/endpoint>, I can turn this endpoint into a badge.

```
https://img.shields.io/endpoint?url=https%3A%2F%2Fdynamic-badge-formatter-ynrxn78r2oye.runkit.sh%2Fjson%3Fquery%3D%24.stars%26url%3Dhttps%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2FDenverCoder1%26formatter%3Dmetric%26label%3Dstars%26color%3Dgreen%26logo%3Dgithub
```

Result:

![preview](https://img.shields.io/endpoint?url=https%3A%2F%2Fdynamic-badge-formatter-ynrxn78r2oye.runkit.sh%2Fjson%3Fquery%3D%24.stars%26url%3Dhttps%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2FDenverCoder1%26formatter%3Dmetric%26label%3Dstars%26color%3Dgreen%26logo%3Dgithub)

## ⚡ Formatters

The following values are supported for the `formatter` parameter:

| Formatter            | Description                                                                           | Example                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `metric`             | Formats a number as a short metric (eg. `3.4k`, `12.3M`)                              | ![before](https://img.shields.io/badge/before-3400-cc6060)<br/>![after](https://img.shields.io/badge/after-3.4k-2ea44f)                   |
| `starRating`         | Formats a number as stars (eg. `★★★★½`)                                               | ![before](https://img.shields.io/badge/before-4.5-cc6060)<br/>![after](https://img.shields.io/badge/after-★★★★½-2ea44f)                   |
| `ordinalNumber`      | Formats a number with an ordinal suffix (eg. `9ᵗʰ`)                                   | ![before](https://img.shields.io/badge/before-9-cc6060)<br/>![after](https://img.shields.io/badge/after-9ᵗʰ-2ea44f)                       |
| `omitv`              | Removes a `v` as a prefix from a version number (eg. `v1.2.3` becomes `1.2.3`)        | ![before](https://img.shields.io/badge/before-v1.2.3-cc6060)<br/>![after](https://img.shields.io/badge/after-1.2.3-2ea44f)                |
| `addv`               | Adds a `v` as a prefix from a version number (eg. `1.2.3` becomes `v1.2.3`)           | ![before](https://img.shields.io/badge/before-1.2.3-cc6060)<br/>![after](https://img.shields.io/badge/after-v1.2.3-2ea44f)                |
| `formatDate`         | Formats dates as a month and year, "today" or "yesterday" can appear for recent dates | ![before](https://img.shields.io/badge/before-2019--01--01-cc6060)<br/>![after](https://img.shields.io/badge/after-january%202019-2ea44f) |
| `formatRelativeDate` | Formats a UNIX Timestamp in seconds as a relative time (eg. `3 days ago`)             | ![before](https://img.shields.io/badge/before-1655162563-cc6060)<br/>![after](https://img.shields.io/badge/after-3%20days%20ago-2ea44f)   |

## ⚙️ Other Parameters

| Parameter      | Type      | Description                                                                                        |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `url`          | `string`  | `required` The JSON, XML, or YAML data URL to fetch a message value from                           |
| `query`        | `string`  | `required` The JSONPath or XPath query for extracting a field for the value                        |
| `label`        | `string`  | `optional` The label to use for the badge, default: "custom badge"                                 |
| `color`        | `string`  | `optional` The color to use for the badge, default: "blue"                                         |
| `labelColor`   | `string`  | `optional` The color to use for the label, default: "grey"                                         |
| `isError`      | `boolean` | `optional` If true, the badge color is overriden to be red, default: false                         |
| `logo`         | `string`  | `optional` A named logo to use from Simple Icons or base64 encoded SVG, default: none              |
| `namedLogo`    | `string`  | `optional` The name of a logo to use from Simple Icons, overrides `logo`, default: none            |
| `logoSvg`      | `string`  | `optional` The base64 encoded SVG content of a logo to use, overrides `logo`, default: none        |
| `logoColor`    | `string`  | `optional` The color to use for the logo, default: none                                            |
| `logoWidth`    | `number`  | `optional` The width of the logo, default: none                                                    |
| `logoPosition` | `number`  | `optional` The position offset of the logo, default: none                                          |
| `style`        | `string`  | `optional` The badge style (plastic, flat, flat-square, for-the-badge, or social), default: "flat" |
| `cacheSeconds` | `number`  | `optional` The number of seconds to cache the response, default: 300                               |
| `prefix`       | `string`  | `optional` A prefix to use before the message, default: none                                       |
| `suffix`       | `string`  | `optional` A suffix to use after the message, default: none                                        |
| `formatter`    | `string`  | `optional` The name of a formatter to use on the message (see options above), default: none        |

## 🤗 Contributing

We welcome contributions!

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📤 Deploying it on your own

<details>
  <summary>Deploy to Runkit</summary>

1. Sign in to **Runkit** or create a new account at <https://runkit.com>
2. Create a new notebook
3. Paste the contents of [`index.js`](./index.js) into the notebook
4. Click `endpoint` to get your endpoint to run requests against

</details>

## 💬 Questions?

Feel free to [open an issue](http://github.com/DenverCoder1/dynamic-badge-formatter/issues/new).

## ❤️ Thanks

- [Shields.io](https://github.com/badges/shields) for all the great work they have done with creating tools for creating Dynamic and Endpoint Badges

## 📚 License

This project is licensed under the [MIT license](LICENSE.md).

Some formatters make use of code written for [shields.io](https://shields.io/) in the [public domain](https://github.com/badges/shields/blob/master/LICENSE).

## 🤩 Support

💙 If you like this project, give it a ⭐ and share it with friends!

<p align="left">
  <a href="https://www.youtube.com/channel/UCipSxT7a3rn81vGLw9lqRkg?sub_confirmation=1"><img alt="Youtube" title="Youtube" src="https://custom-icon-badges.herokuapp.com/badge/-Subscribe-red?style=for-the-badge&logo=video&logoColor=white"/></a>
  <a href="https://github.com/sponsors/DenverCoder1"><img alt="Sponsor with Github" title="Sponsor with Github" src="https://custom-icon-badges.herokuapp.com/badge/-Sponsor-ea4aaa?style=for-the-badge&logo=heart&logoColor=white"/></a>
</p>

[☕ Buy me a coffee](https://ko-fi.com/jlawrence)
