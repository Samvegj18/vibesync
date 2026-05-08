-- =============================================
-- VIBESYNC - Seed Data (Real Songs with Cover Art)
-- =============================================
-- Run AFTER schema.sql to populate tables
-- =============================================

USE vibesync;

-- SEED ARTISTS (10 artists with real avatar URLs)
INSERT INTO artists (name, bio, avatar) VALUES
('The Weeknd', 'Canadian singer known for dark R&B vibes', 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26571c'),
('Billie Eilish', 'Gen-Z icon with haunting melodies', 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf'),
('Travis Scott', 'Houston rapper with psychedelic trap sound', 'https://i.scdn.co/image/ab6761610000e5eb19c2790744c792d05570bb71'),
('Lana Del Rey', 'Cinematic sad-girl aesthetic queen', 'https://i.scdn.co/image/ab6761610000e5ebb99cacf8acd5378206767261'),
('Eminem', 'Rap God - raw energy and lyrical power', 'https://i.scdn.co/image/ab6761610000e5eba00b11c129f27a75f0058c7a'),
('Dua Lipa', 'Pop queen with infectious dance tracks', 'https://i.scdn.co/image/ab6761610000e5eb1bbee4a02b96bcc8a85a58e3'),
('Post Malone', 'Genre-blending artist with emotional depth', 'https://i.scdn.co/image/ab6761610000e5ebe17c0aa1714a03d62b5ce4e0'),
('Ariana Grande', 'Powerhouse vocalist with pop perfection', 'https://i.scdn.co/image/ab6761610000e5eb40b5c07ab77b6b1a9075fdc0'),
('Kendrick Lamar', 'Conscious hip-hop genius', 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff0a38'),
('Taylor Swift', 'Storytelling mastermind across genres', 'https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676');

-- SEED MOODS (12 moods with colors and icons)
INSERT INTO moods (mood_name, mood_color, mood_icon) VALUES
('Heartbreak', '#ff4757', 'heart-crack'),
('Gym', '#ff6348', 'dumbbell'),
('Lonely', '#5f27cd', 'cloud-rain'),
('Study', '#54a0ff', 'book-open'),
('Coding', '#00d2d3', 'code'),
('Late Night', '#341f97', 'moon'),
('Romantic', '#ff6b81', 'heart'),
('Party', '#feca57', 'party-popper'),
('Rage', '#ee5a24', 'flame'),
('Chill', '#1dd1a1', 'leaf'),
('Sad', '#576574', 'cloud'),
('Happy', '#f368e0', 'smile');

-- SEED SONGS (36 songs with REAL cover art & audio previews)
INSERT INTO songs (title, duration, artist_id, cover_image, audio_url, play_count) VALUES
-- The Weeknd (artist_id = 1)
('Blinding Lights', 200, 1, 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', 'https://p.scdn.co/mp3-preview/5e5ee1901b4b364b0e5e9c8852a7ca55bd4dce82', 15000),
('Save Your Tears', 215, 1, 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', 'https://p.scdn.co/mp3-preview/5e5ee1901b4b364b0e5e9c8852a7ca55bd4dce82', 12000),
('After Hours', 361, 1, 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', NULL, 9500),
-- Billie Eilish (artist_id = 2)
('Lovely', 200, 2, 'https://i.scdn.co/image/ab67616d0000b273f79443b4e3b5076e0141e252', NULL, 18000),
('When The Party''s Over', 196, 2, 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e', NULL, 14000),
('Ocean Eyes', 200, 2, 'https://i.scdn.co/image/ab67616d0000b273cb94479e579710a7e7ac44a5', NULL, 11000),
-- Travis Scott (artist_id = 3)
('SICKO MODE', 312, 3, 'https://i.scdn.co/image/ab67616d0000b273072e9faef2ef7b6db63834a3', NULL, 20000),
('goosebumps', 243, 3, 'https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7571e0', NULL, 16000),
('FE!N', 193, 3, 'https://i.scdn.co/image/ab67616d0000b2732659b5d2e5b3be8e12c8e5c0', NULL, 22000),
-- Lana Del Rey (artist_id = 4)
('Summertime Sadness', 265, 4, 'https://i.scdn.co/image/ab67616d0000b2739a2e1cee20de2d3b9f6484a3', NULL, 13000),
('Young and Beautiful', 236, 4, 'https://i.scdn.co/image/ab67616d0000b273a1c37f3fd969287c03482c3b', NULL, 10000),
('Video Games', 281, 4, 'https://i.scdn.co/image/ab67616d0000b2739a2e1cee20de2d3b9f6484a3', NULL, 8500),
-- Eminem (artist_id = 5)
('Lose Yourself', 326, 5, 'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4', NULL, 25000),
('Till I Collapse', 297, 5, 'https://i.scdn.co/image/ab67616d0000b273dbb3dd82da45b7d7f31b1b42', NULL, 21000),
('Not Afraid', 262, 5, 'https://i.scdn.co/image/ab67616d0000b273726d48d93d02e1271774f023', NULL, 17000),
-- Dua Lipa (artist_id = 6)
('Levitating', 203, 6, 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946', NULL, 19000),
('Don''t Start Now', 183, 6, 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946', NULL, 16500),
('Dance The Night', 176, 6, 'https://i.scdn.co/image/ab67616d0000b27389fa685e3c42b6826bfaa353', NULL, 14500),
-- Post Malone (artist_id = 7)
('Sunflower', 158, 7, 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f', NULL, 23000),
('Circles', 215, 7, 'https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02', NULL, 18500),
('I Fall Apart', 222, 7, 'https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02', NULL, 12500),
-- Ariana Grande (artist_id = 8)
('thank u, next', 207, 8, 'https://i.scdn.co/image/ab67616d0000b2736c3949f5e78e7a34ab0b9eb4', NULL, 20000),
('7 rings', 178, 8, 'https://i.scdn.co/image/ab67616d0000b2736c3949f5e78e7a34ab0b9eb4', NULL, 17500),
('positions', 173, 8, 'https://i.scdn.co/image/ab67616d0000b273c3af0c2b51bc55e0715c5db1', NULL, 13500),
-- Kendrick Lamar (artist_id = 9)
('HUMBLE.', 177, 9, 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699', NULL, 19500),
('POWER', 250, 9, 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699', NULL, 15500),
('Swimming Pools', 314, 9, 'https://i.scdn.co/image/ab67616d0000b2737b8957e84321e4ccc6e2e214', NULL, 12000),
-- Taylor Swift (artist_id = 10)
('Anti-Hero', 200, 10, 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5', NULL, 22000),
('Cruel Summer', 178, 10, 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647', NULL, 19000),
('Love Story', 235, 10, 'https://i.scdn.co/image/ab67616d0000b273a48964b5a22b2c0ab1bf187b', NULL, 16000),
-- Extra songs for variety
('Starboy', 230, 1, 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', NULL, 17000),
('bad guy', 194, 2, 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6d6', NULL, 21000),
('HIGHEST IN THE ROOM', 176, 3, 'https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7571e0', NULL, 14000),
('Born to Die', 287, 4, 'https://i.scdn.co/image/ab67616d0000b2739a2e1cee20de2d3b9f6484a3', NULL, 9000),
('Mockingbird', 250, 5, 'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4', NULL, 16000),
('New Rules', 209, 6, 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946', NULL, 15000);

-- SEED SONG_MOOD mappings (songs belong to multiple moods)
INSERT INTO song_mood (song_id, mood_id) VALUES
-- Heartbreak (mood_id = 1)
(2, 1), (3, 1), (4, 1), (5, 1), (10, 1), (11, 1), (21, 1), (34, 1), (35, 1),
-- Gym (mood_id = 2)
(7, 2), (9, 2), (13, 2), (14, 2), (15, 2), (25, 2), (26, 2),
-- Lonely (mood_id = 3)
(3, 3), (4, 3), (5, 3), (6, 3), (10, 3), (12, 3), (21, 3),
-- Study (mood_id = 4)
(6, 4), (12, 4), (20, 4), (19, 4),
-- Coding (mood_id = 5)
(1, 5), (7, 5), (8, 5), (31, 5), (32, 5), (33, 5),
-- Late Night (mood_id = 6)
(1, 6), (3, 6), (8, 6), (10, 6), (31, 6), (33, 6), (20, 6),
-- Romantic (mood_id = 7)
(2, 7), (11, 7), (24, 7), (30, 7), (19, 7),
-- Party (mood_id = 8)
(1, 8), (7, 8), (9, 8), (16, 8), (17, 8), (18, 8), (22, 8), (23, 8), (36, 8),
-- Rage (mood_id = 9)
(9, 9), (13, 9), (14, 9), (25, 9), (15, 9),
-- Chill (mood_id = 10)
(6, 10), (19, 10), (20, 10), (12, 10), (29, 10),
-- Sad (mood_id = 11)
(4, 11), (5, 11), (10, 11), (21, 11), (34, 11), (35, 11), (27, 11),
-- Happy (mood_id = 12)
(16, 12), (17, 12), (18, 12), (22, 12), (28, 12), (29, 12), (30, 12), (36, 12);

-- SEED USERS (5 demo users - passwords are bcrypt hash of "password123")
-- Hash: $2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa
INSERT INTO users (username, email, password_hash, avatar, bio, vibe_score, listening_streak) VALUES
('vibemaster', 'vibe@demo.com', '$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibemaster', 'Music is my therapy 🎵', 420, 15),
('nightowl', 'night@demo.com', '$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nightowl', 'Late night drives and lo-fi beats', 380, 12),
('beatdrop', 'beat@demo.com', '$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatdrop', 'Bass boosted everything 🔊', 350, 8),
('melodymuse', 'melody@demo.com', '$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=melodymuse', 'Finding beauty in every note', 290, 20),
('rhythmking', 'rhythm@demo.com', '$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rhythmking', 'Hip-hop head since day one', 410, 10);

-- SEED PLAYLISTS
INSERT INTO playlists (user_id, name, description, visibility) VALUES
(1, 'Midnight Echoes', 'Songs for those 3am feelings', 'public'),
(1, 'Locked In Mode', 'Gym playlist that hits different', 'public'),
(2, 'Late Night Drive', 'Windows down, music up', 'public'),
(2, 'Coding Flow', 'Focus music for developers', 'public'),
(3, 'Heartbreak Hotel', 'When you need to feel the pain', 'public'),
(3, 'Party Starter', 'Get the vibes going', 'public'),
(4, 'Soft Hours', 'Romantic vibes only', 'public'),
(4, 'Study Lounge', 'Background music for studying', 'private'),
(5, 'Rage Mode', 'Pure aggression and energy', 'public'),
(5, 'Chill Vibes', 'Just relax and breathe', 'public');

-- SEED PLAYLIST_SONGS
INSERT INTO playlist_songs (playlist_id, song_id) VALUES
(1, 3), (1, 4), (1, 10), (1, 31), (1, 20),
(2, 9), (2, 13), (2, 14), (2, 25), (2, 15),
(3, 1), (3, 8), (3, 31), (3, 33), (3, 20),
(4, 6), (4, 12), (4, 19), (4, 20), (4, 32),
(5, 4), (5, 5), (5, 10), (5, 21), (5, 34),
(6, 7), (6, 16), (6, 17), (6, 22), (6, 23),
(7, 11), (7, 24), (7, 30), (7, 19), (7, 2),
(8, 6), (8, 12), (8, 19), (8, 29),
(9, 9), (9, 13), (9, 14), (9, 25), (9, 15),
(10, 19), (10, 20), (10, 6), (10, 29), (10, 12);

-- SEED LIKES
INSERT INTO likes (user_id, playlist_id) VALUES
(1, 3), (1, 5), (1, 6), (2, 1), (2, 2), (2, 9),
(3, 1), (3, 4), (3, 7), (4, 2), (4, 3), (4, 10),
(5, 1), (5, 5), (5, 6);

-- SEED COMMENTS
INSERT INTO comments (user_id, playlist_id, comment_text) VALUES
(2, 1, 'This playlist hits different at 3am 💫'),
(3, 1, 'Exactly what I needed tonight'),
(4, 2, 'Gym motivation on another level 🔥'),
(5, 3, 'Late night drives with this playlist = therapy'),
(1, 5, 'The pain is beautiful 💔'),
(4, 6, 'Party vibes activated! 🎉'),
(5, 7, 'Romantic playlist of the year ❤️'),
(1, 4, 'Coding with this on repeat, absolute focus mode');

-- SEED FOLLOWERS
INSERT INTO followers (follower_id, following_id) VALUES
(1, 2), (1, 3), (1, 4), (2, 1), (2, 3), (2, 5),
(3, 1), (3, 4), (4, 1), (4, 2), (4, 5), (5, 1), (5, 3);

-- SEED LISTENING HISTORY
INSERT INTO listening_history (user_id, song_id) VALUES
(1, 1), (1, 3), (1, 4), (1, 7), (1, 10), (1, 19), (1, 31),
(2, 1), (2, 8), (2, 20), (2, 31), (2, 33),
(3, 4), (3, 5), (3, 7), (3, 9), (3, 13), (3, 16),
(4, 6), (4, 11), (4, 12), (4, 19), (4, 24), (4, 30),
(5, 9), (5, 13), (5, 14), (5, 25), (5, 15), (5, 7);
