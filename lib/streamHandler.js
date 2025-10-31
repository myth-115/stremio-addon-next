import PQueue from "p-queue";
import {
  setIdsCache,
  setRecommendationsCache,
  getIdsCache,
  getRecommendationsCache,
  getAllIdsCache,
} from "./cache.js";
import {
  getImdbIdFromApi,
  getRecommendationsFromApi,
  getTmdbIdFromApi,
} from "./tmdb.js";
import { fetchByImdbId, fetchTmdbIds, insertOne } from "./tmdbIdMapper.js";
import { INTERVAL, MAX_CONCURRENCY, MAX_INTERVAL_CAP } from "./constants.js";
import { getStream } from "./utils.js";

const tmdbQueue = new PQueue({
  concurrency: MAX_CONCURRENCY,
  intervalCap: MAX_INTERVAL_CAP,
  interval: INTERVAL,
});

async function getImdbId(tmdbId, type) {
  const imdbId = await getImdbIdFromApi(tmdbId, type);

  if (imdbId) {
    setIdsCache(tmdbId, imdbId);
    await insertOne(tmdbId, imdbId, type);

    return { id: tmdbId, imdbId: imdbId };
  }

  return null;
}

async function getRecommendations(tmdbId, type) {
//   console.time("Recommendations");
  const recommendations = await tmdbQueue.add(() =>
    getRecommendationsFromApi(tmdbId, type)
  );
//   console.timeEnd("Recommendations");

  const tmdbIds = recommendations.map((rec) => rec.id);
  const cacheMap = {};
  let missingIds = [];

  for (const tmdbId of tmdbIds) {
    const imdbId = getIdsCache(tmdbId);
    if (imdbId) cacheMap[tmdbId] = imdbId;
    else missingIds.push(tmdbId);
  }

//   console.log("Missing after caching " + missingIds.length);

  if (missingIds.length) {
    const fetchedTmdbIds = await fetchTmdbIds(missingIds);

    for (const id of fetchedTmdbIds) {
      cacheMap[id._id] = id.imdbId;
      setIdsCache(id._id, id.imdbId);
    }

    missingIds = missingIds.filter((id) => !cacheMap[id]);
  }

//   console.log("Missing after DB call " + missingIds.length);

  if (missingIds.length) {
    // console.time("External");
    const fetched = await Promise.all(
      missingIds.map((id) => tmdbQueue.add(() => getImdbId(id, type)))
    );
    // console.timeEnd("External");
    fetched.filter(Boolean).forEach((res) => (cacheMap[res.id] = res.imdbId));
  }

  const recStreams = recommendations
    .map((rec) => {
      const imdb = cacheMap[rec.id];
      if (!imdb) return null;
      return getStream(rec, type, imdb);
    })
    .filter(Boolean);

  return recStreams;
}

async function getTmdbId(imdbId, type) {
  for (const [tmdbId, cachedImdb] of getAllIdsCache()) {
    if (String(cachedImdb) === String(imdbId)) {
    //   console.log("Initial Cached Acquired");
      return tmdbId;
    }
  }

  const fetchedTmdbId = await fetchByImdbId(imdbId);
  if (fetchedTmdbId) {
    setIdsCache(fetchedTmdbId.tmdbId, imdbId);
    return fetchedTmdbId.tmdbId;
  }

//   console.time("Get TMDB Id");
  const tmdbIdFromApi = await tmdbQueue.add(() =>
    getTmdbIdFromApi(imdbId, type)
  );
//   console.timeEnd("Get TMDB Id");

  setIdsCache(tmdbIdFromApi, imdbId);
  await insertOne(tmdbIdFromApi, imdbId, type);
  return String(tmdbIdFromApi);
}

export async function handleStream(imdbId, type) {
  const cachedRecommendation = getRecommendationsCache(imdbId);
  if (cachedRecommendation) {
    // console.log("Cached Stream Result Acquired.");
    return cachedRecommendation;
  }
  const tmdbId = await getTmdbId(imdbId, type);
  const recStreams = await getRecommendations(tmdbId, type);
  setRecommendationsCache(imdbId, recStreams);

  return recStreams;
}
