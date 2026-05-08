/**
 * iTunes Service — Free 30-second music previews (works globally, no API key!)
 * Uses Apple's iTunes Search API
 */
const axios = require('axios');

const ITUNES_API = 'https://itunes.apple.com/search';

const itunesService = {
  /**
   * Search for a track and return preview URL + cover art
   * @param {string} title - Song title
   * @param {string} artist - Artist name
   * @returns {object|null} Track data with preview_url
   */
  searchTrack: async (title, artist) => {
    try {
      const term = `${title} ${artist}`.trim();
      const response = await axios.get(ITUNES_API, {
        params: {
          term,
          media: 'music',
          entity: 'song',
          limit: 1,
        }
      });

      if (!response.data.results || response.data.results.length === 0) return null;

      const track = response.data.results[0];
      // Get high-res artwork by replacing 100x100 with larger size
      const coverLarge = track.artworkUrl100?.replace('100x100bb', '600x600bb');
      
      return {
        itunes_id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        preview_url: track.previewUrl, // 30-second AAC preview!
        itunes_url: track.trackViewUrl,
        cover_art: {
          large: coverLarge,
          medium: track.artworkUrl100,
          small: track.artworkUrl60 || track.artworkUrl100?.replace('100x100bb', '60x60bb'),
        },
        duration_ms: track.trackTimeMillis,
        genre: track.primaryGenreName,
      };
    } catch (err) {
      console.error(`❌ iTunes search failed for "${title}":`, err.message);
      return null;
    }
  }
};

module.exports = itunesService;
