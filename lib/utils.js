import { MediaType, TMDB_MEDIA_TYPE } from "./constants.js";
import { getGenreEmoji, getMovieGenre, getTvGenre } from "./genre.js";

export function getTmdbType(type) {
  return MediaType.MOVIE === type ? TMDB_MEDIA_TYPE.MOVIE : TMDB_MEDIA_TYPE.TV;
}

function getPopularityEmoji(popularity) {
  if (popularity == null) return "✨";
  if (popularity <= 10) return "💤";
  if (popularity <= 50) return "⚡";
  if (popularity <= 200) return "🔥";
  if (popularity <= 500) return "💥";
  return "🚀";
}

export function getStream(recommendation, type, imdbId) {
  const genreIds = recommendation.genreIds || [];
  const genreNames = genreIds
    .map((id) =>
      type === MediaType.MOVIE ? getMovieGenre(id) : getTvGenre(id)
    )
    .filter(Boolean);

  const genreWithEmoji = genreNames
    .map((g) => `${g} ${getGenreEmoji(g) || ""}`)
    .join(" | ");

  const overview = recommendation.overview
    ? recommendation.overview.slice(0, 100) +
      (recommendation.overview.length > 100 ? "…" : "")
    : "";

  const popularityEmoji = getPopularityEmoji(Number(recommendation.popularity));

  const description = `
📆 Release: ${recommendation.releaseDate || "N/A"}
🌟 Rating: ${recommendation.rating?.toFixed(2) ?? "N/A"} / 10 ✨ (${
    recommendation.voteCount ?? 0
  } votes)
🎬 Genre: ${genreWithEmoji || "N/A"}
📈 Popularity: ${
    recommendation.popularity?.toFixed(2) ?? "N/A"
  } ${popularityEmoji}

📖 Overview:
${overview}
`.trim();

  return {
    name: recommendation.title,
    description: description,
    externalUrl: `stremio:///detail/${type}/${imdbId}`,
  };
}
