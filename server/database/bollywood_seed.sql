-- =============================================
-- VIBESYNC - Bollywood Songs Addition
-- Run this AFTER the main seed.sql
-- =============================================

USE vibesync;

-- Add Bollywood Artists (starting from ID 11)
INSERT INTO artists (name, bio, avatar) VALUES
('Arijit Singh', 'India''s most beloved playback singer, known for soulful melodies', 'default_artist.png'),
('Pritam', 'Bollywood composer known for hit film soundtracks', 'default_artist.png'),
('A.R. Rahman', 'Oscar-winning composer, the Mozart of Madras', 'default_artist.png'),
('Shreya Ghoshal', 'One of the most versatile female playback singers in India', 'default_artist.png'),
('Atif Aslam', 'Pakistani-born singer with massive Bollywood hits', 'default_artist.png'),
('Jubin Nautiyal', 'Rising Bollywood singer known for romantic tracks', 'default_artist.png'),
('KK', 'Legendary playback singer remembered for timeless melodies', 'default_artist.png'),
('Darshan Raval', 'Popular indie and Bollywood singer-songwriter', 'default_artist.png');

-- Add Bollywood Songs
INSERT INTO songs (title, duration, artist_id, cover_image, play_count) VALUES
-- Arijit Singh (artist_id = 11)
('Tum Hi Ho', 262, 11, 'default_cover.png', 28500),
('Channa Mereya', 289, 11, 'default_cover.png', 24300),
('Kesariya', 268, 11, 'default_cover.png', 31200),
('Apna Bana Le', 274, 11, 'default_cover.png', 19800),
('Phir Bhi Tumko Chahunga', 315, 11, 'default_cover.png', 22100),
('Agar Tum Saath Ho', 342, 11, 'default_cover.png', 20500),

-- Pritam (artist_id = 12)
('Gerua', 308, 12, 'default_cover.png', 18700),
('Raabta', 258, 12, 'default_cover.png', 15300),

-- A.R. Rahman (artist_id = 13)
('Jai Ho', 330, 13, 'default_cover.png', 26800),
('Tere Bina', 318, 13, 'default_cover.png', 16900),
('Kun Faya Kun', 458, 13, 'default_cover.png', 21400),
('Roja Jaaneman', 290, 13, 'default_cover.png', 14200),

-- Shreya Ghoshal (artist_id = 14)
('Ghoomar', 280, 14, 'default_cover.png', 17600),
('Deewani Mastani', 326, 14, 'default_cover.png', 19200),
('Sun Raha Hai Na Tu', 305, 14, 'default_cover.png', 23100),

-- Atif Aslam (artist_id = 15)
('Dil Diyan Gallan', 288, 15, 'default_cover.png', 21700),
('Pehli Dafa', 262, 15, 'default_cover.png', 14800),
('Jeene Laga Hoon', 245, 15, 'default_cover.png', 16300),

-- Jubin Nautiyal (artist_id = 16)
('Lut Gaye', 248, 16, 'default_cover.png', 27500),
('Raataan Lambiyan', 237, 16, 'default_cover.png', 25900),
('Manike', 209, 16, 'default_cover.png', 18400),

-- KK (artist_id = 17)
('Pal', 286, 17, 'default_cover.png', 19800),
('Aankhon Mein Teri', 295, 17, 'default_cover.png', 17200),
('Khuda Jaane', 308, 17, 'default_cover.png', 15600),

-- Darshan Raval (artist_id = 18)
('Tera Zikr', 222, 18, 'default_cover.png', 16100),
('Kamariya', 196, 18, 'default_cover.png', 14500),
('Hawa Banke', 242, 18, 'default_cover.png', 13200);

-- Associate Bollywood songs with moods
-- Get the song IDs dynamically (they'll start from 37 since we have 36 existing songs)
INSERT INTO song_mood (song_id, mood_id) VALUES
-- Tum Hi Ho (Heartbreak, Romantic, Sad)
(37, 1), (37, 10), (37, 8),
-- Channa Mereya (Heartbreak, Sad)
(38, 1), (38, 8),
-- Kesariya (Romantic, Happy)
(39, 10), (39, 4),
-- Apna Bana Le (Romantic)
(40, 10),
-- Phir Bhi Tumko Chahunga (Heartbreak, Romantic, Sad)
(41, 1), (41, 10), (41, 8),
-- Agar Tum Saath Ho (Sad, Romantic, Late Night)
(42, 8), (42, 10), (42, 6),
-- Gerua (Romantic, Happy)
(43, 10), (43, 4),
-- Raabta (Romantic)
(44, 10),
-- Jai Ho (Happy, Party, Gym)
(45, 4), (45, 3), (45, 5),
-- Tere Bina (Sad, Romantic)
(46, 8), (46, 10),
-- Kun Faya Kun (Chill, Lonely, Late Night)
(47, 12), (47, 7), (47, 6),
-- Roja Jaaneman (Romantic)
(48, 10),
-- Ghoomar (Party, Happy)
(49, 3), (49, 4),
-- Deewani Mastani (Romantic)
(50, 10),
-- Sun Raha Hai Na Tu (Heartbreak, Sad)
(51, 1), (51, 8),
-- Dil Diyan Gallan (Romantic, Happy)
(52, 10), (52, 4),
-- Pehli Dafa (Romantic)
(53, 10),
-- Jeene Laga Hoon (Happy, Romantic)
(54, 4), (54, 10),
-- Lut Gaye (Heartbreak, Sad, Romantic)
(55, 1), (55, 8), (55, 10),
-- Raataan Lambiyan (Romantic, Late Night, Chill)
(56, 10), (56, 6), (56, 12),
-- Manike (Party, Happy)
(57, 3), (57, 4),
-- Pal (Sad, Lonely, Late Night)
(58, 8), (58, 7), (58, 6),
-- Aankhon Mein Teri (Romantic)
(59, 10),
-- Khuda Jaane (Romantic, Heartbreak)
(60, 10), (60, 1),
-- Tera Zikr (Heartbreak, Sad, Lonely)
(61, 1), (61, 8), (61, 7),
-- Kamariya (Party, Gym)
(62, 3), (62, 5),
-- Hawa Banke (Romantic, Chill)
(63, 10), (63, 12);
