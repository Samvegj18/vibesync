-- =============================================
-- VIBESYNC - Stored Procedures
-- =============================================
-- Stored Procedures = Reusable SQL functions
-- stored in the database for efficiency
-- =============================================

USE vibesync;

-- PROCEDURE 1: Get songs by mood
-- Returns all songs matching a specific mood
DELIMITER //
CREATE PROCEDURE sp_get_songs_by_mood(IN p_mood_name VARCHAR(50))
BEGIN
    SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
           a.name AS artist_name, m.mood_name, m.mood_color
    FROM songs s
    INNER JOIN artists a ON s.artist_id = a.artist_id
    INNER JOIN song_mood sm ON s.song_id = sm.song_id
    INNER JOIN moods m ON sm.mood_id = m.mood_id
    WHERE m.mood_name = p_mood_name
    ORDER BY s.play_count DESC;
END //
DELIMITER ;

-- PROCEDURE 2: Get user dashboard data
-- Returns a user's stats, playlists, and recent activity
DELIMITER //
CREATE PROCEDURE sp_get_user_dashboard(IN p_user_id INT)
BEGIN
    -- Result 1: User stats
    SELECT u.*, 
           COUNT(DISTINCT p.playlist_id) AS playlist_count,
           COUNT(DISTINCT f.following_id) AS following_count
    FROM users u
    LEFT JOIN playlists p ON u.user_id = p.user_id
    LEFT JOIN followers f ON u.user_id = f.follower_id
    WHERE u.user_id = p_user_id
    GROUP BY u.user_id;
    
    -- Result 2: Recent listening history
    SELECT s.title, a.name AS artist_name, s.cover_image, lh.played_at
    FROM listening_history lh
    INNER JOIN songs s ON lh.song_id = s.song_id
    INNER JOIN artists a ON s.artist_id = a.artist_id
    WHERE lh.user_id = p_user_id
    ORDER BY lh.played_at DESC
    LIMIT 10;
END //
DELIMITER ;

-- PROCEDURE 3: Get playlist engagement stats
-- Shows likes, comments, and song count for a playlist
DELIMITER //
CREATE PROCEDURE sp_playlist_engagement(IN p_playlist_id INT)
BEGIN
    SELECT 
        p.name AS playlist_name,
        u.username AS creator,
        COUNT(DISTINCT ps.song_id) AS total_songs,
        COUNT(DISTINCT l.like_id) AS total_likes,
        COUNT(DISTINCT c.comment_id) AS total_comments
    FROM playlists p
    INNER JOIN users u ON p.user_id = u.user_id
    LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
    LEFT JOIN likes l ON p.playlist_id = l.playlist_id
    LEFT JOIN comments c ON p.playlist_id = c.playlist_id
    WHERE p.playlist_id = p_playlist_id
    GROUP BY p.playlist_id;
END //
DELIMITER ;

-- PROCEDURE 4: Calculate trending mood of the day
DELIMITER //
CREATE PROCEDURE sp_trending_mood()
BEGIN
    SELECT m.mood_name, m.mood_color, m.mood_icon,
           COUNT(lh.history_id) AS listen_count
    FROM listening_history lh
    INNER JOIN song_mood sm ON lh.song_id = sm.song_id
    INNER JOIN moods m ON sm.mood_id = m.mood_id
    WHERE lh.played_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    GROUP BY m.mood_id
    ORDER BY listen_count DESC
    LIMIT 1;
END //
DELIMITER ;
