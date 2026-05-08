/**
 * Spotify Controller — API endpoints for music integration
 * Uses Spotify for metadata + cover art, Deezer for audio previews
 */
const spotifyService = require('../services/spotifyService');
const deezerService = require('../services/itunesService');
const db = require('../config/db');

const spotifyController = {
  /**
   * GET /api/spotify/search?title=...&artist=...
   * Search for a track and return preview URL + cover art
   */
  searchTrack: async (req, res) => {
    try {
      const { title, artist } = req.query;
      if (!title) return res.status(400).json({ message: 'Title is required' });

      // Try Deezer first for preview (always available)
      const deezerTrack = await deezerService.searchTrack(title, artist || '');
      if (deezerTrack) return res.json({ track: deezerTrack });

      // Fallback to Spotify
      const track = await spotifyService.searchTrack(title, artist || '');
      if (!track) return res.status(404).json({ message: 'Track not found' });

      res.json({ track });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * GET /api/spotify/preview/:songId
   * Get audio preview URL for a specific song from our database
   * Priority: cached DB → Deezer (free previews) → Spotify
   */
  getPreview: async (req, res) => {
    try {
      const { songId } = req.params;
      
      // Get song details from our DB
      const [songs] = await db.query(
        'SELECT s.title, s.audio_url, s.cover_image, a.name as artist_name FROM songs s JOIN artists a ON s.artist_id = a.artist_id WHERE s.song_id = ?',
        [songId]
      );

      if (songs.length === 0) return res.status(404).json({ message: 'Song not found' });

      const song = songs[0];

      // If we already have a working audio_url cached, return it
      if (song.audio_url && song.audio_url.startsWith('http')) {
        return res.json({
          preview_url: song.audio_url,
          cover_image: song.cover_image,
          title: song.title,
          artist: song.artist_name
        });
      }

      // Try Deezer first (free, always has previews)
      const deezerTrack = await deezerService.searchTrack(song.title, song.artist_name);
      
      if (deezerTrack && deezerTrack.preview_url) {
        // Cache the preview URL in our DB for next time
        await db.query('UPDATE songs SET audio_url = ? WHERE song_id = ?', [deezerTrack.preview_url, songId]);

        return res.json({
          preview_url: deezerTrack.preview_url,
          cover_image: song.cover_image, // Keep Spotify's HD cover art
          title: song.title,
          artist: song.artist_name,
          album: deezerTrack.album,
          source: 'deezer'
        });
      }

      // Fallback: try Spotify (might have preview for some tracks)
      try {
        const spotifyTrack = await spotifyService.searchTrack(song.title, song.artist_name);
        if (spotifyTrack?.preview_url) {
          await db.query('UPDATE songs SET audio_url = ? WHERE song_id = ?', [spotifyTrack.preview_url, songId]);
          return res.json({
            preview_url: spotifyTrack.preview_url,
            spotify_url: spotifyTrack.spotify_url,
            cover_image: song.cover_image,
            title: song.title,
            artist: song.artist_name,
            source: 'spotify'
          });
        }
      } catch {}

      // No preview available from either source
      res.json({
        preview_url: null,
        cover_image: song.cover_image,
        title: song.title,
        artist: song.artist_name,
        message: 'No audio preview available'
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * POST /api/spotify/sync-all
   * Fetch data for ALL songs — Spotify for covers, Deezer for audio previews
   */
  syncAllSongs: async (req, res) => {
    try {
      const [songs] = await db.query(
        'SELECT s.song_id, s.title, a.name as artist_name FROM songs s JOIN artists a ON s.artist_id = a.artist_id'
      );

      let updated = 0;
      let previewCount = 0;
      let failed = 0;
      const results = [];

      for (const song of songs) {
        const updates = {};

        // Get cover art from Spotify (HD quality)
        try {
          const spotifyTrack = await spotifyService.searchTrack(song.title, song.artist_name);
          if (spotifyTrack?.cover_art?.large) {
            updates.cover_image = spotifyTrack.cover_art.large;
          }
        } catch {}

        // Get audio preview from Deezer (always available)
        const deezerTrack = await deezerService.searchTrack(song.title, song.artist_name);
        if (deezerTrack?.preview_url) {
          updates.audio_url = deezerTrack.preview_url;
          previewCount++;
        }

        if (Object.keys(updates).length > 0) {
          const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
          await db.query(`UPDATE songs SET ${setClauses} WHERE song_id = ?`, [...Object.values(updates), song.song_id]);
          updated++;
        } else {
          failed++;
        }

        results.push({
          song_id: song.song_id,
          title: song.title,
          status: Object.keys(updates).length > 0 ? 'synced' : 'not_found',
          has_preview: !!deezerTrack?.preview_url,
          cover_updated: !!updates.cover_image
        });

        // Rate limiting
        await new Promise(r => setTimeout(r, 200));
      }

      res.json({
        message: `Synced ${updated} songs with ${previewCount} audio previews, ${failed} not found`,
        total: songs.length,
        updated,
        previewCount,
        failed,
        results
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = spotifyController;
