-- =============================================
-- VIBESYNC - Important SQL Queries Reference
-- =============================================
-- 20 useful queries demonstrating DBMS concepts
-- =============================================

USE vibesync;

-- =============================================
-- QUERY 1: INNER JOIN - Get all songs with artist names
-- INNER JOIN returns only matching rows from both tables
-- =============================================
SELECT s.title, s.duration, a.name AS artist_name
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id
ORDER BY s.title;

-- =============================================
-- QUERY 2: LEFT JOIN - All users with their playlist count (even users with 0)
-- LEFT JOIN keeps ALL rows from left table, even without matches
-- =============================================
SELECT u.username, COUNT(p.playlist_id) AS playlist_count
FROM users u
LEFT JOIN playlists p ON u.user_id = p.user_id
GROUP BY u.user_id;

-- =============================================
-- QUERY 3: GROUP BY + ORDER BY - Most listened songs
-- GROUP BY aggregates rows, ORDER BY sorts results
-- =============================================
SELECT s.title, a.name AS artist, s.play_count
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id
GROUP BY s.song_id
ORDER BY s.play_count DESC
LIMIT 10;

-- =============================================
-- QUERY 4: HAVING - Artists with more than 3 songs
-- HAVING filters groups (WHERE filters rows)
-- =============================================
SELECT a.name, COUNT(s.song_id) AS song_count
FROM artists a
INNER JOIN songs s ON a.artist_id = s.artist_id
GROUP BY a.artist_id
HAVING COUNT(s.song_id) > 3;

-- =============================================
-- QUERY 5: Nested/Subquery - Users who liked the most popular playlist
-- =============================================
SELECT u.username, u.email
FROM users u
WHERE u.user_id IN (
    SELECT l.user_id FROM likes l
    WHERE l.playlist_id = (
        SELECT playlist_id FROM likes
        GROUP BY playlist_id
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )
);

-- =============================================
-- QUERY 6: Multiple JOINs - Songs in a playlist with artist info
-- =============================================
SELECT p.name AS playlist, s.title AS song, a.name AS artist
FROM playlist_songs ps
INNER JOIN playlists p ON ps.playlist_id = p.playlist_id
INNER JOIN songs s ON ps.song_id = s.song_id
INNER JOIN artists a ON s.artist_id = a.artist_id
WHERE p.playlist_id = 1;

-- =============================================
-- QUERY 7: Aggregate - Top moods by total play count
-- =============================================
SELECT m.mood_name, m.mood_color, 
       SUM(s.play_count) AS total_plays,
       COUNT(s.song_id) AS song_count
FROM moods m
INNER JOIN song_mood sm ON m.mood_id = sm.mood_id
INNER JOIN songs s ON sm.song_id = s.song_id
GROUP BY m.mood_id
ORDER BY total_plays DESC;

-- =============================================
-- QUERY 8: Self JOIN on followers - Mutual followers
-- =============================================
SELECT u1.username AS user1, u2.username AS user2
FROM followers f1
INNER JOIN followers f2 ON f1.follower_id = f2.following_id 
    AND f1.following_id = f2.follower_id
INNER JOIN users u1 ON f1.follower_id = u1.user_id
INNER JOIN users u2 ON f1.following_id = u2.user_id
WHERE f1.follower_id < f1.following_id;

-- =============================================
-- QUERY 9: Trending playlists (most liked)
-- =============================================
SELECT p.name, u.username AS creator, 
       COUNT(l.like_id) AS likes
FROM playlists p
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN likes l ON p.playlist_id = l.playlist_id
WHERE p.visibility = 'public'
GROUP BY p.playlist_id
ORDER BY likes DESC
LIMIT 10;

-- =============================================
-- QUERY 10: Active users (most listening history)
-- =============================================
SELECT u.username, u.vibe_score,
       COUNT(lh.history_id) AS songs_played
FROM users u
INNER JOIN listening_history lh ON u.user_id = lh.user_id
GROUP BY u.user_id
ORDER BY songs_played DESC;

-- =============================================
-- QUERY 11: Songs that belong to multiple moods
-- =============================================
SELECT s.title, a.name AS artist,
       GROUP_CONCAT(m.mood_name SEPARATOR ', ') AS moods
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id
INNER JOIN song_mood sm ON s.song_id = sm.song_id
INNER JOIN moods m ON sm.mood_id = m.mood_id
GROUP BY s.song_id
HAVING COUNT(m.mood_id) > 1;

-- =============================================
-- QUERY 12: User feed - playlists from followed users
-- =============================================
SELECT p.name, p.description, u.username, p.created_at
FROM playlists p
INNER JOIN users u ON p.user_id = u.user_id
WHERE p.user_id IN (
    SELECT following_id FROM followers WHERE follower_id = 1
)
AND p.visibility = 'public'
ORDER BY p.created_at DESC;

-- =============================================
-- QUERY 13: Playlist with most diverse moods
-- =============================================
SELECT p.name, COUNT(DISTINCT sm.mood_id) AS mood_variety
FROM playlists p
INNER JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
INNER JOIN song_mood sm ON ps.song_id = sm.song_id
GROUP BY p.playlist_id
ORDER BY mood_variety DESC;

-- =============================================
-- QUERY 14: Average play count per mood category
-- =============================================
SELECT m.mood_name, 
       ROUND(AVG(s.play_count)) AS avg_plays,
       MIN(s.play_count) AS min_plays,
       MAX(s.play_count) AS max_plays
FROM moods m
INNER JOIN song_mood sm ON m.mood_id = sm.mood_id
INNER JOIN songs s ON sm.song_id = s.song_id
GROUP BY m.mood_id
ORDER BY avg_plays DESC;

-- =============================================
-- QUERY 15: Users who follow each other (mutual)
-- =============================================
SELECT u.username, COUNT(f.following_id) AS following_count
FROM users u
LEFT JOIN followers f ON u.user_id = f.follower_id
GROUP BY u.user_id
ORDER BY following_count DESC;

-- =============================================
-- QUERY 16: Most commented playlists
-- =============================================
SELECT p.name, u.username, COUNT(c.comment_id) AS comments
FROM playlists p
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN comments c ON p.playlist_id = c.playlist_id
GROUP BY p.playlist_id
HAVING COUNT(c.comment_id) > 0
ORDER BY comments DESC;

-- =============================================
-- QUERY 17: Songs never added to any playlist
-- =============================================
SELECT s.title, a.name AS artist
FROM songs s
INNER JOIN artists a ON s.artist_id = a.artist_id
WHERE s.song_id NOT IN (
    SELECT DISTINCT song_id FROM playlist_songs
);

-- =============================================
-- QUERY 18: User engagement score
-- =============================================
SELECT u.username,
       COUNT(DISTINCT p.playlist_id) AS playlists_created,
       COUNT(DISTINCT l.like_id) AS likes_given,
       COUNT(DISTINCT c.comment_id) AS comments_made,
       COUNT(DISTINCT lh.history_id) AS songs_played
FROM users u
LEFT JOIN playlists p ON u.user_id = p.user_id
LEFT JOIN likes l ON u.user_id = l.user_id
LEFT JOIN comments c ON u.user_id = c.user_id
LEFT JOIN listening_history lh ON u.user_id = lh.user_id
GROUP BY u.user_id
ORDER BY (COUNT(DISTINCT p.playlist_id) + COUNT(DISTINCT l.like_id) + COUNT(DISTINCT c.comment_id)) DESC;

-- =============================================
-- QUERY 19: Platform overview stats
-- =============================================
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM songs) AS total_songs,
    (SELECT COUNT(*) FROM playlists) AS total_playlists,
    (SELECT COUNT(*) FROM artists) AS total_artists,
    (SELECT SUM(play_count) FROM songs) AS total_plays;

-- =============================================
-- QUERY 20: Monthly new user registrations
-- =============================================
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
       COUNT(*) AS new_users
FROM users
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;
