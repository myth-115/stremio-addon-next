import needle from "needle";
import { MediaType } from "./constants.js";
import { getTmdbType } from "./utils.js";

const API_BASE_URL = "https://api.themoviedb.org/3/";
const RECOMMENDATIONS =
  "https://api.themoviedb.org/3/movie/{movie_id}/recommendations";

const GET_TMDB_ID = "Get Imdb Id";
const GET_RECOMMENDATION = "Get Recommendation";

function getOptions() {
  const AUTHORIZATION_KEY = "Bearer " + process.env.TMDB_KEY;

  return {
    headers: {
      accept: "application/json",
      Authorization: AUTHORIZATION_KEY,
    },
  };
}

export async function getTmdbIdFromApi(imdbId, type) {
  try {
    const url = `${API_BASE_URL}find/${imdbId}?external_source=imdb_id`;

    const res = await needle("get", url, null, getOptions());

    if (res.statusCode >= 400) {
      throw new Error(`TMDB Find api error: ${res.statusCode}`);
    }

    const { movie_results = [], tv_results = [] } = res.body;
    if (movie_results.length === 0 && tv_results.length === 0) {
      throw new Error(`No TMDB results found for IMDb ID: ${imdbId}`);
    }

    if (type === MediaType.MOVIE) {
      const movie = movie_results[0];
      if (!movie?.id)
        throw new Error(`No TMDB movie ID found for IMDb ID: ${imdbId}`);
      return movie.id;
    } else {
      const tv = tv_results[0];
      if (!tv?.id)
        throw new Error(`No TMDB TV ID found for IMDb ID: ${imdbId}`);
      return tv.id;
    }
  } catch (err) {
    console.error(
      `Error fetching TMDB data with imdbId: ${imdbId}:`,
      err.message
    );
    throw err;
  }
}

export async function getRecommendationsFromApi(tmdbId, type) {
  try {
    const url = `${API_BASE_URL}${getTmdbType(type)}/${tmdbId}/recommendations`;

    const res = await needle("get", url, null, getOptions());

    if (res.statusCode >= 400) {
      throw new Error(`TMDB Recommendation api error: ${res.statusCode}`);
    }

    const results = res.body?.results ?? [];

    const returnValue = results.slice(0, 10).map((rec) => ({
      id: String(rec.id),
      title: type === MediaType.MOVIE ? rec.title : rec.name,
      releaseDate:
        type === MediaType.MOVIE ? rec.release_date : rec.first_air_date,
      voteCount: rec.vote_count,
      rating: rec.vote_average,
      genreIds: rec.genre_ids,
      popularity: rec.popularity,
      overview: rec.overview,
    }));

    return returnValue;
  } catch (err) {
    console.error(
      `Error fetching TMDB recommendation with tmdbId: ${tmdbId} and type: ${type}`,
      err.message
    );
    throw err;
  }
}

export async function getImdbIdFromApi(tmdbId, type) {
  try {
    const url = `${API_BASE_URL}${getTmdbType(type)}/${tmdbId}/external_ids`;

    const res = await needle("get", url, null, getOptions());

    if (res.statusCode >= 400) {
      throw new Error(`TMDB External Ids api error: ${res.statusCode}`);
    }

    return res.body?.imdb_id || null;
  } catch (err) {
    console.error(
      `Error fetching External Id with tmdbId: ${tmdbId} and type: ${type}`,
      err.message
    );
    throw err;
  }
}
