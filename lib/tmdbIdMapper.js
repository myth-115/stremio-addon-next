import mongoose from "mongoose";

const tmdbIdMapperSchema = new mongoose.Schema(
  {
    _id: { type: String, alias: "tmdbId" }, // primary key
    imdbId: { type: String, index: true },
    type: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: true,
  }
);

const TmdbIdMapper = mongoose.model("TMDB_ID_MAPPER", tmdbIdMapperSchema);

export async function insertOne(tmdbId, imdbId, type) {
  try {
    await TmdbIdMapper.collection.insertOne({
      _id: String(tmdbId),
      imdbId,
      type
    });
  } catch (err) {
    if (err.code === 11000) return; // ignore duplicates
    throw err; // other errors should still throw
  }
}

export async function fetchByImdbId(imdbId) {
  return await TmdbIdMapper.findOne({ imdbId });
}

export async function fetchTmdbIds(tmdbids) {
  return await TmdbIdMapper.find(
    { _id: { $in: tmdbids } },
    { imdbId: 1, type: 1 }
  );
}
