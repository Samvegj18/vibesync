/**
 * Spotify Service — Handles Spotify API authentication & track search
 * Uses Client Credentials flow (no user login needed)
 */
const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyService {
  constructor() {
    this.api = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    this.tokenExpiry = 0;
  }

  /**
   * Authenticate using Client Credentials flow
   * Auto-refreshes token when expired
   */
  async authenticate() {
    if (Date.now() < this.tokenExpiry) return; // token still valid

    try {
      const data = await this.api.clientCredentialsGrant();
      this.api.setAccessToken(data.body.access_token);
      // Set expiry 5 minutes early to be safe
      this.tokenExpiry = Date.now() + (data.body.expires_in - 300) * 1000;
      console.log('✅ Spotify API authenticated');
    } catch (err) {
      console.error('❌ Spotify auth failed:', err.message);
      throw new Error('Spotify authentication failed');
    }
  }

  /**
   * Search for a track and return its details with preview URL
   * @param {string} title - Song title
   * @param {string} artist - Artist name
   * @returns {object} Track data including preview_url, album art, spotify_url
   */
  async searchTrack(title, artist) {
    await this.authenticate();

    try {
      const query = `track:${title} artist:${artist}`;
      const result = await this.api.searchTracks(query, { limit: 1 });

      if (result.body.tracks.items.length === 0) {
        // Fallback: simpler search
        const fallback = await this.api.searchTracks(`${title} ${artist}`, { limit: 1 });
        if (fallback.body.tracks.items.length === 0) return null;
        return this._formatTrack(fallback.body.tracks.items[0]);
      }

      return this._formatTrack(result.body.tracks.items[0]);
    } catch (err) {
      console.error(`❌ Spotify search failed for "${title}":`, err.message);
      return null;
    }
  }

  /**
   * Get multiple tracks by searching each one
   * @param {Array} songs - Array of {title, artist_name} objects
   * @returns {Array} Track data with preview URLs
   */
  async searchMultiple(songs) {
    await this.authenticate();
    const results = [];

    for (const song of songs) {
      const track = await this.searchTrack(song.title, song.artist_name);
      results.push({
        song_id: song.song_id,
        title: song.title,
        artist_name: song.artist_name,
        spotify: track
      });
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    }

    return results;
  }

  /**
   * Format a Spotify track object to our needs
   */
  _formatTrack(track) {
    return {
      spotify_id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url, // 30-second preview MP3
      spotify_url: track.external_urls.spotify,
      cover_art: {
        large: track.album.images[0]?.url,   // 640x640
        medium: track.album.images[1]?.url,   // 300x300
        small: track.album.images[2]?.url,    // 64x64
      },
      duration_ms: track.duration_ms,
      popularity: track.popularity,
    };
  }
}

module.exports = new SpotifyService();
