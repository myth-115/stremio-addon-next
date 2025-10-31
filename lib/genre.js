// Movie genre map
const MOVIE_GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// TV genre map
const TV_GENRE_MAP = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

const GENRE_EMOJI_MAP = {
  Action: "💥",
  Adventure: "🗺️",
  Animation: "🎨",
  Comedy: "😂",
  Crime: "🕵️",
  Documentary: "📚",
  Drama: "🎭",
  Family: "👪",
  Fantasy: "🧙",
  History: "🏰",
  Horror: "👻",
  Music: "🎵",
  Mystery: "🕵️‍♂️",
  Romance: "❤️",
  "Science Fiction": "👽",
  Thriller: "🔪",
  War: "⚔️",
  Western: "🤠",
  "TV Movie": "📺",
  "Action & Adventure": "💥🗺️",
  Soap: "🧼",
  Reality: "🎬",
  News: "📰",
  Talk: "🎤",
  Kids: "🧸",
  "Sci-Fi & Fantasy": "👽🧙",
};

export function getMovieGenre(id) {
  return MOVIE_GENRE_MAP[Number(id)] || null;
}

export function getTvGenre(id) {
  return TV_GENRE_MAP[Number(id)] || null;
}

export function getGenreEmoji(genre) {
  return GENRE_EMOJI_MAP[String(genre)] || null;
}
