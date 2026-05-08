-- =============================================
-- VIBESYNC - SQL Views
-- =============================================
-- Views = Virtual tables created from queries
-- They simplify complex queries for reuse
-- =============================================

USE vibesync;

-- VIEW 1: Song details with artist name
-- Instead of writing a JOIN every time, use this view
CREATE OR REPLACE VIEW vw_song_details AS
SELECT 
    s.song_id, s.title, s.duration, s.cover_image, 
    s.audio_url, s.play_count, s.created_at,
    a.artist_id, a.name AS artist_name, a.avatar AS artist_avatar
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id;

-- VIEW 2: Playlist details with creator info and stats
CREATE OR REPLACE VIEW vw_playlist_details AS
SELECT 
    p.playlist_id, p.name, p.description, p.cover_image,
    p.visibility, p.created_at,
    u.user_id, u.username, u.avatar AS user_avatar,
    COUNT(DISTINCT ps.song_id) AS song_count,
    COUNT(DISTINCT l.like_id) AS like_count
FROM playlists p
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
LEFT JOIN likes l ON p.playlist_id = l.playlist_id
GROUP BY p.playlist_id;

-- VIEW 3: User profile stats
CREATE OR REPLACE VIEW vw_user_stats AS
SELECT 
    u.user_id, u.username, u.email, u.avatar, u.bio,
    u.vibe_score, u.listening_streak, u.created_at,
    COUNT(DISTINCT p.playlist_id) AS playlist_count,
    COUNT(DISTINCT f1.following_id) AS following_count,
    COUNT(DISTINCT f2.follower_id) AS follower_count
FROM users u
LEFT JOIN playlists p ON u.user_id = p.user_id
LEFT JOIN followers f1 ON u.user_id = f1.follower_id
LEFT JOIN followers f2 ON u.user_id = f2.following_id
GROUP BY u.user_id;

-- VIEW 4: Trending songs (top played)
CREATE OR REPLACE VIEW vw_trending_songs AS
SELECT 
    s.song_id, s.title, s.duration, s.cover_image, s.play_count,
    a.name AS artist_name,
    COUNT(DISTINCT sm.mood_id) AS mood_count
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id
LEFT JOIN song_mood sm ON s.song_id = sm.song_id
GROUP BY s.song_id
ORDER BY s.play_count DESC;

-- VIEW 5: Mood popularity (how many songs per mood)
CREATE OR REPLACE VIEW vw_mood_popularity AS
SELECT 
    m.mood_id, m.mood_name, m.mood_color, m.mood_icon,
    COUNT(sm.song_id) AS song_count,
    COALESCE(SUM(s.play_count), 0) AS total_plays
FROM moods m
LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id
LEFT JOIN songs s ON sm.song_id = s.song_id
GROUP BY m.mood_id
ORDER BY total_plays DESC;
