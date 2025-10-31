import { LRUCache } from "lru-cache";

const TMDB_TO_IMDB_SIZE = 100000;
const IMDB_TO_RECOMMENDATION_SIZE = 2000;
const IMDB_TO_RECOMMENDATION_TTL = 1000 * 60 * 60 * 24; // 1 day

const tmdbIDToImdbIdCache = new LRUCache({
  max: TMDB_TO_IMDB_SIZE,
});

const imdbIdToRecommendationCache = new LRUCache({
  max: IMDB_TO_RECOMMENDATION_SIZE,
  ttl: IMDB_TO_RECOMMENDATION_TTL,
});

export function setIdsCache(key, value) {
  tmdbIDToImdbIdCache.set(String(key), String(value));
}

export function getIdsCache(key) {
  return tmdbIDToImdbIdCache.get(String(key));
}

export function getAllIdsCache() {
  const ids = Array.from(tmdbIDToImdbIdCache.entries());
  return ids;
}

export function setRecommendationsCache(key, value) {
  imdbIdToRecommendationCache.set(String(key), value);
}

export function getRecommendationsCache(key) {
  return imdbIdToRecommendationCache.get(String(key));
}