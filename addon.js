import dotenv from "dotenv";
dotenv.config();
import { addonBuilder } from "stremio-addon-sdk";
import mongoose from "mongoose";
import { handleStream } from "./lib/streamHandler.js";

const CACHE_MAX_AGE = 24 * 60 * 60; // 1 day
const STALE_REVALIDATE_AGE = 12 * 60 * 60; // 12 hours
const STALE_ERROR_AGE = 7 * 24 * 60 * 60; // 1 week

const MONGO_URI = process.env.MONGO_URI || "";
try {
  await mongoose.connect(process.env.MONGO_URI, {
    minPoolSize: 10,
    maxPoolSize: 50,
  });
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error: ", err);
}

const manifest = {
  id: "community.watch.next",
  version: "0.0.1",
  catalogs: [],
  resources: ["stream"],
  types: ["movie", "series"],
  name: "Watch Next",
  description:
    "Shows similar movies and series right below what you’re currently watching using TMDb recommendations.",
  idPrefixes: ["tt"],
  logo: "https://myth-115.github.io/Dummy1/logo.png",
};
const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    // console.time("Total Time");
    const imdbId = id.split(":")[0];
    const streams = await handleStream(imdbId, type);
    // console.timeEnd("Total Time");
    return Promise.resolve({
      streams,
      cacheMaxAge: CACHE_MAX_AGE,
      staleRevalidate: STALE_REVALIDATE_AGE,
      staleError: STALE_ERROR_AGE,
    });
  } catch (err) {
    // console.timeEnd("Total Time");
    console.error("Stream Handler error: ", err);
    return Promise.resolve({ streams: [] });
  }
});

export default builder.getInterface();
