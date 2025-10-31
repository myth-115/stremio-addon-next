#!/usr/bin/env node

import pkg from "stremio-addon-sdk";
const { serveHTTP } = pkg;
import addonInterface from "./addon.js";
serveHTTP(addonInterface, { port: process.env.PORT || 63621 });

// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
