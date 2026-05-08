/**
 * Deezer Service — Free music previews (no API key needed!)
 * Uses Deezer's public search API to get 30-second preview clips
 */
const axios = require('axios');

const DEEZER_API = 'https://api.deezer.com';

const deezerService = {
  /**
   * Search for a track and return preview URL + cover art
   * @param {string} title - Song title
   * @param {string} artist - Artist name
   * @returns {object|null} Track data with preview_url
   */
  searchTrack: async (title, artist) => {
    try {
      const query = `${title} ${artist}`.trim();
      const response = await axios.get(`${DEEZER_API}/search`, {
        params: { q: query, limit: 1 }
      });

      if (!response.data.data || response.data.data.length === 0) return null;

      const track = response.data.data[0];
      return {
        deezer_id: track.id,
        title: track.title,
        artist: track.artist?.name,
        album: track.album?.title,
        preview_url: track.preview, // 30-second MP3 preview!
        cover_art: {
          large: track.album?.cover_xl || track.album?.cover_big,   // 1000x1000 or 500x500
          medium: track.album?.cover_medium,                         // 250x250
          small: track.album?.cover_small,                          // 56x56
        },
        duration: track.duration,
        deezer_url: track.link,
      };
    } catch (err) {
      console.error(`❌ Deezer search failed for "${title}":`, err.message);
      return null;
    }
  }
};

module.exports = deezerService;
